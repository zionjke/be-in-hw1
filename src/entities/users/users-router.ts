import {Router} from "express";
import {authMiddlewareBasic} from "../../middlewares/auth-middleware-basic";
import {validationMiddleware} from "../../middlewares/validationMiddleware";
import {userValidation} from "./validation";
import {container} from "../../composition-root";
import {UsersController} from "./users-contoller";

const usersController = container.resolve(UsersController)

export const usersRouter = Router();

usersRouter
    .get('/', usersController.getUsers.bind(usersController))

    .post('/', authMiddlewareBasic, userValidation, validationMiddleware, usersController.createUser.bind(usersController))

    .delete('/:id', authMiddlewareBasic, usersController.deleteUser.bind(usersController))
