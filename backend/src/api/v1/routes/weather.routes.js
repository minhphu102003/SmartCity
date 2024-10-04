import {Router} from "express";
import {getClothingSuggestion} from "../controller/weather.controller.js";
import {validateWeatherQuery} from "../validations/weather.validator.js";
import {handleValidationErrors} from "../validations/result.validator.js";

const router = Router();

router.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});



router.get("/suggestion",[validateWeatherQuery, handleValidationErrors], getClothingSuggestion);

export default router;