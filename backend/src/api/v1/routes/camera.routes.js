import { Router } from "express";
import { veriFyToken, isAdmin } from "../middlewares/authJwt.js";
import {
  getCameras,
  getCamerasByRoadSegment,
  getCameraById,
  createCamera,
  updateCamera,
  deleteCamera,
} from "../controller/camera.controller.js";
import {
  validateById,
  validateWithToken,
} from "../validations/commonField.validator.js";
import { handleValidationErrors } from "../validations/result.validator.js";
import {
  validateCreateCamera,
  validateUpdateCamera,
  getCameraValidator,
} from "../validations/camera.validator.js";

const router = Router();

const adminAuthMiddlewares = [
  validateWithToken,
  handleValidationErrors,
  veriFyToken,
  isAdmin,
];

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "X-access-token, Origin, Content-type, Accept"
  );
  next();
});

router.get("/road-segment/:id",[validateById, handleValidationErrors],getCamerasByRoadSegment);
router.get("/:id",[validateById, handleValidationErrors], getCameraById );
router.get("/", [getCameraValidator, handleValidationErrors], getCameras);
router.post('/', [validateCreateCamera, ...adminAuthMiddlewares], createCamera);
router.put("/:id", [validateById, validateUpdateCamera, ...adminAuthMiddlewares], updateCamera);
router.delete("/:id", [validateById, ...adminAuthMiddlewares], deleteCamera);

export default router;