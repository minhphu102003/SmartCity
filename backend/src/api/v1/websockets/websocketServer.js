import { WebSocketServer } from 'ws';
import { addClient, removeClient } from './clients.js';
import { handleMessage } from './messageHandler.js';


export const initializeWebSocket = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');
        ws.send('Welcome to the WebSocket server!');
        addClient(ws);

        ws.on('message', (message) => handleMessage(ws, message));

        ws.on('close', () => {
            console.log('Client disconnected');
            removeClient(ws);
        });
    });

    return wss;
};
