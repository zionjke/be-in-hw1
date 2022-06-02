import {BloggerType, PostType, ResponseType} from "../types";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {postsRepository} from "../repositories/posts-repository";

export const bloggersService = {
    async getBloggers(SearchNameTerm: string | undefined | null, PageNumber: number | undefined , PageSize: number | undefined ): Promise<ResponseType<BloggerType[]>> {
        return bloggersRepository.getBloggers(SearchNameTerm, PageNumber, PageSize)
    },

    async createNewBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {

        const newBlogger: BloggerType = {
            id: +(new Date()),
            name,
            youtubeUrl
        }

        return await bloggersRepository.createNewBlogger(newBlogger)
    },

    async getBloggerById(id: number): Promise<BloggerType | null> {
        return await bloggersRepository.getBloggerById(id)
    },

    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(id, name, youtubeUrl)
    },

    async deleteBlogger(id: number): Promise<boolean> {
        return await bloggersRepository.deleteBlogger(id)
    },

    async getAllBloggerPosts(bloggerId: number, pageNumber: number | undefined, pageSize: number | undefined): Promise<ResponseType<PostType[]>> {
        return await bloggersRepository.getAllBloggerPosts(bloggerId, pageNumber, pageSize)
    },

    async createNewBloggerPost(title: string, shortDescription: string, content: string, blogger: BloggerType) {

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
}