import { useEffect, useState } from "react";
import { wsService } from "./websocket";

export const useWebSocket = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    wsService.connect();

    const handleMessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages((prev) => [...prev, message]);
      } catch (error) {
        console.error("Failed to parse message:", event.data, error);
      }
    };

    wsService.socket?.addEventListener("message", handleMessage);

    return () => {
      wsService.socket?.removeEventListener("message", handleMessage);
    };
  }, []);

  return { messages, sendMessage: (msg) => wsService.sendMessage(msg) };
};
