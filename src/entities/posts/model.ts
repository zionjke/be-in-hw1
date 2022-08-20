import mongoose, {model} from "mongoose";
import {PostType} from "./types";

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
        newestLikes: [
            {
                addedAt: Date,
                userId: String,
                login: String
            }
        ]
    }
})

export const Post = model<PostType>('Post', postSchema)