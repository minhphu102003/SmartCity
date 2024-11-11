import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morganMiddleware from './config/morgan.config.js';
import {UPLOAD_DIRECTORY} from "./api/v1/constants/uploadConstants.js";
import v1Routes from "./api/v1/index.js";
import Camera from './api/v1/models/camera.js';  
import AccountReport from './api/v1/models/accountReport.js';
import {consumeMessages} from "./config/kafka.config.js";

const app = express();


app.set("port", process.env.PORT||8000);
app.set("json space",4);

app.use(helmet());
app.use('/uploads', express.static(UPLOAD_DIRECTORY));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(morganMiddleware);

app.use(cors());

let cachedCameras = [];
let cachedReports = [];

const preload = async () => {
    try {
        // Fetch cameras without roadSegments and store them in memory
        cachedCameras = await Camera.find({ roadSegments: { $exists: true, $size: 0 } });
        
        // Fetch reports without roadSegment_id and store them in memory
        cachedReports = await AccountReport.find({ roadSegment_id: { $exists: false } });
        
        console.log(`${cachedCameras.length} cameras without road segments loaded into cache`);
        console.log(`${cachedReports.length} reports without road segment references loaded into cache`);
    } catch (error) {
        console.error("Error loading data into cache:", error);
    }
};

// Call preload on app startup
await preload();

// Attach cached data to the req object as middleware
app.use((req, res, next) => {
    req.cachedCameras = cachedCameras;
    req.cachedReports = cachedReports;
    next();
});

// Start the Kafka consumer concurrently with the app
const startKafkaConsumer = async () => {
    try {
        const topic = process.env.KAFKA_TOPIC_CONSUMER || 'python-topic';
        await consumeMessages(topic);
        console.log(`Kafka consumer started on topic: ${topic}`);
    } catch (error) {
        console.error("Error starting Kafka consumer:", error);
    }
};

// Call startKafkaConsumer asynchronously
startKafkaConsumer();

// routes
// Use the routes from v1
app.use("/api/v1", v1Routes);

export default app;


