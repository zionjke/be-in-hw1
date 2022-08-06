import {tokensCollection} from "../../db";
import { TokenType } from "./types";


export const tokensRepository = {
    async create(userId: string, refreshToken: string): Promise<TokenType> {
        await tokensCollection.insertOne({userId, refreshToken})

        return {userId, refreshToken}
    },

    async findOneByUserId(userId: string): Promise<TokenType | null> {
        return await tokensCollection.findOne({userId}, {projection: {_id: false}})
    },

    async findOneByToken(refreshToken: string): Promise<TokenType | null> {
        return await tokensCollection.findOne({refreshToken}, {projection: {_id: false}})
    },

    async updateUserToken(userId: string, refreshToken: string) {
        await tokensCollection.updateOne({userId}, {$set: {refreshToken}})
    },

    async deleteToken(refreshToken: string) {
       return await tokensCollection.deleteOne({refreshToken})
    }
}