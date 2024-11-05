import { Router } from "express";
import authRoutes from "./routes/auth.routes.js";
import placeRoutes from "./routes/place.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import cameraRoutes from "./routes/camera.routes.js";
import accountReport from "./routes/accountReport.routes.js";
import weatherRoutes from "./routes/weather.routes.js";
import accountRoutes from "./routes/account.routes.js";

const router = Router();


router.use("/auth", authRoutes);
router.use("/place",placeRoutes);
router.use("/comment",commentRoutes);
router.use("/camera",cameraRoutes);
router.use("/weather", weatherRoutes);
router.use("/account-report",accountReport);
router.use("/account",accountRoutes);

export default router;