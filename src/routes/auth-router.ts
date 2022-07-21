import {Router} from "express";

import {authController} from "../controllers/auth-controller";
import {registrationCodeValidation, userValidation, validationMiddleware} from "../middlewares/validationMiddleware";
import {authLimiter} from "../utils/limiter";

export const authRouter = Router();

authRouter
    .post('/login', authController.login)

    .post('/registration', userValidation, validationMiddleware, authLimiter, authController.registration)

    .post('/registration-confirmation', registrationCodeValidation, validationMiddleware, authLimiter, authController.confirmRegistration)

    .post('/registration-email-resending', userValidation[2], validationMiddleware, authLimiter, authController.emailResending)