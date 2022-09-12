import {ResponseType} from "../../types";

export class UserType {
    id: string
    login: string
    passwordHash: string
    email: string
    confirmationCode: string
    isActivated: boolean

    constructor(id: string, login: string, passwordHash: string, email: string, confirmationCode: string, isActivated: boolean) {
        this.id = id
        this.login = login
        this.passwordHash = passwordHash
        this.email = email
        this.confirmationCode = confirmationCode
        this.isActivated = isActivated
    }
}

export type UsersResponseType = ResponseType<UserType[]>
