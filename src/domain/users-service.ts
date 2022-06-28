import {usersRepository} from "../repositories/users-repository";
import {UserType, ResponseType, UserDBType} from "../types";
import {v4} from "uuid";
import bcrypt from 'bcrypt'

export const usersService = {
    async getUsers(pageNumber: number | undefined, _pageSize: number | undefined): Promise<ResponseType<UserType[]>> {
        return await usersRepository.getUsers(pageNumber, _pageSize)
    },

    async createUser(login: string, password: string): Promise<UserType> {
        const passwordSalt = await bcrypt.genSalt(10)

        const passwordHash = await this.generateHash(password, passwordSalt)

        const newUser: UserDBType = {
            id: v4(),
            login,
            passwordHash,
        }
        return await usersRepository.createUser(newUser)
    },

    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },

    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.getUserByLogin(login)

        if (!user) {
            return;
        }

        const passwordSalt = user.passwordHash.split('.')[0]

        const passwordHash = await this.generateHash(password, passwordSalt)

        if (user.passwordHash !== passwordHash) {
            return;
        }

        return user
    },

    async generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}