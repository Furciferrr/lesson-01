import express from "express";
import { AuthController } from "../controllers/auth";
import { ioc } from "../IocContainer";
import { TYPES } from "../IocTypes";
import { securityCountAttemptsMiddleware } from "../middlewares/securityCountAttempts";

const router = express.Router();

const authController = ioc.get<AuthController>(TYPES.AuthController);

router.post("/login", 
securityCountAttemptsMiddleware,
authController.login.bind(authController));

router.post("/registration", 
securityCountAttemptsMiddleware,
authController.registration.bind(authController));

router.post("/registration-confirmation", 
securityCountAttemptsMiddleware,
authController.confirmation.bind(authController));

router.post("/registration-email-resending",
securityCountAttemptsMiddleware, 
authController.resendingEmail.bind(authController));

export default router;
