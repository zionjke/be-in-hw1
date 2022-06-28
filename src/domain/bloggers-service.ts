import {v4} from 'uuid'
import {BloggerType, PostType, ResponseType} from "../types";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {postsRepository} from "../repositories/posts-repository";

export const bloggersService = {
    async getBloggers(searchNameTerm: string | undefined , pageNumber: number | undefined , _pageSize: number | undefined ): Promise<ResponseType<BloggerType[]>> {
        return bloggersRepository.getBloggers(searchNameTerm, pageNumber, _pageSize)
    },

    async createNewBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {

        const newBlogger: BloggerType = {
            id: v4(),
            name,
            youtubeUrl
        }

        return await bloggersRepository.createNewBlogger(newBlogger)
    },

    async getBloggerById(id: string): Promise<BloggerType | null> {
        return await bloggersRepository.getBloggerById(id)
    },

    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(id, name, youtubeUrl)
    },

    async deleteBlogger(id: string): Promise<boolean> {
        return await bloggersRepository.deleteBlogger(id)
    },

    async getAllBloggerPosts(bloggerId: string, pageNumber: number | undefined, _pageSize: number | undefined): Promise<ResponseType<PostType[]>> {
        return await bloggersRepository.getAllBloggerPosts(bloggerId, pageNumber, _pageSize)
    },

    async createNewBloggerPost(title: string, shortDescription: string, content: string, blogger: BloggerType) {

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
}