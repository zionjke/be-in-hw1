import { TokenType } from "./types";
import {Token} from "./model";
import {injectable} from "inversify";

@injectable()
export class TokensService {
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
