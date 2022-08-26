import {ResponseType} from "../../types";

export type CommentType = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    postId: string
    addedAt: Date,
    likesInfo: LikesInfoType
    info: InfoType[]
}

type LikesInfoType = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatusType
}

type InfoType = {
    addedAt: Date,
    userId: string,
    login: string,
    likeStatus: LikeStatusType
}

export type LikeStatusType = "None" | "Like" | "Dislike"

export type CommentsResponseType = ResponseType<CommentType[]>