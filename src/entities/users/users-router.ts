import {Router} from "express";
import {authMiddlewareBasic} from "../../middlewares/auth-middleware-basic";
import {validationMiddleware} from "../../middlewares/validationMiddleware";
import {usersController} from "./users-contoller";
import {userValidation} from "./validation";

export const usersRouter = Router();

usersRouter
    .get('/', usersController.getUsers)

    .post('/', authMiddlewareBasic, userValidation, validationMiddleware, usersController.createUser)

    .delete('/:id', authMiddlewareBasic, usersController.deleteUser)