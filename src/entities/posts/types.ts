import {ResponseType} from "../../types";

export type PostType = {
    id: string,
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
}

export type PostsResponseType = ResponseType<PostType[]>