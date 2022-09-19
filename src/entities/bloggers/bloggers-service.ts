import {v4} from "uuid";
import {ApiError} from "../../exceptions/api-error";
import {BloggersResponseType, BloggerType} from './types';
import {BloggersRepository} from "./bloggers-repository";
import {injectable} from "inversify";

@injectable()
export class BloggersService  {
    constructor(protected bloggersRepository: BloggersRepository) {
    }

    async getBloggers(searchNameTerm?: string, pageNumber?: number, _pageSize?: number): Promise<BloggersResponseType> {
        return this.bloggersRepository.getBloggers(searchNameTerm, pageNumber, _pageSize)
    }

    async createNewBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {

        const newBlogger = new BloggerType(v4(), name, youtubeUrl)

        return this.bloggersRepository.createNewBlogger(newBlogger)
    }

    async getBloggerById(id: string): Promise<BloggerType> {

        const blogger = await this.bloggersRepository.getBloggerById(id)

        if (!blogger) {
            throw ApiError.NotFoundError('Blogger not found')
        }

        return blogger
    }

    async updateBlogger(id: string, name: string, youtubeUrl: string) {
        const isUpdated = await this.bloggersRepository.updateBlogger(id, name, youtubeUrl)

        if (!isUpdated) {
            throw ApiError.NotFoundError('Blogger Not found')
        }
    }

    async deleteBlogger(id: string) {
        const isDeleted = await this.bloggersRepository.deleteBlogger(id)

        if (!isDeleted) {
            throw ApiError.NotFoundError('Blogger Not found')
        }
    }
}

