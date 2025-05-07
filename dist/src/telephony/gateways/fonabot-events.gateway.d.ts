import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export declare class FonaBotEventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    server: Server;
    private readonly logger;
    private readonly userSockets;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    private disconnect;
    emitCallStarted(userId: string, data: {
        call_log_id: string;
        provider_call_sid: string;
        phone_number_from: string;
        phone_number_to: string;
        ivr_flow_name: string;
    }): void;
    emitCallNodeChanged(userId: string, data: {
        call_log_id: string;
        node_client_id: string;
        node_type: string;
    }): void;
    emitCallInputReceived(userId: string, data: {
        call_log_id: string;
        input_type: 'dtmf' | 'speech';
        input_value: string;
    }): void;
    emitCallVariableUpdated(userId: string, data: {
        call_log_id: string;
        variable_name: string;
        new_value: any;
    }): void;
    emitCallEnded(userId: string, data: {
        call_log_id: string;
        status: string;
        duration: number;
    }): void;
}
