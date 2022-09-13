import {Router} from "express";
import { usersController } from "../../composition-root";
import {authMiddlewareBasic} from "../../middlewares/auth-middleware-basic";
import {validationMiddleware} from "../../middlewares/validationMiddleware";
import {userValidation} from "./validation";

export const usersRouter = Router();

usersRouter
    .get('/', usersController.getUsers.bind(usersController))

    .post('/', authMiddlewareBasic, userValidation, validationMiddleware, usersController.createUser.bind(usersController))

    .delete('/:id', authMiddlewareBasic, usersController.deleteUser.bind(usersController))
