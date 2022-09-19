import {v4} from "uuid";
import {MailService} from '../../application/mail-service'
import {UserType} from "../users/types";
import {JwtService} from "../../application/jwt-service";
import {ApiError} from "../../exceptions/api-error";
import {UsersService} from "../users/users-service";
import {inject, injectable} from "inversify";

@injectable()
export class AuthService {
    constructor(
        @inject(UsersService) protected usersService: UsersService,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(MailService) protected mailService: MailService) {}

    async login(login: string, password: string) {
        const user = await this.checkCredentials(login, password)

        const {accessToken, refreshToken} = await this.jwtService.generateTokens(user.id)

        await this.jwtService.saveToken(user.id, refreshToken)

        return {accessToken, refreshToken}
    }

    async checkCredentials(login: string, password: string): Promise<UserType> {

        const user = await this.usersService.getUserByLogin(login)

        console.log('USER',user)

        if (!user) {
            throw ApiError.UnauthorizedError()
        }

        const passwordHash = user.passwordHash

        const isVerify = await this.usersService.verifyPassword(password, passwordHash)

        if (!isVerify) {
            throw ApiError.UnauthorizedError()
        }

        return user
    }

    async registration(login: string, email: string, password: string) {

        const existLogin = await this.usersService.getUserByLogin(login)

        if (existLogin) {
            throw ApiError.BadRequestError('User with this login already exists', 'login')
        }

        const existEmail = await this.usersService.getUserByEmail(email)

        if (existEmail) {
            throw ApiError.BadRequestError('User with this email already exists', 'email')
        }

        const user = await this.usersService.createUser(login, password, email)

        try {
            await this.mailService.sendActivationMail(user.email, user.confirmationCode)
        } catch (error) {
            console.log(error)
        }
    }

    async confirmRegistration(code: string) {
        const user = await this.usersService.getUserByConfirmationCode(code)

        if (user.isActivated) {
            throw ApiError.BadRequestError('Code already confirmed', 'code')
        }

        const isActivated = await this.usersService.checkUserConfirmationCode(code)

        if (!isActivated) {
            throw ApiError.BadRequestError('Incorrect confirmation code', 'code')
        }
    }

    async emailResending(email: string) {

        const user = await this.usersService.getUserByEmail(email)

        if (!user) {
            throw ApiError.BadRequestError('User doesnt exist', 'email')
        }

        if (user.isActivated) {
            throw ApiError.BadRequestError('Email already confirmed', 'email')
        }

        const newConfirmationCode = v4()

        await this.usersService.updateUserConfirmationCode(user.id, newConfirmationCode)

        try {
            await this.mailService.sendActivationMail(user.email, newConfirmationCode)
        } catch (error) {
            console.log(error)
        }
    }

    async refreshToken(userId: string) {

        const tokens = await this.jwtService.generateTokens(userId)

        await this.jwtService.saveToken(userId, tokens.refreshToken)

        return tokens
    }
}
