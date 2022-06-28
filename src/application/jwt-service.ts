import jwt from 'jsonwebtoken'
import {UserDBType} from "../types";

export const jwtService = {
    async createJWT(user: UserDBType) {
        const token = jwt.sign({userId: user.id}, 'secret123', {expiresIn: '12h'})

        return token
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, 'secret123')
            return result.userId
        } catch {
            return null
        }
    }
}
