import { Router } from "express";
import accountReport from './routes/accountReport.routes.js';

const router = Router();

router.use("/account-report",accountReport);

export default router;