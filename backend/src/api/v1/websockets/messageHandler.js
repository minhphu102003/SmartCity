import { handleLocationUpdate } from "../services/readLocation.js";

const wsClients = [];

export const addClient = (ws) => {
    wsClients.push(ws);
};

export const removeClient = (ws) => {
    const index = wsClients.indexOf(ws);
    if (index > -1) {
        wsClients.splice(index, 1);
    }
};

export const broadcastMessage = (message) => {
    wsClients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(message));
            console.log('Message sent to client:', message);
        }
    });
};

export const handleMessage = async (ws, message) => {
    try {
        const decodedMessage = message.toString();
        console.log('Received message:', decodedMessage);

        const parsedMessage = JSON.parse(decodedMessage);

        if (parsedMessage.type === 'update location') {
            const result = await handleLocationUpdate(parsedMessage);
            ws.send(JSON.stringify({ status: "success", data: result }));
            console.log(result);
        } else {
            ws.send(JSON.stringify({ status: "error", message: "Unknown message type" }));
            console.log("Unknown message type");
        }
    } catch (error) {
        console.error('Error parsing message:', error);
        ws.send(JSON.stringify({ status: "error", message: "Invalid message format" }));
    }
};



export default wsClients;
