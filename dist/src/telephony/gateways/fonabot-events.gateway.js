"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FonaBotEventsGateway_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FonaBotEventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let FonaBotEventsGateway = FonaBotEventsGateway_1 = class FonaBotEventsGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(FonaBotEventsGateway_1.name);
        this.userSockets = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token;
            if (!token) {
                this.disconnect(client, 'No authentication token provided');
                return;
            }
            const payload = this.jwtService.verify(token);
            const userId = payload.sub;
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, new Set());
            }
            this.userSockets.get(userId).add(client);
            client.join(`user:${userId}`);
            this.logger.log(`Client connected: ${client.id} for user: ${userId}`);
        }
        catch (error) {
            this.disconnect(client, 'Invalid authentication token');
        }
    }
    handleDisconnect(client) {
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
    disconnect(client, reason) {
        client.emit('error', { message: reason });
        client.disconnect(true);
    }
    emitCallStarted(userId, data) {
        this.server.to(`user:${userId}`).emit('fonabot_call_started', data);
    }
    emitCallNodeChanged(userId, data) {
        this.server.to(`user:${userId}`).emit('fonabot_call_node_changed', data);
    }
    emitCallInputReceived(userId, data) {
        this.server.to(`user:${userId}`).emit('fonabot_call_input_received', data);
    }
    emitCallVariableUpdated(userId, data) {
        this.server.to(`user:${userId}`).emit('fonabot_call_variable_updated', data);
    }
    emitCallEnded(userId, data) {
        this.server.to(`user:${userId}`).emit('fonabot_call_ended', data);
    }
};
exports.FonaBotEventsGateway = FonaBotEventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_b = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _b : Object)
], FonaBotEventsGateway.prototype, "server", void 0);
exports.FonaBotEventsGateway = FonaBotEventsGateway = FonaBotEventsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: true,
        namespace: 'fonabot',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], FonaBotEventsGateway);
//# sourceMappingURL=fonabot-events.gateway.js.map