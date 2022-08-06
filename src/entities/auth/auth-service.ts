import bcrypt from "bcrypt";
import {usersService} from "../users/users-service";
import {v4} from "uuid";
import {usersRepository} from "../users/users-repository";
import mailService from '../../application/mail-service'
import {UserDBType, UserType} from "../users/types";
import {jwtService} from "../../application/jwt-service";
import {ApiError} from "../../exceptions/api-error";


export const authService = {

    async login(login: string, password: string) {
        const user = await this.checkCredentials(login, password)

        if (!user) {
            throw ApiError.UnauthorizedError()
        }

        const {accessToken, refreshToken} = await jwtService.generateTokens(user.id)

        await jwtService.saveToken(user.id, refreshToken)

        return {accessToken, refreshToken}
    },

    async checkCredentials(login: string, password: string): Promise<UserType | null> {

        const user = await usersRepository.getUserByLogin(login)

        if (!user) {
            return null;
        }

        const passwordHash = user.passwordHash

        const isVerify = await usersService.verifyPassword(password, passwordHash)

        if (!isVerify) {
            return null;
        }

        return user
    },

    async registration(login: string, email: string, password: string) {

        const existUserByLogin = await usersService.getUserByLogin(login)

        if (existUserByLogin) {
            throw ApiError.BadRequestError('User with this login already exists', 'login')
        }

        const existUserByEmail = await usersService.getUserByEmail(email)

        if (existUserByEmail) {
            throw ApiError.BadRequestError('User with this email already exists', 'email')
        }

        const passwordSalt = await bcrypt.genSalt(10)

        const passwordHash = await usersService.generateHash(password, passwordSalt)

        const newUser: UserDBType = {
            id: v4(),
            login,
            email,
            passwordHash,
            isActivated: false,
            confirmationCode: v4()
        }

        const user = await usersRepository.registration(newUser)

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

    async logOut(refreshToken: string) {

        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const isExpired = await jwtService.checkTokenExpired(refreshToken)

        if (!isExpired) {
            throw ApiError.UnauthorizedError()
        }

        const userId = await jwtService.validateRefreshToken(refreshToken)

        if (!userId) {
            throw ApiError.UnauthorizedError()
        }

        const tokenFromDb = await jwtService.findToken(refreshToken)

        if (!tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        await jwtService.deleteToken(refreshToken)
    },

    async refreshToken(refreshToken: string) {

        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const userId = await jwtService.validateRefreshToken(refreshToken)

        if (!userId) {
            throw ApiError.UnauthorizedError()
        }

        const isExpired = await jwtService.checkTokenExpired(refreshToken)

        if (!isExpired) {
            throw ApiError.UnauthorizedError()
        }

        const tokenFromDb = await jwtService.findToken(refreshToken)

        if (!tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        await jwtService.deleteToken(tokenFromDb.refreshToken)

        const tokens = await jwtService.generateTokens(userId)

        await jwtService.saveToken(userId, tokens.refreshToken)

        return tokens
    }
}