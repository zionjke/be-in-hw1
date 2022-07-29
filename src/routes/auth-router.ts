import {Router} from "express";

import {authController} from "../controllers/auth-controller";
import {registrationCodeValidation, userValidation, validationMiddleware} from "../middlewares/validationMiddleware";
import {checkLimitRequest} from "../utils/limiter";
import {authMiddlewareBearer} from "../middlewares/auth-middleware-bearer";


export const authRouter = Router();

authRouter
    .post('/login', authController.login)

    .get('/me', authMiddlewareBearer, authController.me)

    .post('/logout', authController.logOut)

    .post('/refresh-token', authController.refresh)

    .post('/registration', userValidation, validationMiddleware, authController.registration)

    .post('/registration-confirmation', registrationCodeValidation, validationMiddleware, authController.confirmRegistration)

    .post('/registration-email-resending', userValidation[2], validationMiddleware, authController.emailResending)