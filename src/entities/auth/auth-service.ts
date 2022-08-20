import {usersService} from "../users/users-service";
import {v4} from "uuid";
import {usersRepository} from "../users/users-repository";
import mailService from '../../application/mail-service'
import {UserType} from "../users/types";
import {jwtService} from "../../application/jwt-service";
import {ApiError} from "../../exceptions/api-error";


export const authService = {
    async login(login: string, password: string) {
        const user = await this.checkCredentials(login, password)

        const {accessToken, refreshToken} = await jwtService.generateTokens(user.id)

        await jwtService.saveToken(user.id, refreshToken)

        return {accessToken, refreshToken}
    },

    async checkCredentials(login: string, password: string): Promise<UserType> {

        const user = await usersService.getUserByLogin(login)

        if (!user) {
            throw ApiError.UnauthorizedError()
        }

        const passwordHash = user.passwordHash

        const isVerify = await usersService.verifyPassword(password, passwordHash)

        if (!isVerify) {
            throw ApiError.UnauthorizedError()
        }

        return user
    },

    async registration(login: string, email: string, password: string) {

        const existLogin = await usersService.getUserByLogin(login)

        if (existLogin) {
            throw ApiError.BadRequestError('User with this login already exists', 'login')
        }

        const existEmail = await usersService.getUserByEmail(email)

        if (existEmail) {
            throw ApiError.BadRequestError('User with this email already exists', 'email')
        }


        const user = await usersService.createUser(login, password, email)

        try {
            await mailService.sendActivationMail(user.email, user.confirmationCode)
        } catch (error) {
            console.log(error)
        }
    },

    async confirmRegistration(code: string) {
        const user = await usersService.getUserByConfirmationCode(code)

        if (user.isActivated) {
            throw ApiError.BadRequestError('Code already confirmed', 'code')
        }

        const isActivated = await usersRepository.checkUserConfirmationCode(code)

        if (!isActivated) {
            throw ApiError.BadRequestError('Incorrect confirmation code', 'code')
        }
    },

    async emailResending(email: string) {

        const user = await usersService.getUserByEmail(email)

        if (!user) {
            throw ApiError.BadRequestError('User doesnt exist', 'email')
        }

        if (user.isActivated) {
            throw ApiError.BadRequestError('Email already confirmed', 'email')
        }

        const newConfirmationCode = v4()

        await usersRepository.updateConfirmationCode(user.id, newConfirmationCode)

        try {
            await mailService.sendActivationMail(user.email, newConfirmationCode)
        } catch (error) {
            console.log(error)
        }
    },

    async refreshToken(userId:string) {

        const tokens = await jwtService.generateTokens(userId)

        await jwtService.saveToken(userId, tokens.refreshToken)

        return tokens
    }
}