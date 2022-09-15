import {NextFunction, Request, Response} from "express";
import {jwtService, usersService } from "../composition-root";
import {ApiError} from "../exceptions/api-error";

export const authMiddlewareBearer = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.headers.authorization) {
            return next(ApiError.UnauthorizedError())
        }

        const [, accessToken] = req.headers.authorization.split(' ')

        if (!accessToken) {
            return next(ApiError.UnauthorizedError())
        }

        const userId = await jwtService.validateAccessToken(accessToken)

        if (!userId) {
            return next(ApiError.UnauthorizedError())
        }

        const user = await usersService.getUserByID(userId)

        if (!user) {
            return next(ApiError.UnauthorizedError())
        }

        req.user = user

        next()
    } catch {
        return next(ApiError.UnauthorizedError())
    }
}
