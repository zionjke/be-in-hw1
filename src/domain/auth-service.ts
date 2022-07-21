import bcrypt from "bcrypt";
import {usersService} from "./users-service";
import {v4} from "uuid";
import {mailer} from "../application/mailer";
import {usersRepository} from "../repositories/users-repository";
import {UserDBType} from "../types";

export const authService = {
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
            await mailer.sendEmail({
                emailTo: user.email,
                subject: "Confirmation of registration",
                text: "Follow the link to confirm your registration",
                html: `To verify your email, go to <a href="http://localhost:5000/auth/registration-confirmation?code=${user.confirmationCode}">by this link</a>`,
            })
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },

    async checkUserConfirmationCode(code: string): Promise<boolean> {
        return  await usersRepository.checkUserConfirmationCode(code)
    },

    async emailResending(user: UserDBType) {

        const newConfirmationCode = v4()

        await usersRepository.updateConfirmationCode(user.id, newConfirmationCode)

        try {
            await mailer.sendEmail({
                emailTo: user.email,
                subject: "Confirmation of registration",
                text: "Follow the link to confirm your registration",
                html: `To verify your email, go to <a href="http://localhost:5000/auth/registration-confirmation?code=${newConfirmationCode}">by this link</a>`,
            })
        } catch (error) {
            console.log(error)
        }
    }
}