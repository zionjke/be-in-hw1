import bcrypt from "bcrypt";
import {usersService} from "./users-service";
import {v4} from "uuid";
import {usersRepository} from "../repositories/users-repository";
import {UserDBType, UserType} from "../types";
import mailService from '../application/mail-service'
import {jwtService} from "../application/jwt-service";

export const authService = {

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

    async registration(login: string, email: string, password: string): Promise<boolean> {
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
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },

    async checkUserConfirmationCode(code: string): Promise<boolean> {
        return await usersRepository.checkUserConfirmationCode(code)
    },

    async emailResending(user: UserDBType) {

        const newConfirmationCode = v4()

        await usersRepository.updateConfirmationCode(user.id, newConfirmationCode)

        try {
            await mailService.sendActivationMail(user.email, newConfirmationCode)
        } catch (error) {
            console.log(error)
        }
    },

    async logOut() {

    },

    async refreshToken(refreshToken: string) {

    }
}