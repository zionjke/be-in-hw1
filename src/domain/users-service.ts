import {usersRepository} from "../repositories/users-repository";
import {UserType, ResponseType, UserDBType} from "../types";
import {v4} from "uuid";
import bcrypt from 'bcrypt'

export const usersService = {
    async getUsers(pageNumber: number | undefined, _pageSize: number | undefined): Promise<ResponseType<UserType[]>> {
        return await usersRepository.getUsers(pageNumber, _pageSize)
    },

    async createUser(login: string, password: string, email: string): Promise<UserType | boolean> {

        const existUser = await usersRepository.getUserByLogin(login)

        if (existUser) {
            return false
        }

        const passwordSalt = await bcrypt.genSalt(10)

        const passwordHash = await this.generateHash(password, passwordSalt)

        const newUser: UserDBType = {
            id: v4(),
            login,
            email,
            passwordHash,
            isActivated: false,
            confirmationCode: v4()
        }
        return await usersRepository.createUser(newUser)
    },

    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },

    async getUserByID(id: string): Promise<UserType | null> {
        return await usersRepository.getUserById(id)
    },

    async getUserByEmail(email: string): Promise<UserDBType | null> {
        return await usersRepository.getUserByEmail(email)
    },

    async getUserByLogin(email: string): Promise<UserDBType | null> {
        return await usersRepository.getUserByLogin(email)
    },

    async getUserByLoginOrEmail(login: string, email: string): Promise<UserDBType[] | null> {
        return await usersRepository.getUserByLoginOrEmail(login, email)
    },

    async checkCredentials(login: string, password: string): Promise<UserType | null> {

        const user = await usersRepository.getUserByLogin(login)

        if (!user) {
            return null;
        }

        const passwordHash = user.passwordHash

        const isVerify = await this.verifyPassword(password, passwordHash)

        if (!isVerify) {
            return null;
        }

        return user
    },

    async generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)

        return hash
    },

    async verifyPassword(password: string, hash: string) {
        const isVerify = await bcrypt.compare(password, hash)

        return isVerify
    }
}