import jwt from 'jsonwebtoken'
import { UserType} from "../types";
import {SERVICE} from "../constants";

export const jwtService = {
    async createJWT(user: UserType) {
        const token = jwt.sign({userId: user.id}, SERVICE.SECRET_KEY, {expiresIn: '12h'})

        return token
    },

    async getUserIdByToken(token: string):Promise<string | null> {
        try {
            const result: any = jwt.verify(token, SERVICE.SECRET_KEY)
            return result.userId
        } catch {
            return null
        }
    }
}

