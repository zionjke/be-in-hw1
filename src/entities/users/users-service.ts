import {v4} from "uuid";
import bcrypt from 'bcrypt'
import {UsersResponseType, UserType} from "./types";
import {ApiError} from "../../exceptions/api-error";
import {UsersRepository} from "./users-repository";

export class UsersService {
    usersRepository: UsersRepository

    constructor() {
        this.usersRepository = new UsersRepository()
    }

    async getUsers(pageNumber?: number, _pageSize?: number): Promise<UsersResponseType> {
        return this.usersRepository.getUsers(pageNumber, _pageSize)
    }

    async createUser(login: string, password: string, email: string): Promise<UserType> {

        const passwordSalt = await bcrypt.genSalt(10)

        const passwordHash = await this.generateHash(password, passwordSalt)

        const newUser = new UserType(v4(), login, email, passwordHash, v4(), false)


        return this.usersRepository.createUser(newUser)
    }

    async deleteUser(id: string) {
        const isDeleted = await this.usersRepository.deleteUser(id)

        if (!isDeleted) {
            throw ApiError.NotFoundError('User not found')
        }
    }

    async getUserByID(id: string): Promise<UserType | null> {
        return this.usersRepository.getUserById(id)
    }



    async getUserByEmail(email: string): Promise<UserType | null> {
        return this.usersRepository.getUserByEmail(email)
    }



    async getUserByLogin(email: string): Promise<UserType | null> {
        return this.usersRepository.getUserByLogin(email)
    }


    async getUserByConfirmationCode(code: string): Promise<UserType> {
        const user = await this.usersRepository.getUserByConfirmationCode(code)

        if (!user) {
            throw ApiError.NotFoundError('User not found')
        }

        return user
    }


    async generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)

        return hash
    }

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        const isVerify = await bcrypt.compare(password, hash)

        return isVerify
    }
}
