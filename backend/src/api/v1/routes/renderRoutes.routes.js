import {Router} from  'express';
import {findRoutesHandler} from "../controller/routes.controller.js";
import {validateFindRoutes} from "../validations/routes.validator.js";
import {handleValidationErrors} from "../validations/result.validator.js";

const router = Router();

router.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.get("/",[validateFindRoutes,handleValidationErrors],findRoutesHandler);

export default router;