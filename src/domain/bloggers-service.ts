import {BloggersResponseType, BloggerType} from "../constants";
import {bloggersRepository} from "../repositories/bloggers-repository";

export const bloggersService = {
    async getBloggers(name: string | undefined | null): Promise<BloggerType[]> {
        return bloggersRepository.getBloggers(name)
    },

    async createNewBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {

        const newBlogger: BloggerType = {
            id: +(new Date()),
            name,
            youtubeUrl
        }

        const createdBlogger = bloggersRepository.createNewBlogger(newBlogger)
        return createdBlogger
    },

    async getBloggerById(id: number): Promise<BloggerType | null> {
        return await bloggersRepository.getBloggerById(id)
    },

    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(id, name, youtubeUrl)
    },

    async deleteBlogger(id: number): Promise<boolean> {
        return await bloggersRepository.deleteBlogger(id)
    }
}