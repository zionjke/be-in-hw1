import mongoose, {model} from "mongoose";
import {CommentType} from "./types";

const commentSchema = new mongoose.Schema<CommentType>({
    id: {type: String, required: true},
    content: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    addedAt: Date,
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String,
    },
    info: [{
        addedAt: Date,
        userId: String,
        login: String,
        likeStatus: String
    }]
},{versionKey: false})

export const Comment = model<CommentType>('Comment', commentSchema)