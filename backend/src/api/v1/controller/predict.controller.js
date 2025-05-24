import { sendMessageToFrontend } from "../websockets/websocketManager.js";
import RoadSegment from "../models/roadSegment.js";

export const handlePrediction = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type !== "predict") {
      return res.status(400).json({ message: "Invalid type" });
    }

    const { road_segment_id, timestamp } = data;

    if (!road_segment_id || !timestamp) {
      return res.status(400).json({ message: "Missing road_segment_id or timestamp" });
    }

    const roadSegment = await RoadSegment.findById(road_segment_id).lean();

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