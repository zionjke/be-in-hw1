import mongoose, {model} from "mongoose";
import {BloggerType} from "./types";

const bloggerSchema = new mongoose.Schema<BloggerType>({
    id: {type: String, required: true},
    name: {type: String, required: true},
    youtubeUrl: {type: String, required: true}
}, {versionKey: false})

export const Blogger = model<BloggerType>('Blogger', bloggerSchema)
