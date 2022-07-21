import {Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authService} from "../domain/auth-service";
import {sendError} from "../middlewares/validationMiddleware";

export const authController = {
    async login(req: Request, res: Response) {
        try {
            const {login, password} = req.body

            const user = await usersService.checkCredentials(login, password)

            if (!user) {
                res.status(401).send('password or login is wrong')
                return;
            }

            const token = await jwtService.createJWT(user)

            res.status(200).send({token})
        } catch (error) {
            console.log(error)
            res.status(500).send('Failed to login')
        }
    },

    async registration(req: Request, res: Response) {
        try {
            const {email, login, password} = req.body

            const existUserByLogin = await usersService.getUserByLogin(login)

            if (existUserByLogin) {
                res.status(400).send(sendError('Пользователь с таким логином уже сущевствует', 'login'))
                return;
            }

            const existUserByEmail = await usersService.getUserByEmail(email)

            if (existUserByEmail) {
                res.status(400).send(sendError('Пользователь с таким имейлом уже сущевствует', 'email'))
                return;
            }


            const isUserRegister = await authService.registration(login, email, password)

            if (!isUserRegister) {
                res.sendStatus(404)
                return;
            }

            res.status(204).send('Email with confirmation code will be send to passed email address')

        } catch (error) {
            console.log(error)
            res.status(500).send('Registration failed')
        }

    },
    async confirmRegistration(req: Request, res: Response) {
        try {
            const {code} = req.body

            const isActivated = await authService.checkUserConfirmationCode(code)

            if (!isActivated) {
                res.status(400).send(sendError('Incorrect confirmation code', 'code'))
                return;
            }

            res.status(204).send('Email was verified. Account was activated')
        } catch (error) {
            console.log(error)
            res.status(500).send('Confirm Registration failed')
        }
    },
    async emailResending(req: Request, res: Response) {
        try {
            const {email} = req.body

            const user = await usersService.getUserByEmail(email)

            if (!user) {
                res.status(400).send(sendError('User email doesnt exist', 'email'))
                return;
            }

            if (user.isActivated) {
                res.status(400).send(sendError('Email already confirmed', 'email'))
                return;
            }

            await authService.emailResending(user)

            res.status(204).send('Email with confirmation code will be send to passed email address.')
        } catch (error) {
            console.log(error)
            res.status(500).send('Email resending failed')
        }
    }
}