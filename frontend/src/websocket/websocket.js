import { WS_URL } from '../constants';

class WebSocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = new WebSocket(WS_URL);

    this.socket.onopen = () => {
      console.log(" WebSocket connected!");
    };

    this.socket.onmessage = (event) => {
      console.log("Message received:", event.data);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected, reconnecting...");
      setTimeout(() => this.connect(), 3000);
    };
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn("WebSocket not connected.");
    }
  }
}

export const wsService = new WebSocketService();
