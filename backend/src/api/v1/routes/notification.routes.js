import { Router } from "express";
import {getListNotificationByAccount, createNotification, updateNotification, deleteNotification} from "../controller/notification.controller.js";
import {veriFyToken, isAdmin} from "../middlewares/authJwt.js";
import { validateWithToken } from '../validations/commonField.validator.js';
import { handleValidationErrors } from '../validations/result.validator.js'; 
import { notificationValidator } from '../validations/notification.validator.js'

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
router.post("/",validateWithToken, notificationValidator, handleValidationErrors, veriFyToken, isAdmin , createNotification);
router.put("/:notification_id",validateWithToken,handleValidationErrors , veriFyToken, isAdmin, updateNotification);
router.delete("/:notification_id",validateWithToken, handleValidationErrors, veriFyToken, isAdmin, deleteNotification);



export default router;