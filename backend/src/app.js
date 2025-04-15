import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morganMiddleware from '../src/api/v1/config/morgan.config.js';
import { UPLOAD_DIRECTORY } from "./api/v1/constants/uploadConstants.js";
import v1Routes from "./api/v1/index.js";
import v2Routes from "./api/v2/index.js";
import Camera from './api/v1/models/camera.js';  
import AccountReport from './api/v1/models/accountReport.js';
import { consumeMessages } from './kafkaOnline.config.js';
import { WebSocketServer } from 'ws';  
import {handleLocationUpdate } from "./api/v1/services/readLocation.js";
import { initializeWebSocket } from "./api/v1/websockets/websocketServer.js";

const app = express();

app.set("port", process.env.PORT || 8000);
app.set("json space", 4);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morganMiddleware);
app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
app.use('/uploads', express.static(UPLOAD_DIRECTORY));



const wsClients = [];
let cachedCameras = [];
let cachedReports = [];

const preload = async () => {
    try {
        cachedCameras = await Camera.find({ roadSegments: { $exists: true, $size: 0 } });
        cachedReports = await AccountReport.find({ roadSegment_ids: { $exists: false } });
    } catch (error) {
        console.error("Error loading data into cache:", error);
    }
};

await preload();
app.use((req, res, next) => {
    req.cachedCameras = cachedCameras;
    req.cachedReports = cachedReports;
    next();
});

app.server = app.listen(app.get("port"), () => {
    const wss = new WebSocketServer({ server: app.server });
    wss.on('connection', (ws) => {
        console.log('Client connected');
        ws.send('Welcome to the WebSocket server!');
        wsClients.push(ws);
        ws.on('message', async (message) => {
            const decodedMessage = message.toString();
            console.log('Received message:', decodedMessage);
            try {
                const parsedMessage = JSON.parse(decodedMessage);
                if (parsedMessage.type === 'update location') {
                    const result = await handleLocationUpdate(parsedMessage);
                    console.log(result);
                } else {
                    console.log("Unknown message type");
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
            const index = wsClients.indexOf(ws);
            if (index > -1) {
                wsClients.splice(index, 1);
            }
        });
    });
});

const sendMessageToFrontend = (message) => {
    wsClients.forEach(client => {
        if (client.readyState === client.OPEN) { 
            client.send(JSON.stringify(message)); 
        }
    });
};

const startKafkaConsumer = async () => {
    try {
        const topic = process.env.KAFKA_TOPIC_CONSUMER || 'python-topic';
        await consumeMessages(topic, sendMessageToFrontend);
        console.log(`Kafka consumer started on topic: ${topic}`);
    } catch (error) {
        console.error("Error starting Kafka consumer:", error);
    }
};
startKafkaConsumer();

app.use("/api/v1", v1Routes);
app.use("/api/v2", v2Routes);

export default app;
