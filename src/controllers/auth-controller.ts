import {Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {authService} from "../domain/auth-service";
import {sendError} from "../middlewares/validationMiddleware";
import {SERVICE} from "../constants";

export const authController = {
    async login(req: Request, res: Response) {
        try {
            const {login, password} = req.body

            const user = await authService.checkCredentials(login, password)

            if (!user) {
                res.status(401).send('password or login is wrong')
                return;
            }

            const {accessToken, refreshToken} = await jwtService.generateTokens(user.id)

            // await jwtService.saveToken(user.id, refreshToken)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: SERVICE.COOKIE_SECURE
            })

            res.status(200).send({accessToken})
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

            const user = await usersService.getUserByConfirmationCode(code)

            if (user?.isActivated) {
                res.status(400).send(sendError('Code already confirmed', 'code'))
                return;
            }

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
    },

    async logOut(req: Request, res: Response) {
        try {
            const {refreshToken} = req.cookies

            if (!refreshToken) {
                res.sendStatus(401)
                return;
            }

            const isExpired = await jwtService.checkTokenExpired(refreshToken)

            if (!isExpired) {
                res.sendStatus(401)
                return;
            }

            const userId = await jwtService.validateRefreshToken(refreshToken)

            if (!userId) {
                res.sendStatus(401)
                return;
            }

            // const tokenFromDb = await jwtService.findToken(refreshToken)
            //
            // if (!tokenFromDb) {
            //     res.sendStatus(401)
            //     return;
            // }

            // await jwtService.deleteToken(refreshToken)

            // await jwtService.saveToken(userId, refreshToken)

            res.sendStatus(204).clearCookie('refreshToken', {expires: new Date(+0)})

        } catch (e) {
            console.log(e)
        }
    },

    async refresh(req: Request, res: Response) {
        const {refreshToken} = req.cookies

        if (!refreshToken) {
            res.sendStatus(401)
            return;
        }

        const userId = await jwtService.validateRefreshToken(refreshToken)

        if (!userId) {
            res.sendStatus(401)
            return;
        }

        const isExpired = await jwtService.checkTokenExpired(refreshToken)

        if (!isExpired) {
            res.sendStatus(401)
            return;
        }

        // const tokenFromDb = await jwtService.findToken(refreshToken)
        //
        // if (tokenFromDb) {
        //     res.sendStatus(401)
        //     return;
        // }


        // await jwtService.saveToken(userId, refreshToken)

        const tokens = await jwtService.generateTokens(userId)

        // res.cookie('refreshToken', tokens.refreshToken, {
        //     httpOnly: true,
        //     secure: SERVICE.COOKIE_SECURE
        // })

        res
            .status(200)
            .cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: SERVICE.COOKIE_SECURE
            })
            .send({accessToken: tokens.accessToken})
    },

    async me(req: Request, res: Response) {
        try {
            const {user} = req

            if (!user) {
                res.sendStatus(401)
                return;
            }

            res.status(200).json({
                userId: user.id,
                login: user.login,
                email: user.email
            })
        } catch (e) {
            res.status(500).send('Error getting user information')
        }
    }
}