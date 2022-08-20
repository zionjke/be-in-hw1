import {ResponseType} from "../../types";

export type CommentType = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    addedAt: Date,
    likesInfo: LikesInfoType
}

export type CommentDBType = CommentType & {
    postId: string
}

type LikesInfoType = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatusType
}

type LikeStatusType = "None" | "Like" | "Dislike"

export type CommentsResponseType = ResponseType<CommentType[]>