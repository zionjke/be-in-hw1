import {ResponseType} from "../../types";

export type UserType = {
    id: string,
    login: string,
}

export type UserDBType = UserType & {
    passwordHash: string,
    email: string,
    confirmationCode?: string
    isActivated?: boolean
}

export type UsersResponseType = ResponseType<UserType[]>