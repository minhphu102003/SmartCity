import { Router } from "express";
import {
  getRoadSegments,
  getRoadSegmentById,
  updateRoadSegment,
} from "../controller/roadSegment.controller.js";

import { veriFyToken, isAdmin } from "../middlewares/authJwt.js";
import { handleValidationErrors } from "../validations/result.validator.js";
import { validateGetRoadSegments, validateUpdateRoadSegment } from '../validations/roadSegment.validator.js';
import {
  validateById,
  validateWithToken,
} from "../validations/commonField.validator.js";


const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});


router.get("/", validateGetRoadSegments, handleValidationErrors, getRoadSegments); 
router.get("/:id", validateById, handleValidationErrors, getRoadSegmentById); 

router.put("/:id",validateById , validateWithToken, validateUpdateRoadSegment, handleValidationErrors, veriFyToken, isAdmin, updateRoadSegment);

export default router;
