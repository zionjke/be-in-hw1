import {Router} from "express";

import {authController} from "../controllers/auth-controller";
import {registrationCodeValidation, userValidation, validationMiddleware} from "../middlewares/validationMiddleware";
import {checkLimitRequest} from "../utils/limiter";


export const authRouter = Router();

authRouter
    .post('/login', authController.login)

    .get('/me', authController.me)

    .post('/logout', authController.logOut)

    .post('/refresh-token', authController.refresh)

    .post('/registration', userValidation, validationMiddleware, authController.registration)

    .post('/registration-confirmation', registrationCodeValidation, validationMiddleware, authController.confirmRegistration)

    .post('/registration-email-resending', userValidation[2], validationMiddleware, authController.emailResending)