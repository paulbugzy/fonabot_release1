"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketService = void 0;
const socket_io_client_1 = require("socket.io-client");
class SocketService {
    constructor() {
        this.socket = null;
    }
    connect(token) {
        if (this.socket?.connected)
            return;
        this.socket = (0, socket_io_client_1.io)(`${import.meta.env.VITE_API_BASE_URL}/fonabot`, {
            auth: { token },
        });
        this.socket.on('connect', () => {
            console.log('Connected to FonaBot WebSocket');
        });
        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });
        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
    onCallStarted(callback) {
        this.socket?.on('fonabot_call_started', callback);
    }
    onCallNodeChanged(callback) {
        this.socket?.on('fonabot_call_node_changed', callback);
    }
    onCallInputReceived(callback) {
        this.socket?.on('fonabot_call_input_received', callback);
    }
    onCallVariableUpdated(callback) {
        this.socket?.on('fonabot_call_variable_updated', callback);
    }
    onCallEnded(callback) {
        this.socket?.on('fonabot_call_ended', callback);
    }
}
exports.socketService = new SocketService();
//# sourceMappingURL=socketService.js.map