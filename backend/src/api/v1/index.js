import { Router } from "express";
import authRoutes from "./routes/auth.routes.js";
import placeRoutes from "./routes/place.routes.js";
import userRoutes from "./routes/user.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import cameraRoutes from "./routes/camera.routes.js";
import accountReport from "./routes/accountReport.routes.js";
import weatherRoutes from "./routes/weather.routes.js";
// import userReportRoutes from "./routes/userReport.routes.js";

const router = Router();


router.use("/auth", authRoutes);
router.use("/place",placeRoutes);
router.use("/user",userRoutes);
router.use("/comment",commentRoutes);
router.use("/camera",cameraRoutes);
router.use("/weather", weatherRoutes);
router.use("/account-report",accountReport);

export default router;