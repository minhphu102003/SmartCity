import { Router } from "express";
import {getListNotificationByAccount} from "../controller/notification.controller.js";
import {veriFyToken} from "../middlewares/authJwt.js";

const router = Router();

// CORS headers
router.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.get("/",veriFyToken,getListNotificationByAccount ); 

export default router;