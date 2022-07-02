import {BloggerType, CommentType, PostType, ResponseType, UserType} from "../types";
import {postsRepository} from "../repositories/posts-repository";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {v4} from "uuid";
import {usersService} from "./users-service";


export const postsService = {
    async getPosts(pageNumber: number | undefined, _pageSize: number | undefined): Promise<ResponseType<PostType[]>> {
        return await postsRepository.getPosts(pageNumber, _pageSize)
    },
    async createPost(title: string, shortDescription: string, content: string, blogger: BloggerType): Promise<PostType> {
        return await postsRepository.createPost(title, shortDescription, content, blogger)
    },
    async getPostById(id: string): Promise<PostType | null> {
        return await postsRepository.getPostById(id)
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogger: BloggerType): Promise<boolean> {
        return await postsRepository.updatePost(id, title, shortDescription, content, blogger)
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    },

    async createPostComment(content: string, postId:string, user: UserType ): Promise<CommentType> {
        return await postsRepository.createPostComment(content, postId, user )
    },

    async getPostComments(pageNumber: number | undefined, _pageSize: number | undefined, postId:string): Promise<ResponseType<CommentType[]>> {
        return await postsRepository.getPostComments(pageNumber, _pageSize, postId)
    }
}