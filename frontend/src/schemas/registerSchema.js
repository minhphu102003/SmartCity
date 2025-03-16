import { z } from "zod";
import { loginSchema } from "./loginSchema";
import { ERROR_MESSAGES } from "../constants";

export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .min(3, { message: ERROR_MESSAGES.nameMinLength })
    .max(50, { message: ERROR_MESSAGES.nameMaxLength }),

  rePassword: z.string(),
}).refine((data) => data.password === data.rePassword, {
  message: ERROR_MESSAGES.passwordMismatch,
  path: ["rePassword"],
});
