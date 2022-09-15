import {NextFunction, Request, Response} from "express";
import {jwtService, usersService } from "../composition-root";

export const checkUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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
