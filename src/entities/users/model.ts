import mongoose, {model} from "mongoose";
import {UserType} from "./types";

const userSchema = new mongoose.Schema<UserType>({
    id: {type: String, required: true},
    login: {type: String, required: true},
    passwordHash: {type: String, required: true},
    email: {type: String, required: true},
    confirmationCode: {type: String, required: true},
    isActivated: Boolean
}, {versionKey: false})

export const User = model<UserType>('User', userSchema)
