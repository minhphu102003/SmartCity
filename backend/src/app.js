import express from "express";
import cors from "cors";
import helmet from "helmet";
import morganMiddleware from "../src/api/v1/config/morgan.config.js";
import { UPLOAD_DIRECTORY } from "./api/v1/constants/uploadConstants.js";
import v1Routes from "./api/v1/index.js";
import v2Routes from "./api/v2/index.js";
import Camera from "./api/v1/models/camera.js";
import AccountReport from "./api/v1/models/accountReport.js";
import {
  startKafkaConsumer,
  startVideoUploadConsumer,
} from "./kafkaOnline.config.js";
import {
  initializeWebSocket,
  sendMessageToFrontend,
} from "./api/v1/websockets/websocketManager.js";
import { errorHandler } from "./api/shared/middlewares/errorHandler.js";

const app = express();

app.set("port", process.env.PORT || 8000);
app.set("json space", 4);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morganMiddleware);
app.use(
  cors({
    origin: ["http://localhost:3000", "https://first-flutter-952c9.web.app"],
    credentials: true,
  })
);
app.use("/uploads", express.static(UPLOAD_DIRECTORY));

let cachedCameras = [];
let cachedReports = [];

const preload = async () => {
  try {
    cachedCameras = await Camera.find({
      roadSegments: { $exists: true, $size: 0 },
    });
    cachedReports = await AccountReport.find({
      roadSegment_ids: { $exists: false },
    });
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
  console.log(`Server is running on port ${app.get("port")}`);
  initializeWebSocket(app.server);
});

startKafkaConsumer(process.env.KAFKA_TOPIC_CONSUMER, sendMessageToFrontend);
startVideoUploadConsumer(process.env.KAFKA_TOPIC_VIDEO_UPLOAD);

app.use("/api/v1", v1Routes);
app.use("/api/v2", v2Routes);

app.use(errorHandler);

export default app;
