export type WSMessage = {
  type?: string;
  text?: string;
  message?: string;
  messages?: any[];
  error?: string;
};

export class WebSocketService {
  private socket: WebSocket | null = null;
  private token: string;
  private url: string;
  private onMessageCallback: ((msg: WSMessage) => void) | null = null;

  constructor(token: string, url: string) {
    this.token = token;
    this.url = url;
  }

  connect(onMessage: (msg: WSMessage) => void): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(`${this.url}?token=${this.token}`);
      this.onMessageCallback = onMessage;

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        resolve(true);
      };
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (this.onMessageCallback) this.onMessageCallback(data);
      };
      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
      };
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
    });
  }

  sendMessage(question: string, images: any[] = []) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }
    const message = {
      action: 'sendMessage',
      question,
      images
    };
    this.socket.send(JSON.stringify(message));
  }

  sendPayload(payload: object) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }
    this.socket.send(JSON.stringify(payload));
  }

  loadHistory() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }
    this.socket.send(JSON.stringify({ action: 'load_history' }));
  }

  clearConversation() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }
    this.socket.send(JSON.stringify({ action: 'clear_conversation' }));
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}