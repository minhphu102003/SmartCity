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
import {handleSingleUpload} from "../services/cloudinary.service.js";

const router = Router();

const verifyTokenAndAdmin = [veriFyToken, isAdmin];

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "X-access-token, Origin, Content-type, Accept"
  );
  next();
});


router.get("/nearest", [nearestValidator], searchNearest);
router.get("/search", [findPlaceNameValidator], findPlaceName);
router.get("/:id", [validateById], findPlaceById);
router.post("/",[handleSingleUpload], [validateWithToken, addPlaceValidator, ...verifyTokenAndAdmin], createPlace);
router.put("/:id",[handleSingleUpload], [validateById, validateWithToken, updatePlaceValidator, ...verifyTokenAndAdmin], updatePlace);
router.patch("/:id", [validateById, updateStatusValidator, ...verifyTokenAndAdmin], updateStatusPlace);
router.delete("/:id", [validateById, validateWithToken, ...verifyTokenAndAdmin], deletePlace);

router.use(handleValidationErrors);

export default router;
