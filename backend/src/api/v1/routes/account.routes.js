import { Router } from "express";
import {
  getAccountDetailsHandler,
  updateAccountDetailsHandler,
  deleteAccountHandler,
  listOrSearchAccountsHandler,
  manageAccountRolesHandler,
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

// CORS headers
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/", [searchAccountsValidator, handleValidationErrors], listOrSearchAccountsHandler); 
// ? Ok test xong
router.get("/:id", [validateById, handleValidationErrors], getAccountDetailsHandler); 
// ? Test ok
router.put("/:id", [validateById, validateWithToken, updateAccountValidator, handleValidationErrors], veriFyToken, updateAccountDetailsHandler); 
// ! Chưa test chưa làm gì hết ở đây
router.delete("/:id", [validateById, ...adminAuthMiddlewares], deleteAccountHandler); // Delete account
router.put("/:id/roles", [validateById,validateManageAccountRoles, ...adminAuthMiddlewares], manageAccountRolesHandler); // Manage account roles (optional)

export default router;
