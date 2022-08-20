import {Router} from "express";
import {authController} from "./auth-controller";
import { validationMiddleware} from "../../middlewares/validationMiddleware";
import {authMiddlewareBearer} from "../../middlewares/auth-middleware-bearer";
import { userValidation } from "../users/validation";
import {registrationCodeValidation} from "./validation";
import {validateRefreshTokenMiddleware} from "../../middlewares/validateRefreshToken-middleware";


export const authRouter = Router();

authRouter
    .post('/login', authController.login)

    .get('/me', authMiddlewareBearer, authController.me)

    .post('/logout', validateRefreshTokenMiddleware, authController.logOut)

    .post('/refresh-token', validateRefreshTokenMiddleware,  authController.refresh)

    .post('/registration', userValidation, validationMiddleware, authController.registration)

    .post('/registration-confirmation', registrationCodeValidation, validationMiddleware, authController.confirmRegistration)

    .post('/registration-email-resending', userValidation[2], validationMiddleware, authController.emailResending)