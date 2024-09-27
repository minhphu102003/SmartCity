import { Router } from "express";
import authRoutes from "./routes/auth.routes.js";
import placeRouter from "./routes/place.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/place",placeRouter);

export default router;