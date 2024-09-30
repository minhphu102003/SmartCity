import { Router } from "express";
import authRoutes from "./routes/auth.routes.js";
import placeRoutes from "./routes/place.routes.js";
import userRoutes from "./routes/user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/place",placeRoutes);
router.use("/user",userRoutes);
export default router;