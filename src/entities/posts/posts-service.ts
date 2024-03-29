import {postsRepository} from "./posts-repository";
import {PostsResponseType, PostType} from "./types";
import {bloggersService} from "../bloggers/bloggers-service";
import {v4} from "uuid";
import {ApiError} from "../../exceptions/api-error";
import {LikeStatusType} from "../comments/types";
import {UserType} from "../users/types";

export const postsService = {
    async getPosts(pageNumber?: number, _pageSize?: number, userId?: string): Promise<PostsResponseType> {
        return postsRepository.getPosts(pageNumber, _pageSize, userId)
    },

    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<Omit<PostType, "info">> {

        const blogger = await bloggersService.getBloggerById(bloggerId)

        const newPost: PostType = {
            id: v4(),
            title,
            shortDescription,
            content,
            bloggerId: blogger.id,
            bloggerName: blogger.name,
            addedAt: new Date(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: []
            },
            info: []
        }

        return postsRepository.createPost(newPost)
    },

    async getPostById(id: string, userId?: string): Promise<Omit<PostType, "info">> {
        const post = await postsRepository.getPostById(id, userId)

        if (!post) {
            throw ApiError.NotFoundError('Post not found')
        }

        return post
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string) {

        const blogger = await bloggersService.getBloggerById(bloggerId)

        if (!blogger) {
            throw ApiError.NotFoundError('Blogger not found')
        }

        const isUpdated = await postsRepository.updatePost(id, title, shortDescription, content, bloggerId)

        if (!isUpdated) {
            throw ApiError.NotFoundError('Post not found')
        }
    },

    async deletePost(id: string) {
        const isDeleted = await postsRepository.deletePost(id)

        if (!isDeleted) {
            throw ApiError.NotFoundError('Post not found')
        }
    },

    async getBloggerPosts(bloggerId: string, pageNumber?: number, _pageSize?: number, userId?:string): Promise<PostsResponseType> {

        const blogger = await bloggersService.getBloggerById(bloggerId)

        const data = await postsRepository.getBloggerPosts(blogger.id, pageNumber, _pageSize, userId)

        return data
    },

    async createNewBloggerPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<Omit<PostType, "info">> {

        const post = await this.createPost(title, shortDescription, content, bloggerId)

        return post
    },

    async likePost(postId: string, likeStatus: LikeStatusType, user: UserType) {
        const isLiked = await postsRepository.likePost(postId, likeStatus, user)

        if (!isLiked) {
            throw ApiError.NotFoundError('Post not found')
        }
    }
}