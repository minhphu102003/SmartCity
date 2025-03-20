import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morganMiddleware from '../src/api/v1/config/morgan.config.js';
import { UPLOAD_DIRECTORY } from "./api/v1/constants/uploadConstants.js";
import v1Routes from "./api/v1/index.js";
import v2Routes from "./api/v2/index.js";
import Camera from './api/v1/models/camera.js';  
import AccountReport from './api/v1/models/accountReport.js';
import { consumeMessages } from "../src/api/v1/config/kafka.config.js";
import { WebSocketServer } from 'ws';  
import {handleLocationUpdate } from "./api/v1/services/readLocation.js";


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
// Middleware to measure response time
app.use((req, res, next) => {
    console.log('Request body:', req.body);
    const start = Date.now(); // Lấy thời gian bắt đầu khi yêu cầu đến
    res.on('finish', () => {
        const duration = Date.now() - start; // Tính toán thời gian phản hồi
        console.log(`Request to ${req.originalUrl} took ${duration} ms`); // In ra thời gian phản hồi
    });
    next();
});
let cachedCameras = [];
let cachedReports = [];

const preload = async () => {
    try {
        cachedCameras = await Camera.find({ roadSegments: { $exists: true, $size: 0 } });
        cachedReports = await AccountReport.find({ roadSegment_ids: { $exists: false } });
        console.log(`${cachedCameras.length} cameras without road segments loaded into cache`);
        console.log(`${cachedReports.length} reports without road segment references loaded into cache`);
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
        // Add the new client to the list
        wsClients.push(ws);
        // Handle incoming messages from the client
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
        // Handle client disconnection
        ws.on('close', () => {
            console.log('Client disconnected');
            // Remove the client from the list
            const index = wsClients.indexOf(ws);
            if (index > -1) {
                wsClients.splice(index, 1);
            }
        });
    });
});

// Function to send a message to all connected WebSocket clients
const sendMessageToFrontend = (message) => {
    wsClients.forEach(client => {
        if (client.readyState === client.OPEN) { // Check if client is still connected
            client.send(JSON.stringify(message)); // Send message as JSON string
            console.log('Message sent to client:', message);
        }
    });
};

const startKafkaConsumer = async () => {
    try {
        const topic = process.env.KAFKA_TOPIC_CONSUMER || 'python-topic';
        // const config = readConfig("./src/client.properties");
        // await produce(topic, config);
        await consumeMessages(topic, sendMessageToFrontend);
        // await consume(topic, config); // Kafka consumer setup
        console.log(`Kafka consumer started on topic: ${topic}`);
    } catch (error) {
        console.error("Error starting Kafka consumer:", error);
    }
};
startKafkaConsumer();

app.use("/api/v1", v1Routes);
app.use("/api/v2", v2Routes);

export default app;
