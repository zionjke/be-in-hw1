import {BloggerType, CommentType, PostType, ResponseType, UserType} from "../types";
import {postsRepository} from "../repositories/posts-repository";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {v4} from "uuid";
import {usersService} from "./users-service";


export const postsService = {
    async getAllPosts(pageNumber: number | undefined, _pageSize: number | undefined): Promise<ResponseType<PostType[]>> {
        return await postsRepository.getAllPosts(pageNumber, _pageSize)
    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostType | undefined> {
        const blogger = await bloggersRepository.getBloggerById(bloggerId)

        if (blogger) {
            const newPost: PostType = {
                id: v4(),
                title,
                shortDescription,
                content,
                bloggerId: blogger.id,
                bloggerName: blogger.name
            }
            return await postsRepository.createPost(newPost)
        }
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

    async createPostComment(content: string, user: UserType | null): Promise<CommentType | undefined> {

        if (!user) {
            return undefined;
        }

        const newComment = {
            id: v4(),
            content,
            userId: user.id,
            userLogin: user.login,
            addedAt: new Date().toISOString()
        }

        return await postsRepository.createPostComment(newComment)

    },

    async getAllCommentsPost(pageNumber: number | undefined, _pageSize: number | undefined):Promise<ResponseType<CommentType[]>> {
        return await postsRepository.getAllCommentsPost(pageNumber, _pageSize)
    }
}