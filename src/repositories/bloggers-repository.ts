import {BloggerType, PostType, ResponseType} from "../types";
import {bloggersCollection, postsCollection} from "../db";
import {pagination} from "../utils/pagination";
import {v4} from "uuid";

export const bloggersRepository = {
    async getBloggers(searchNameTerm: string | undefined, pageNumber: number | undefined, _pageSize: number | undefined): Promise<ResponseType<BloggerType[]>> {

        const filter: any = {}

        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm}
        }

        const totalCount = await bloggersCollection.find(filter).count()

        const {page, pageSize, startFrom, pagesCount} = pagination(pageNumber, _pageSize, totalCount)

        const bloggers = await bloggersCollection
            .find(filter, {projection: {_id: false}})
            .skip(startFrom)
            .limit(pageSize)
            .toArray()

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: bloggers
        }
    },

    async createNewBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {

        const newBlogger: BloggerType = {
            id: v4(),
            name,
            youtubeUrl
        }

        await bloggersCollection.insertOne({...newBlogger})

        return newBlogger
    },

    async getBloggerById(id: string): Promise<BloggerType | null> {
        const blogger: BloggerType | null = await bloggersCollection.findOne({id}, {projection: {_id: false}})

        return blogger
    },

    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne(
            {id},
            {$set: {name, youtubeUrl}}
        )

        return result.matchedCount !== 0;
    },

    async deleteBlogger(id: string): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id})

        return result.deletedCount !== 0;
    },

    async getBloggerPosts(bloggerId: string, pageNumber: number | undefined, _pageSize: number | undefined): Promise<ResponseType<PostType[]>> {
        const totalCount = await postsCollection.find({bloggerId}).count()

        const {page, pageSize, startFrom, pagesCount} = pagination(pageNumber, _pageSize, totalCount)

        const posts = await postsCollection
            .find({bloggerId}, {projection: {_id: false}})
            .skip(startFrom)
            .limit(pageSize)
            .toArray()

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: posts
        }
    },
}