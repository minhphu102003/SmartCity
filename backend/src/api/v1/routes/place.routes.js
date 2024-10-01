import {Router} from "express";
import {  nearestValidator, addPlaceValidator, updatePlaceValidator } from '../validations/place.validator.js';
import { handleValidationErrors } from "../validations/result.validator.js";
import { searchNearest, createPlace, updatePlace, deletePlace } from "../controller/place.controller.js";
import { veriFyToken, isAdmin } from "../middlewares/authJwt.js";
import { validateById, validateWithToken } from "../validations/commonField.validator.js";


const router = Router();


router.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "X-access-token, Origin, Content-type, Acccpet"
    );
    next();
});

// ! Thiếu lấy danh sách các địa điểm mà có phân trang

// ? test ok 
router.get("/nearest", [nearestValidator, handleValidationErrors], searchNearest);
// viết api tạo một place mới 

// ? Test ok 
router.post("/add",[validateWithToken, addPlaceValidator, handleValidationErrors, veriFyToken, isAdmin], createPlace);

// ? Test ok
router.put("/update/:Id", [validateById, validateWithToken,updatePlaceValidator,handleValidationErrors, veriFyToken, isAdmin], updatePlace);

// ? Test ok 
router.delete("/delete/:Id", [validateById, validateWithToken, handleValidationErrors, veriFyToken, isAdmin], deletePlace);

export default router;



