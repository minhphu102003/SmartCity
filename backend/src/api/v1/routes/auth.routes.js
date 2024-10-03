import {Router} from "express";
import { signUpHandler, signinHandler, logoutHandler  } from "../controller/auth.controller.js";
import { checkExistingRole, checkExistingUser } from "../middlewares/veriFySignUp.js";
import {signInValidator, signUpValidator} from "../validations/auth.validator.js";
import {handleValidationErrors} from "../validations/result.validator.js";


const router = Router();


router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
  
  router.post("/signup",[signUpValidator, handleValidationErrors], [checkExistingUser, checkExistingRole], signUpHandler);
  router.post("/signin",[signInValidator, handleValidationErrors], signinHandler);
  router.get("/logout", logoutHandler);
  export default router;
  