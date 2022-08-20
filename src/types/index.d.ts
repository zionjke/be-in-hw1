import {UserType} from "../entities/users/types";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserType
        }
    }
}