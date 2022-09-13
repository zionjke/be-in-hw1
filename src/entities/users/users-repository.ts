import {pagination} from "../../utils/pagination";
import {UsersResponseType, UserType} from "./types";
import {User} from "./model";

export class UsersRepository {
    async getUsers(pageNumber?: number, _pageSize?: number): Promise<UsersResponseType> {
        const totalCount = await User.countDocuments()

        const {page, pageSize, startFrom, pagesCount} = pagination(pageNumber, _pageSize, totalCount)

        const users = await User
            .find({}, {_id: false,
                passwordHash: false,
                email: false,
                confirmationCode: false,
                isActivated: false
            })
            .skip(startFrom)
            .limit(pageSize)
            .lean()


        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: users
        }
    }

    async createUser(newUser: UserType): Promise<UserType> {
        const user = new User(newUser)

        await user.save()

        return newUser
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await User.deleteOne({id})

        return result.deletedCount !== 0
    }

    async getUserByLogin(login: string): Promise<UserType | null> {
        const user: UserType | null = await User.findOne({login})
        return user
    }

    async getUserByEmail(email: string): Promise<UserType | null> {
        const user: UserType | null = await User.findOne({email})
        return user
    }

    async getUserById(id: string): Promise<UserType | null> {
        const user: UserType | null = await User.findOne({id})
        return user
    }

    async getUserByConfirmationCode(code: string): Promise<UserType | null> {
        const user: UserType | null = await User.findOne({confirmationCode: code})
        return user
    }

    async checkUserConfirmationCode(code: string): Promise<boolean> {
        const result = await User.updateOne(
            {confirmationCode: code},
            {isActivated: true}
        )

        return result.matchedCount !== 0
    }

    async updateUserConfirmationCode(userId: string, code: string) {
        await User.updateOne(
            {id: userId},
            {confirmationCode: code}
        )
    }
}
