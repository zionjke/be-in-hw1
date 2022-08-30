import mongoose, {model} from "mongoose";
import {PostType} from "./types";

const likeInfoSchema = new mongoose.Schema({
    addedAt: Date,
    userId: String,
    login: String
}, {_id: false})

const postSchema = new mongoose.Schema<PostType>({
    id: {type: String, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    bloggerId: {type: String, required: true},
    bloggerName: String,
    addedAt: Date,
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String,
        newestLikes: [likeInfoSchema]
    },
    info: [{addedAt: Date, userId: String, login: String, likeStatus: String}]
})


export const Post = model<PostType>('Post', postSchema)