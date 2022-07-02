import {Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";

export const authController = {
    async login(req: Request, res: Response) {
        try {
            const {login, password} = req.body

            const user = await usersService.checkCredentials(login, password)

            if (user) {
                const token = await jwtService.createJWT(user)
                res.status(200).send({token})
            } else {
                res.status(401).send('password or login is wrong')
            }
        } catch {
            res.status(500).send('Failed to login')
        }
    }
}