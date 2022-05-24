import {BloggersResponseType, BloggerType} from "../constants";
import {bloggersCollection} from "../db";

export const bloggersRepository = {
    async getBloggers(name: string | undefined | null): Promise<BloggerType[]> {
        const filter: any = {}

        if (name) {
            filter.name = {$regex:name}
        }

        const data = await bloggersCollection.find(filter).toArray()
        return data
    },

    async createNewBlogger(newBlogger: BloggerType): Promise<BloggerType> {

        await bloggersCollection.insertOne(newBlogger)

        return newBlogger
    },

    async getBloggerById(id: number): Promise<BloggerType | null> {
        const blogger: BloggerType | null = await bloggersCollection.findOne({id})
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
    }
}