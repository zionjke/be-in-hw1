import {usersRepository} from "./users-repository";
import {v4} from "uuid";
import bcrypt from 'bcrypt'
import {UsersResponseType, UserType} from "./types";
import {ApiError} from "../../exceptions/api-error";

export const usersService = {
    async getUsers(pageNumber?: number, _pageSize?: number): Promise<UsersResponseType> {
        return usersRepository.getUsers(pageNumber, _pageSize)
    },

    async createUser(login: string, password: string, email: string): Promise<UserType> {

        const passwordSalt = await bcrypt.genSalt(10)

        const passwordHash = await this.generateHash(password, passwordSalt)

        const newUser: UserType = {
            id: v4(),
            login,
            email,
            passwordHash,
            confirmationCode: v4(),
            isActivated: false
        }

        return usersRepository.createUser(newUser)
    },

    async deleteUser(id: string) {
        const isDeleted = await usersRepository.deleteUser(id)

        if (!isDeleted) {
            throw ApiError.NotFoundError('User not found')
        }
    },

    async getUserByID(id: string): Promise<UserType | null> {
        return usersRepository.getUserById(id)
    },

    async getUserByEmail(email: string): Promise<UserType | null> {
        return usersRepository.getUserByEmail(email)
    },

    async getUserByLogin(email: string): Promise<UserType | null> {
        return usersRepository.getUserByLogin(email)
    },

    async getUserByConfirmationCode(code: string): Promise<UserType> {
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