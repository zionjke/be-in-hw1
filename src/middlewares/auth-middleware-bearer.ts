import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const authMiddlewareBearer = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        res.status(401).send('Log in please')
        return;
    }

    const [, token] = req.headers.authorization.split(' ')

    const userId = await jwtService.validateAccessToken(token)

    if (!userId) {
        res.sendStatus(401)
        return;
    }

    req.user = await usersService.getUserByID(userId)

    next()
}