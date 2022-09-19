import {NextFunction, Request, Response} from "express";
import {container} from "../composition-root";
import {UsersService} from "../entities/users/users-service";
import {JwtService} from "../application/jwt-service";

export const checkUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const usersService = container.get(UsersService)

    const jwtService = container.get(JwtService)

    if (req.headers.authorization) {
        const [, accessToken] = req.headers.authorization.split(' ')

        const userId = await jwtService.validateAccessToken(accessToken)

        const user = await usersService.getUserByID(userId)

        if (user) {
            req.user = user
        }

    }

    next()
}
