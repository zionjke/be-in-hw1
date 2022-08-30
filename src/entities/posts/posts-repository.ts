import {pagination} from "../../utils/pagination";
import {PostsResponseType, PostType} from "./types";
import {Post} from "./model";
import {LikeStatusType} from "../comments/types";
import {UserType} from "../users/types";

export const postsRepository = {
    async getPosts(pageNumber?: number, _pageSize?: number): Promise<PostsResponseType> {
        const totalCount = await Post.countDocuments()

        const {page, pageSize, startFrom, pagesCount} = pagination(pageNumber, _pageSize, totalCount)

        const posts = await Post
            .find({}, {_id: false, __v: false, info: false})
            .skip(startFrom)
            .limit(pageSize)
            .lean()

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: posts
        }
    },

    async getBloggerPosts(bloggerId: string, pageNumber?: number, _pageSize?: number): Promise<PostsResponseType> {
        const totalCount = await Post.countDocuments({bloggerId})

        const {page, pageSize, startFrom, pagesCount} = pagination(pageNumber, _pageSize, totalCount)

        const posts = await Post
            .find({bloggerId}, {_id: false, __v: false, info: false})
            .skip(startFrom)
            .limit(pageSize)
            .lean()

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: posts
        }
    },

    async createPost(newPost: PostType): Promise<Omit<PostType, "info">> {

        const post = new Post(newPost)

        await post.save()

        const {info, ...postData} = newPost

        return postData
    },

    async getPostById(id: string, userId?: string): Promise<Omit<PostType, "info"> | null> {
        const post: PostType | null = await Post.findOne(
            {id},
            {
                _id: false,
                __v: false,
            })
            .lean()

        if (!post) {
            return null
        }

        if (userId) {
            const userLikeStatus = post.info.find(({userId}) => userId === userId)
            if (userLikeStatus) {
                post.extendedLikesInfo.myStatus = userLikeStatus.likeStatus
            }
        }

        const {info, ...postData} = post

        return postData
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
        const result = await Post.updateOne(
            {id},
            {title, shortDescription, content, bloggerId}
        )
        return result.matchedCount !== 0
    },

    async deletePost(id: string): Promise<boolean> {
        const result = await Post.deleteOne({id})

        return result.deletedCount !== 0
    },

    async likePost(postId: string, likeStatus: LikeStatusType, user: UserType): Promise<boolean> {
        const post = await Post.findOne({id: postId})

        if (!post) {
            return false
        }

        const currentUserLikeStatus = post.info.find(s => s.userId === user.id)

        if (!currentUserLikeStatus) {
            if (likeStatus === "Like") {
                post.extendedLikesInfo.likesCount++
            } else if (likeStatus === "Dislike") {
                post.extendedLikesInfo.dislikesCount++
            }

        } else {

            if (currentUserLikeStatus.likeStatus === "Like" && likeStatus !== "Like") {
                post.extendedLikesInfo.likesCount--
            } else if (currentUserLikeStatus.likeStatus !== "Like" && likeStatus === "Like") {
                post.extendedLikesInfo.likesCount++
            }

            if (currentUserLikeStatus.likeStatus === "Dislike" && likeStatus !== "Dislike") {
                post.extendedLikesInfo.dislikesCount--
            } else if (currentUserLikeStatus.likeStatus !== "Dislike" && likeStatus === "Dislike") {
                post.extendedLikesInfo.dislikesCount++
            }

            const currentIndex = post.info.indexOf(currentUserLikeStatus)
            post.info.splice(currentIndex, 1)
        }

        post.info.push({
            addedAt: new Date(),
            userId: user.id,
            login: user.login,
            likeStatus
        })

        const newestLikes = []

        let newestLikesCount = 0

        for (let i = post.info.length - 1; i >= 0; i--) {
            if (newestLikesCount === 3) {
                break
            }
            if (post.info[i].likeStatus === "Like") {
                const {likeStatus, ...rest} = post.info[i]
                newestLikes.push(rest)
                newestLikesCount++
            }
        }

        post.extendedLikesInfo.newestLikes = newestLikes

        await post.save()

        return true
    }
}