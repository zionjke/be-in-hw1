import mongoose, {model} from "mongoose";
import {TokenType} from "./types";

const tokenSchema = new mongoose.Schema<TokenType>({
    userId: String,
    refreshToken: String
})

export const Token = model<TokenType>('Token', tokenSchema)