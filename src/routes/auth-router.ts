import {Router} from "express";

import {authController} from "../controllers/auth-controller";
import {registrationCodeValidation, userValidation, validationMiddleware} from "../middlewares/validationMiddleware";
import {checkLimitRequest} from "../utils/limiter";


export const authRouter = Router();

authRouter
    .post('/login', checkLimitRequest, authController.login)

    .post('/registration', checkLimitRequest, userValidation, validationMiddleware, authController.registration)

    .post('/registration-confirmation', checkLimitRequest, registrationCodeValidation, validationMiddleware, authController.confirmRegistration)

    .post('/registration-email-resending', checkLimitRequest, userValidation[2], validationMiddleware, authController.emailResending)