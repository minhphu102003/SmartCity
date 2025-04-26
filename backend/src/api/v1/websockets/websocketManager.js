import { WebSocketServer } from "ws";
import { handleLocationUpdate } from "../services/readLocation.js";
import { addClient, removeClient, broadcastMessage } from "./clients.js";

export const initializeWebSocket = (server) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    if (request.url === "/ws") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.send("Welcome to the WebSocket server!");
    addClient(ws);

    const pingInterval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.ping();
      }
    }, 30000); 

    ws.on("message", async (message) => {
      const decodedMessage = message.toString();
      console.log("Received message:", decodedMessage);
      try {
        const parsedMessage = JSON.parse(decodedMessage);
        if (parsedMessage.type === "update location") {
          const result = await handleLocationUpdate(parsedMessage);
          ws.send(JSON.stringify({ status: "success", data: result }));
          console.log(result);
        } else if (parsedMessage.type === "greeting" || parsedMessage.type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
        } else {
          ws.send(
            JSON.stringify({ status: "error", message: "Unknown message type" })
          );
          console.log("Unknown message type");
        }
      } catch (error) {
        console.error("Error parsing message:", error);
        ws.send(
          JSON.stringify({ status: "error", message: "Invalid message format" })
        );
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      removeClient(ws);
      clearInterval(pingInterval); 
    });
  });

  return wss;
};

export const sendMessageToFrontend = (message) => {
  broadcastMessage(message);
};
