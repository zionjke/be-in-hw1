import {Router} from "express";
import {authMiddlewareBasic} from "../middlewares/auth-middleware-basic";
import {userValidation, validationMiddleware} from "../middlewares/validationMiddleware";
import {usersController} from "../controllers/users-contoller";

export const usersRouter = Router();

usersRouter

    .get('/', usersController.getUsers)

    .post('/', authMiddlewareBasic, userValidation, validationMiddleware, usersController.createUser)

    .delete('/:id', authMiddlewareBasic, usersController.deleteUser)