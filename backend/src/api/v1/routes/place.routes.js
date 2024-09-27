import {Router} from "express";
import { searchNearest } from "../controller/place.controller.js";


const router = Router();


router.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "X-access-token, Origin, Content-type, Acccpet"
    );
    next();
});

router.get("/nearest", searchNearest);

export default router;

// đối với place 
// đầu tiên ta sẽ tìm kiếm places theo loại
// ? 1 : Nhà hàng
// ? 2 : Khách sạn 
// ? 3 : Điểm tham quan 
// ? 4 : Bảo tàng 

