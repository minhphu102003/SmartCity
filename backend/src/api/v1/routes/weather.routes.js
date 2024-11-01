import {Router} from "express";
import {getClothingSuggestion, getWeatherData, getWeatherConditions, deleteWeatherRecord} from "../controller/weather.controller.js";
import {coordinatesQueryValidator} from "../validations/coordinates.validator.js";
import {handleValidationErrors} from "../validations/result.validator.js";
import {validateDateRange, validateDistance} from "../validations/weather.validator.js";
import {isAdmin,veriFyToken} from "../middlewares/authJwt.js";
import {validateById, validateWithToken} from "../validations/commonField.validator.js";

const router = Router();

router.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});
// Test ok 
router.get("/suggestion",[coordinatesQueryValidator, handleValidationErrors], getClothingSuggestion);
router.get("/conditions", getWeatherConditions);
router.get("/", [coordinatesQueryValidator, validateDateRange, validateDistance, handleValidationErrors], getWeatherData);
router.delete("/:id", [validateById, validateWithToken, handleValidationErrors],veriFyToken, isAdmin, deleteWeatherRecord);

export default router;