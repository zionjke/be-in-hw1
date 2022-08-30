import {ResponseType} from "../../types";

export type PostType = {
    id: string,
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
    addedAt: Date,
    extendedLikesInfo: ExtendedLikesInfoType
    info: InfoType[]
}

type ExtendedLikesInfoType = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatusType,
    newestLikes: LikeType[]
}

type LikeType = {
    addedAt: Date,
    userId: string,
    login: string
}

type InfoType = {
    addedAt: Date,
    userId: string,
    login: string,
    likeStatus: LikeStatusType
}

type LikeStatusType = "None" | "Like" | "Dislike"

export type PostsResponseType = ResponseType<PostType[]>