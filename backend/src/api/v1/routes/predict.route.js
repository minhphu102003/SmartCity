import express from "express";
import { handlePrediction } from "../controller/predict.controller.js";

const router = express.Router();

router.post("/", handlePrediction);

export default router;