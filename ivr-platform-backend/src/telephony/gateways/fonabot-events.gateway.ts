import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: true,
  namespace: 'fonabot',
})
export class FonaBotEventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(FonaBotEventsGateway.name);
  private readonly userSockets = new Map<string, Set<Socket>>();

  constructor(private jwtService: JwtService) {}

async handleConnection(client: Socket) {
  console.log('Client connected:', client.id);

  // Try auth.token first (existing logic)
  let token = client.handshake.auth.token;
  let tokenSource = 'auth.token';

  // Fallback to Authorization header
  if (!token) {
    token = client.handshake.headers.authorization?.split(' ')[1];
    tokenSource = 'Authorization header';
  }

  if (!token) {
    this.disconnect(client, 'No authentication token provided');
    console.log('No token provided for client:', client.id);
    return;
  }

  try {
    const payload = this.jwtService.verify(token);
    const userId = payload.sub;
    console.log(`Valid token from ${tokenSource}:`, payload);

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(client);

    client.join(`user:${userId}`);
    this.logger.log(`Client connected: ${client.id} for user: ${userId}`);
  } catch (error) {
    console.log(`Invalid token from ${tokenSource}:`, error.message);
    this.disconnect(client, 'Invalid authentication token');
  }
}

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(client)) {
        sockets.delete(client);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
        this.logger.log(`Client disconnected: ${client.id} from user: ${userId}`);
        break;
      }
    }
  }

  private disconnect(client: Socket, reason: string) {
    client.emit('error', { message: reason });
    client.disconnect(true);
  }

  emitCallStarted(userId: string, data: {
    call_log_id: string;
    provider_call_sid: string;
    phone_number_from: string;
    phone_number_to: string;
    ivr_flow_name: string;
  }) {
    this.server.to(`user:${userId}`).emit('fonabot_call_started', data);
  }

  emitCallNodeChanged(userId: string, data: {
    call_log_id: string;
    node_client_id: string;
    node_type: string;
  }) {
    this.server.to(`user:${userId}`).emit('fonabot_call_node_changed', data);
  }

  emitCallInputReceived(userId: string, data: {
    call_log_id: string;
    input_type: 'dtmf' | 'speech';
    input_value: string;
  }) {
    this.server.to(`user:${userId}`).emit('fonabot_call_input_received', data);
  }

  emitCallVariableUpdated(userId: string, data: {
    call_log_id: string;
    variable_name: string;
    new_value: any;
  }) {
    this.server.to(`user:${userId}`).emit('fonabot_call_variable_updated', data);
  }

  emitCallEnded(userId: string, data: {
    call_log_id: string;
    status: string;
    duration: number;
  }) {
    this.server.to(`user:${userId}`).emit('fonabot_call_ended', data);
  }
}
