import {BloggerType, PostType, ResponseType} from "../types";
import {bloggersCollection, postsCollection} from "../db";

export const bloggersRepository = {
    async getBloggers(SearchNameTerm: string | undefined | null, PageNumber: number | null | undefined, PageSize: number | null | undefined): Promise<ResponseType<BloggerType[]>> {

        const filter: any = {}

        if (SearchNameTerm) {
            filter.name = {$regex: SearchNameTerm}
        }

        const page = PageNumber || 1

        const pageSize = PageSize || 10

        const startFrom = (page - 1) * pageSize

        const totalCount = await bloggersCollection.find(filter).count()

        const pagesCount = Math.ceil(totalCount / pageSize)

        const bloggers = await bloggersCollection
            .find(filter, {projection: {_id:false}})
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

    async createNewBlogger(newBlogger: BloggerType): Promise<BloggerType> {

         await bloggersCollection.insertOne({...newBlogger})

        return newBlogger
    },

    async getBloggerById(id: number): Promise<BloggerType | null> {
        const blogger: BloggerType | null = await bloggersCollection.findOne({id},{projection: {_id: false}})
        return blogger
    },

    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne(
            {id},
            {$set: {name, youtubeUrl}}
        )

        return result.matchedCount !== 0;
    },

    async deleteBlogger(id: number): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id})

        return result.deletedCount !== 0;
    },

    async getAllBloggerPosts(bloggerId: number, PageNumber: number | undefined, PageSize: number | undefined): Promise<ResponseType<PostType[]>> {
        const page = PageNumber || 1

        const pageSize = PageSize || 10

        const startFrom = (page - 1) * pageSize

        const totalCount = await postsCollection.find({bloggerId}).count()

        const pagesCount = Math.ceil(totalCount / pageSize)

        const posts = await postsCollection
            .find({bloggerId})
            .project<PostType>({_id: false})
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