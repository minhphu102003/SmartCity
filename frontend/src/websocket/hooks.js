import { useEffect, useState } from "react";
import { wsService } from "./websocket";

export const useWebSocket = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    wsService.connect();

    const handleMessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    wsService.socket?.addEventListener("message", handleMessage);

    return () => {
      wsService.socket?.removeEventListener("message", handleMessage);
    };
  }, []);

  return { messages, sendMessage: (msg) => wsService.sendMessage(msg) };
};
