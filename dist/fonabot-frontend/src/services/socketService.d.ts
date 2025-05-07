declare class SocketService {
    private socket;
    connect(token: string): void;
    disconnect(): void;
    onCallStarted(callback: (data: any) => void): void;
    onCallNodeChanged(callback: (data: any) => void): void;
    onCallInputReceived(callback: (data: any) => void): void;
    onCallVariableUpdated(callback: (data: any) => void): void;
    onCallEnded(callback: (data: any) => void): void;
}
export declare const socketService: SocketService;
export {};
