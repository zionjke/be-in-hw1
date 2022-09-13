import {NextFunction, Request, Response} from "express";
import {ApiError} from "../exceptions/api-error";
import {jwtService} from "../application/jwt-service";
import { usersService } from "../composition-root";

export const validateRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
