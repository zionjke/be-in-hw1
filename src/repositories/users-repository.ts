import {usersCollection} from "../db";
import {pagination} from "../utils/pagination";
import {UserType, ResponseType, UserDBType} from "../types";

export const usersRepository = {
    async getUsers(pageNumber: number | undefined, _pageSize: number | undefined): Promise<ResponseType<UserType[]>> {
        const totalCount = await usersCollection.count()

        const {page, pageSize, startFrom, pagesCount} = pagination(pageNumber, _pageSize, totalCount)

        const users = await usersCollection
            .find({}, {projection: {_id: false, passwordHash: false}})
            .skip(startFrom)
            .limit(pageSize)
            .toArray()

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: users
        }
    },

    async createUser(user: UserDBType): Promise<UserType> {
        await usersCollection.insertOne({...user})

        const {passwordHash, email, ...userData} = user

        return userData
    },

    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id})

        return result.deletedCount !== 0
    },

    async getUserByLogin(login: string): Promise<UserDBType | null> {
        const user: UserDBType | null = await usersCollection.findOne({login}, {projection: {_id: false}})
        return user
    },

    async getUserByEmail(email: string): Promise<UserDBType | null> {
        const user: UserDBType | null = await usersCollection.findOne({email}, {projection: {_id: false}})
        return user
    },

    async getUserById(id: string): Promise<UserDBType | null> {
        const user: UserDBType | null = await usersCollection.findOne({id}, {projection: {_id: false}})
        return user
    },

    async getUserByConfirmationCode(code: string): Promise<UserDBType | null> {
        const user: UserDBType | null = await usersCollection.findOne({confirmationCode:code}, {projection: {_id: false}})
        return user
    },

    async getUserByLoginOrEmail(login: string, email: string): Promise<UserDBType[] | null> {
        const user: UserDBType[] | null = await usersCollection.find({$or: [{login}, {email}]}, {projection: {_id: false}}).toArray()
        return user
    },

    async registration(user: UserDBType): Promise<UserDBType> {
        await usersCollection.insertOne({...user})
        return user
    },

    async checkUserConfirmationCode(code: string): Promise<boolean> {
        const result = await usersCollection.updateOne(
            {confirmationCode: code},
            {$set: {isActivated: true}}
        )

        return result.matchedCount !== 0
    },

    async updateConfirmationCode(userId: string, code: string) {
        await usersCollection.updateOne(
            {id: userId},
            {$set: {confirmationCode: code}}
        )
    }
}