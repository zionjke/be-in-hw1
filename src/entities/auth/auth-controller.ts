import {NextFunction, Request, Response} from "express";
import {authService} from "./auth-service";
import {SERVICE} from "../../constants";

export const authController = {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {login, password} = req.body

            const {accessToken, refreshToken} = await authService.login(login, password)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: SERVICE.COOKIE_SECURE
            })

            res.status(200).send({accessToken})
        } catch (error) {
            next(error)
        }
    },

    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, login, password} = req.body

            await authService.registration(login, email, password)

            res.status(204).send('Email with confirmation code will be send to passed email address')
        } catch (error) {
            next(error)
        }
    },

    async confirmRegistration(req: Request, res: Response, next: NextFunction) {
        try {
            const {code} = req.body

            await authService.confirmRegistration(code)

            res.status(204).send('Email was verified. Account was activated')
        } catch (error) {
            next(error)
        }
    },

    async emailResending(req: Request, res: Response, next: NextFunction) {
        try {
            const {email} = req.body

            await authService.emailResending(email)

            res.status(204).send('Email with confirmation code will be send to passed email address.')
        } catch (error) {
            next(error)
        }
    },

    async logOut(req: Request, res: Response, next: NextFunction) {
        try {
            res.sendStatus(204).clearCookie('refreshToken', {expires: new Date(+0)})
        } catch (error) {
            next(error)
        }
    },

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user

            const tokens = await authService.refreshToken(user.id)

            res.status(200)
                .cookie('refreshToken', tokens.refreshToken, {
                    httpOnly: true,
                    secure: SERVICE.COOKIE_SECURE
                })
                .send({accessToken: tokens.accessToken})
        } catch (error) {
            next(error)
        }
    },

    async me(req: Request, res: Response, next: NextFunction) {
        try {
            const {user} = req

            res.status(200).json({
                userId: user.id,
                login: user.login,
                email: user.email
            })
        } catch (error) {
            next(error)
        }
    }
}