import { Router } from "express";
import {
  signUpHandler,
  signinHandler,
  logoutHandler,
  forgotHandler,
  verifyOtpHandler,
  resetPasswordHandler,
  changePasswordHandler,
} from "../controller/auth.controller.js";
import {
  checkExistingRole,
} from "../middlewares/verifySignUp.js";
import {veriFyToken} from "../middlewares/authJwt.js";
import {
  forgotPasswordValidator,
  signInValidator,
  signUpValidator,
  verifyValidator,
  resetPasswordValidator,
  changePasswordValidator,
} from "../validations/auth.validator.js";
import { handleValidationErrors } from "../validations/result.validator.js";
import { validateWithToken } from "../validations/commonField.validator.js";

const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

  router.post("/signup",[signUpValidator, handleValidationErrors ], [checkExistingRole], signUpHandler);
  router.post("/signin",[signInValidator, handleValidationErrors ], signinHandler);
  router.post("/forgot-password",[forgotPasswordValidator, handleValidationErrors], forgotHandler);
  router.post("/verify-otp",[verifyValidator, handleValidationErrors],verifyOtpHandler );
  router.post("/reset-password",[resetPasswordValidator, handleValidationErrors ],resetPasswordHandler);
  router.post("/change-password", [validateWithToken,changePasswordValidator, handleValidationErrors],[veriFyToken],changePasswordHandler);
  router.get("/logout",[validateWithToken, handleValidationErrors ], logoutHandler);


  export default router;
  