import {Router} from "express";
import {validationMiddleware} from "../../middlewares/validationMiddleware";
import {authMiddlewareBearer} from "../../middlewares/auth-middleware-bearer";
import {userValidation} from "../users/validation";
import {registrationCodeValidation} from "./validation";
import {validateRefreshTokenMiddleware} from "../../middlewares/validateRefreshToken-middleware";
import {container} from "../../composition-root";
import {AuthController} from "./auth-controller";

const authController = container.resolve(AuthController)

export const authRouter = Router();

authRouter
    .post('/login', authController.login.bind(authController))

    .get('/me', authMiddlewareBearer, authController.me.bind(authController))

    .post('/logout', validateRefreshTokenMiddleware, authController.logOut.bind(authController))

    .post('/refresh-token', validateRefreshTokenMiddleware, authController.refresh.bind(authController))

    .post('/registration', userValidation, validationMiddleware, authController.registration.bind(authController))

    .post('/registration-confirmation', registrationCodeValidation, validationMiddleware, authController.confirmRegistration.bind(authController))

    .post('/registration-email-resending', userValidation[2], validationMiddleware, authController.emailResending.bind(authController))
