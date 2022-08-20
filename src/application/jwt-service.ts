import jwt, {decode} from 'jsonwebtoken'
import {SERVICE} from "../constants";
import {tokensRepository} from "../entities/tokens/tokens-repository";

export const jwtService = {

    async generateTokens(userId: string) {
        const accessToken = jwt.sign({userId: userId}, SERVICE.JWT_ACCESS_KEY, {expiresIn: '30d'})
        const refreshToken = jwt.sign({userId: userId}, SERVICE.JWT_REFRESH_KEY, {expiresIn: '30d'})

        return {
            accessToken,
            refreshToken
        }
    },

    async validateAccessToken(token: string) {
        try {
            const result: any = jwt.verify(token, SERVICE.JWT_ACCESS_KEY)
            return result.userId
        } catch {
            return null
        }
    },

    async validateRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, SERVICE.JWT_REFRESH_KEY)
            return result.userId
        } catch {
            return null
        }
    },

    async saveToken(userId: string, refreshToken: string) {

        const token = await tokensRepository.create(userId, refreshToken)

        return token
    },

    async deleteToken(refreshToken: string) {
        await tokensRepository.deleteToken(refreshToken)
    },

    async findToken(refreshToken: string) {
        const tokenData = await tokensRepository.findOneByToken(refreshToken)
        return tokenData
    },

    async checkTokenExpired(token: string) {
        const {exp}: any = decode(token)

        if (Date.now() >= exp * 1000) {
            return false;
        } else {
            return true
        }
    }
}

