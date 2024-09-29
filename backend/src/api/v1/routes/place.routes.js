import {Router} from "express";
import {  nearestValidator, addPlaceValidator, updatePlaceValidator, deletePlaceValidator } from '../validations/place.validator.js';
import { handleValidationErrors } from "../validations/result.validator.js";
import { searchNearest, createPlace, updatePlace, deletePlace } from "../controller/place.controller.js";


const router = Router();


router.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "X-access-token, Origin, Content-type, Acccpet"
    );
    next();
});

router.get("/nearest", nearestValidator,handleValidationErrors, searchNearest);
// viết api tạo một place mới 
router.post("/addPlace",addPlaceValidator,handleValidationErrors, createPlace);

router.put("/updatePlace/:id", updatePlaceValidator,handleValidationErrors, updatePlace);

router.delete("/deletePlace/:id", deletePlaceValidator,handleValidationErrors, deletePlace);

export default router;



