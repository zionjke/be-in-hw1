import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";

export const authRouter = Router();

authRouter
    .post('/login', async (req: Request, res: Response) => {

        const {login, password} = req.body

        const user = await usersService.checkCredentials(login, password)

        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(201).send(token)
        } else {
            res.status(401).send('password or login is wrong')
        }
    })