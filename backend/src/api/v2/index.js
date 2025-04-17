import { Router } from "express";
import accountReport from './routes/accountReport.routes.js';
import accountReportReview from './routes/accountReportReview.routes.js';

const router = Router();

router.use("/account-report",accountReport);
router.use("/account-report-review", accountReportReview);

export default router;