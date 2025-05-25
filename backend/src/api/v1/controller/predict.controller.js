import { sendMessageToFrontend } from "../websockets/websocketManager.js";
import RoadSegment from "../models/roadSegment.js";
import {
  addToCache,
  isValidLocation,
} from "../../shared/utils/cacheHelpers.js";

export const handlePrediction = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type !== "predict") {
      return res.status(400).json({ message: "Invalid type" });
    }

    const { road_segment_id, timestamp } = data;

    if (!road_segment_id || !timestamp) {
      return res
        .status(400)
        .json({ message: "Missing road_segment_id or timestamp" });
    }

    const roadSegment = await RoadSegment.findById(road_segment_id).lean();

    const { start_location, end_location } = roadSegment;
    if (
      isValidLocation(
        start_location.coordinates[1],
        start_location.coordinates[0]
      )
    ) {
      addToCache(req.cachedReportsForRouting, {
        latitude: start_location.coordinates[1],
        longitude: start_location.coordinates[0],
        type: "predict",
        typeReport: "predict",
        timestamp,
      });
    }

    if (
      isValidLocation(end_location.coordinates[1], end_location.coordinates[0])
    ) {
      addToCache(req.cachedReportsForRouting, {
        latitude: end_location.coordinates[1],
        longitude: end_location.coordinates[0],
        type: "predict",
        typeReport: "predict",
        timestamp,
      });
    }

    if (!roadSegment) {
      return res.status(404).json({ message: "Road segment not found" });
    }

    const payload = {
      roadSegment,
      timestamp,
    };

    sendMessageToFrontend({
      type: "predict",
      data: payload,
    });

    res.status(200).json({ message: "Prediction broadcasted", data: payload });
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ message: "Internal error" });
  }
};
