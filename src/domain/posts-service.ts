import {BloggerType, PostType, ResponseType} from "../types";
import {postsRepository} from "../repositories/posts-repository";
import {bloggersRepository} from "../repositories/bloggers-repository";


export const postsService = {
    async getAllPosts(pageNumber: number | undefined, pageSize: number | undefined): Promise<ResponseType<PostType[]>> {
        return await postsRepository.getAllPosts(pageNumber, pageSize)
    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: number): Promise<PostType | undefined> {
        const blogger = await bloggersRepository.getBloggerById(bloggerId)

        if (blogger) {
            const newPost: PostType = {
                id: +(new Date()),
                title,
                shortDescription,
                content,
                bloggerId: blogger.id,
                bloggerName: blogger.name
            }
            return await postsRepository.createPost(newPost)
        }
    },
    async getPostById(id: number): Promise<PostType | null> {
        return await postsRepository.getPostById(id)
    },
    async updatePost(id: number, title: string, shortDescription: string, content: string, blogger:BloggerType): Promise<boolean> {


        return await postsRepository.updatePost(id, title, shortDescription, content, blogger)
    },
    async deletePost(id: number): Promise<boolean> {
        return await postsRepository.deletePost(id)
    }
}