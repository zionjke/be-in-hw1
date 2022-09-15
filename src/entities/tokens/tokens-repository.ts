import { TokenType } from "./types";
import {Token} from "./model";

export class TokensRepository {
    async create(userId: string, refreshToken: string): Promise<TokenType> {

        const token = new Token({userId, refreshToken})

        await token.save()

        return {userId, refreshToken}
    }

    async findOneByToken(refreshToken: string): Promise<TokenType | null> {
        const token = await Token.findOne({refreshToken})

        return token
    }

    async deleteToken(refreshToken: string) {
        await Token.deleteOne({refreshToken})
    }
}
