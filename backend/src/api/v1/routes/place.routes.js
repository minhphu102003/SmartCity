import { Router } from "express";
import {
  nearestValidator,
  addPlaceValidator,
  updatePlaceValidator,
  findPlaceNameValidator,
  updateStatusValidator,
} from "../validations/place.validator.js";
import { handleValidationErrors } from "../validations/result.validator.js";
import {
  searchNearest,
  createPlace,
  updatePlace,
  deletePlace,
  findPlaceById,
  findPlaceName,
  updateStatusPlace,
} from "../controller/place.controller.js";
import { veriFyToken, isAdmin } from "../middlewares/authJwt.js";
import {
  validateById,
  validateWithToken,
} from "../validations/commonField.validator.js";

const router = Router();

// Middleware kết hợp
const verifyTokenAndAdmin = [veriFyToken, isAdmin];

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "X-access-token, Origin, Content-type, Accept"
  );
  next();
});

// Route với middleware và controller
// ? Test ok
router.get("/nearest", [nearestValidator, handleValidationErrors], searchNearest);
// ? Test ok
router.get("/search", [findPlaceNameValidator, handleValidationErrors], findPlaceName);
// ? Test ok
router.get("/:id", [validateById, handleValidationErrors], findPlaceById);

// ? Cơ bản là ok 
router.post("/", [validateWithToken, addPlaceValidator, handleValidationErrors, ...verifyTokenAndAdmin], createPlace);
router.put("/:id", [validateById, validateWithToken, updatePlaceValidator, handleValidationErrors, ...verifyTokenAndAdmin], updatePlace);
router.patch("/:id", [validateById, updateStatusValidator, handleValidationErrors, ...verifyTokenAndAdmin], updateStatusPlace);
router.delete("/:id", [validateById, validateWithToken, handleValidationErrors, ...verifyTokenAndAdmin], deletePlace);

export default router;
