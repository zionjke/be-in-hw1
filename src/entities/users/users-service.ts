import {usersRepository} from "./users-repository";
import {v4} from "uuid";
import bcrypt from 'bcrypt'
import {UserDBType, UsersResponseType, UserType} from "./types";
import {ApiError} from "../../exceptions/api-error";

export const usersService = {
    async getUsers(pageNumber?: number, _pageSize?: number): Promise<UsersResponseType> {
        return usersRepository.getUsers(pageNumber, _pageSize)
    },

    async createUser(login: string, password: string, email: string): Promise<UserType> {

        const passwordSalt = await bcrypt.genSalt(10)

        const passwordHash = await this.generateHash(password, passwordSalt)

        const newUser: UserDBType = {
            id: v4(),
            login,
            email,
            passwordHash,
        }

        return usersRepository.createUser(newUser)
    },

    async deleteUser(id: string) {
        const isDeleted = await usersRepository.deleteUser(id)

        if (!isDeleted) {
            throw ApiError.NotFoundError('User not found')
        }
    },

    async getUserByID(id: string): Promise<UserDBType | null> {
        return await usersRepository.getUserById(id)
    },

    async getUserByEmail(email: string): Promise<UserDBType | null> {
        return await usersRepository.getUserByEmail(email)
    },

    async getUserByLogin(email: string): Promise<UserDBType | null> {
        return await usersRepository.getUserByLogin(email)
    },

    async getUserByConfirmationCode(code: string): Promise<UserDBType> {
        const user = await usersRepository.getUserByConfirmationCode(code)

        if (!user) {
            throw ApiError.NotFoundError('User not found')
        }

        return user
    },

    async generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)

        return hash
    },

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        const isVerify = await bcrypt.compare(password, hash)

        return isVerify
    }
}