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

type LikeStatusType = "None" | "Like" | "Dislike"

export type PostsResponseType = ResponseType<PostType[]>