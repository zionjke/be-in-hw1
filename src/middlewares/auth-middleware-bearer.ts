import {NextFunction, Request, Response} from "express";
import {container} from "../composition-root";
import {ApiError} from "../exceptions/api-error";
import {UsersService} from "../entities/users/users-service";
import {JwtService} from "../application/jwt-service";

export const authMiddlewareBearer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usersService = container.get(UsersService)

        const jwtService = container.get(JwtService)

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
