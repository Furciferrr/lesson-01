import { VideosController } from './../controllers/videos';
import express from "express";
import { authBaseMiddleware } from "../middlewares/basic-middleware";
import { UserRepository } from "../repositories/users-repository";
import { BodyValidator } from "../validator";
import { UserController } from "../controllers/users";
import { UserService } from "../services/users-service";
import { ioc } from "../IocContainer";
import { TYPES } from '../IocTypes';

const router = express.Router();


const userController = ioc.get<UserController>(TYPES.UserController);

router.get("/", userController.getUsers.bind(userController));

router.post("/", authBaseMiddleware, userController.createUser.bind(userController));

router.delete("/:id", authBaseMiddleware, userController.deleteUserById.bind(userController));

export default router;
