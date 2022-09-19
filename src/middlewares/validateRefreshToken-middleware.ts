import {NextFunction, Request, Response} from "express";
import {ApiError} from "../exceptions/api-error";
import {container} from "../composition-root";
import {UsersService} from "../entities/users/users-service";
import {JwtService} from "../application/jwt-service";

export const validateRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usersService = container.get(UsersService)

        const jwtService = container.get(JwtService)

        const {refreshToken} = req.cookies

        if (!refreshToken) {
            return next(ApiError.UnauthorizedError())
        }

        const isExpired = await jwtService.checkTokenExpired(refreshToken)

        if (!isExpired) {
            return next(ApiError.UnauthorizedError())
        }

        const userId = await jwtService.validateRefreshToken(refreshToken)

        if (!userId) {
            return next(ApiError.UnauthorizedError())
        }

        const tokenFromDb = await jwtService.findToken(refreshToken)

        if (!tokenFromDb) {
            return next(ApiError.UnauthorizedError())
        }

        await jwtService.deleteToken(refreshToken)

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
