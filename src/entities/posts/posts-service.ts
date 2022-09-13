import {PostsRepository} from "./posts-repository";
import {PostsResponseType, PostType} from "./types";
import {v4} from "uuid";
import {ApiError} from "../../exceptions/api-error";
import {LikeStatusType} from "../comments/types";
import {UserType} from "../users/types";
import {BloggersService} from "../bloggers/bloggers-service";

export class PostsService {
    constructor(protected postsRepository: PostsRepository, protected bloggersService: BloggersService) {
    }

    async getPosts(pageNumber?: number, _pageSize?: number, userId?: string): Promise<PostsResponseType> {
        return this.postsRepository.getPosts(pageNumber, _pageSize, userId)
    }

    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<Omit<PostType, "info">> {

        const blogger = await this.bloggersService.getBloggerById(bloggerId)

        const newPost = new PostType(
            v4(),
            title,
            shortDescription,
            content,
            blogger.id,
            blogger.name,
            new Date(),
            {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: []
            },
            []
        )

        return this.postsRepository.createPost(newPost)
    }

    async getPostById(id: string, userId?: string): Promise<Omit<PostType, "info">> {
        const post = await this.postsRepository.getPostById(id, userId)

        if (!post) {
            throw ApiError.NotFoundError('Post not found')
        }

        return post
    }

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string) {

        const blogger = await this.bloggersService.getBloggerById(bloggerId)

        if (!blogger) {
            throw ApiError.NotFoundError('Blogger not found')
        }

        const isUpdated = await this.postsRepository.updatePost(id, title, shortDescription, content, bloggerId)

        if (!isUpdated) {
            throw ApiError.NotFoundError('Post not found')
        }
    }

    async deletePost(id: string) {
        const isDeleted = await this.postsRepository.deletePost(id)

        if (!isDeleted) {
            throw ApiError.NotFoundError('Post not found')
        }
    }

    async getBloggerPosts(bloggerId: string, pageNumber?: number, _pageSize?: number, userId?: string): Promise<PostsResponseType> {

        const blogger = await this.bloggersService.getBloggerById(bloggerId)

        const data = await this.postsRepository.getBloggerPosts(blogger.id, pageNumber, _pageSize, userId)

        return data
    }

    async createNewBloggerPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<Omit<PostType, "info">> {

        const post = await this.createPost(title, shortDescription, content, bloggerId)

        return post
    }

    async likePost(postId: string, likeStatus: LikeStatusType, user: UserType) {
        const isLiked = await this.postsRepository.likePost(postId, likeStatus, user)

        if (!isLiked) {
            throw ApiError.NotFoundError('Post not found')
        }
    }
}
