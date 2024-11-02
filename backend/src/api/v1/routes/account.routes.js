import { Router } from "express";
import {
  getAccountDetailsHandler,
  updateAccountDetailsHandler,
  deleteAccountHandler,
  listAccountsHandler,
  searchAccountsHandler,
  manageAccountRolesHandler,
} from "../controller/account.controller.js";
import { validateWithToken } from "../validations/commonField.validator.js";
import { handleValidationErrors } from "../validations/result.validator.js";
import {
  accountIdValidator,
  updateAccountValidator,
  searchAccountsValidator,
} from "../validations/account.validator.js";

const router = Router();

// CORS headers
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Get account details
router.get(
  "/:id",
  [accountIdValidator, handleValidationErrors],
  getAccountDetailsHandler
);

// Update account details
router.put(
  "/:id",
  [accountIdValidator, updateAccountValidator, handleValidationErrors],
  updateAccountDetailsHandler
);

// Delete account
router.delete(
  "/:id",
  [accountIdValidator, handleValidationErrors],
  deleteAccountHandler
);

// List all accounts
router.get(
  "/",
  listAccountsHandler
);

// Search accounts
router.get(
  "/search",
  [searchAccountsValidator, handleValidationErrors],
  searchAccountsHandler
);

// Manage account roles (optional)
router.put(
  "/:id/roles",
  [accountIdValidator, handleValidationErrors],
  manageAccountRolesHandler
);

export default router;
