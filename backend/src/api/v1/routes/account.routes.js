import { Router } from "express";
import {
  getAccountDetailsHandler,
  updateAccountDetailsHandler,
  deleteAccountHandler,
  listOrSearchAccountsHandler,
  manageAccountRolesHandler,
  getUserProfile,
} from "../controller/account.controller.js";
import { validateById } from "../validations/commonField.validator.js";
import { validateWithToken } from "../validations/commonField.validator.js";
import {isAdmin, veriFyToken} from "../middlewares/authJwt.js";
import { handleValidationErrors } from "../validations/result.validator.js";
import {
  updateAccountValidator,
  searchAccountsValidator,
  validateManageAccountRoles,
} from "../validations/account.validator.js";

const router = Router();

const adminAuthMiddlewares = [
  validateWithToken,
  handleValidationErrors,
  veriFyToken,
  isAdmin,
];

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get('/profile',[validateWithToken],veriFyToken, getUserProfile);
router.get("/", [searchAccountsValidator, ...adminAuthMiddlewares], listOrSearchAccountsHandler); 
router.get("/:id", [validateById,], getAccountDetailsHandler); 
router.put("/:id", [validateById, validateWithToken, updateAccountValidator,], veriFyToken, updateAccountDetailsHandler); 
router.delete("/:id", [validateById, ...adminAuthMiddlewares], deleteAccountHandler);
router.put("/:id/roles", [validateById,validateManageAccountRoles, ...adminAuthMiddlewares], manageAccountRolesHandler);

router.use(handleValidationErrors);

export default router;
