import {Router} from "express";

import {authController} from "../controllers/auth-controller";
import {registrationCodeValidation, userValidation, validationMiddleware} from "../middlewares/validationMiddleware";


export const authRouter = Router();

authRouter
    .post('/login', authController.login)

    .post('/registration', userValidation, validationMiddleware, authController.registration)

    .post('/registration-confirmation', registrationCodeValidation, validationMiddleware, authController.confirmRegistration)

    .post('/registration-email-resending', userValidation[2], validationMiddleware, authController.emailResending)