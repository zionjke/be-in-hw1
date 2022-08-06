import {v4} from "uuid";
import {ApiError} from "../../exceptions/api-error";
import {bloggersRepository} from "./bloggers-repository";
import {BloggersResponseType, BloggerType} from './types';

export const bloggersService = {
    async getBloggers(searchNameTerm?: string, pageNumber?: number, _pageSize?: number): Promise<BloggersResponseType> {
        return bloggersRepository.getBloggers(searchNameTerm, pageNumber, _pageSize)
    },

    async createNewBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {

        const newBlogger: BloggerType = {
            id: v4(),
            name,
            youtubeUrl
        }

        return bloggersRepository.createNewBlogger(newBlogger)
    },

    async getBloggerById(id: string): Promise<BloggerType> {

        const blogger = await bloggersRepository.getBloggerById(id)

        if (!blogger) {
            throw ApiError.NotFoundError('Blogger not found')
        }

        return blogger
    },

    async updateBlogger(id: string, name: string, youtubeUrl: string) {
        const isUpdated = await bloggersRepository.updateBlogger(id, name, youtubeUrl)

        if (!isUpdated) {
            throw ApiError.NotFoundError('Blogger Not found')
        }
    },

    async deleteBlogger(id: string) {
        const isDeleted = await bloggersRepository.deleteBlogger(id)

        if (!isDeleted) {
            throw ApiError.NotFoundError('Blogger Not found')
        }
    },
}