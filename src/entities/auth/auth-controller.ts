import {NextFunction, Request, Response} from "express";
import {SERVICE} from "../../constants";
import {AuthService} from "./auth-service";
import {inject, injectable} from "inversify";

@injectable()
export class AuthController {
    constructor(@inject(AuthService) protected authService: AuthService) {
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {login, password} = req.body

            const {accessToken, refreshToken} = await this.authService.login(login, password)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: SERVICE.COOKIE_SECURE
            })

            res.status(200).send({accessToken})
        } catch (error) {
            next(error)
        }
    }

    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, login, password} = req.body

            await this.authService.registration(login, email, password)

            res.status(204).send('Email with confirmation code will be send to passed email address')
        } catch (error) {
            next(error)
        }
    }

    async confirmRegistration(req: Request, res: Response, next: NextFunction) {
        try {
            const {code} = req.body

            await this.authService.confirmRegistration(code)

            res.status(204).send('Email was verified. Account was activated')
        } catch (error) {
            next(error)
        }
    }

    async emailResending(req: Request, res: Response, next: NextFunction) {
        try {
            const {email} = req.body

            await this.authService.emailResending(email)

            res.status(204).send('Email with confirmation code will be send to passed email address.')
        } catch (error) {
            next(error)
        }
    }

    async logOut(req: Request, res: Response, next: NextFunction) {
        res.sendStatus(204).clearCookie('refreshToken', {expires: new Date(+0)})
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user

            const tokens = await this.authService.refreshToken(user.id)

            res.status(200)
                .cookie('refreshToken', tokens.refreshToken, {
                    httpOnly: true,
                    secure: SERVICE.COOKIE_SECURE
                })
                .send({accessToken: tokens.accessToken})
        } catch (error) {
            next(error)
        }
    }

    async me(req: Request, res: Response, next: NextFunction) {
        const {user} = req

        res.status(200).json({
            userId: user.id,
            login: user.login,
            email: user.email
        })
    }
}

