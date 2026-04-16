import { Router, type Router as ExpressRouter } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { authRateLimit } from "../../middlewares/rateLimit.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { authController } from "./auth.controller.js";
import { loginSchema, logoutSchema, refreshSchema, registerSchema } from "./auth.schema.js";

export const authRouter: ExpressRouter = Router();

// Aplicar rate limiting a rutas de autenticación sensibles
authRouter.post("/register", authRateLimit, validate(registerSchema), asyncHandler(authController.register.bind(authController)));
authRouter.post("/login", authRateLimit, validate(loginSchema), asyncHandler(authController.login.bind(authController)));
authRouter.post("/refresh", validate(refreshSchema), asyncHandler(authController.refresh.bind(authController)));
authRouter.post("/logout", validate(logoutSchema), asyncHandler(authController.logout.bind(authController)));

export default authRouter;
