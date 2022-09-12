import {ResponseType} from "../../types";

export class PostType {
    id: string
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
    addedAt: Date
    extendedLikesInfo: ExtendedLikesInfoType
    info: InfoType[]

    constructor(id: string, title: string, shortDescription: string, content: string, bloggerId: string, bloggerName: string, addedAt: Date, extendedLikesInfo: ExtendedLikesInfoType, info: InfoType[]) {
        this.id = id
        this.title = title
        this.shortDescription = shortDescription
        this.content = content
        this.bloggerId = bloggerId
        this.bloggerName = bloggerName
        this.addedAt = addedAt
        this.extendedLikesInfo = extendedLikesInfo
        this.info = info
    }
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

export type PostsResponseType = ResponseType<Omit<PostType, "info">[]>
