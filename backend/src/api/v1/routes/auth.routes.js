import {Router} from "express";
import { signUpHandler, signinHandler, logoutHandler  } from "../controller/auth.controller";
import { checkExistingRole, checkExistingUser } from "../middlewares/veriFySignUp";


const router = Router();


router.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  router.post("/signup", [checkExistingUser, checkExistingRole], signupHandler);
  router.post("/signin", signinHandler);
  router.get("/logout", logoutHandler);
  export default router;
  