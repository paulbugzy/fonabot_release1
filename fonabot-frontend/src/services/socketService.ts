import { io, Socket } from "socket.io-client";

const WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "https://fonabot.com";

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(`${WS_BASE_URL}/fonabot`, {
      auth: { token }
    });

    this.socket.on("connect", () => {
      console.log("Connected to FonaBot WebSocket");
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onCallStarted(callback: (data: any) => void) {
    this.socket?.on("fonabot_call_started", callback);
  }

  onCallNodeChanged(callback: (data: any) => void) {
    this.socket?.on("fonabot_call_node_changed", callback);
  }

  onCallInputReceived(callback: (data: any) => void) {
    this.socket?.on("fonabot_call_input_received", callback);
  }

  onCallVariableUpdated(callback: (data: any) => void) {
    this.socket?.on("fonabot_call_variable_updated", callback);
  }

  onCallEnded(callback: (data: any) => void) {
    this.socket?.on("fonabot_call_ended", callback);
  }
}

export const socketService = new SocketService();
