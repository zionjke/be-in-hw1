import {ResponseType} from "../../types";

export type CommentType = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    addedAt: string
}

export type CommentDBType = CommentType & {
    postId: string
}

export type CommentsResponseType = ResponseType<CommentType[]>