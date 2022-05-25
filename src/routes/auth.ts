import express from "express";
import { AuthController } from "../controllers/auth";
import { ioc } from "../IocContainer";
import { TYPES } from "../IocTypes";

const router = express.Router();

const authController = ioc.get<AuthController>(TYPES.AuthController);

router.post("/login", authController.login.bind(authController));

export default router;
