import { Router } from "express";
import authRoutes from "./routes/auth.routes.js";
import placeRoutes from "./routes/place.routes.js";
import userRoutes from "./routes/user.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import cameraRoutes from "./routes/camera.routes.js";

const router = Router();


router.use("/auth", authRoutes);
router.use("/place",placeRoutes);
router.use("/user",userRoutes);
router.use("/comment",commentRoutes);
router.use("/camera",cameraRoutes);

export default router;