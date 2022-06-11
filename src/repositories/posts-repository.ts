import {ResponseType, PostType, BloggerType} from "../types";
import {postsCollection} from "../db";

export const postsRepository = {
    async getAllPosts(pageNumber: number | undefined, pageSize: number | undefined): Promise<ResponseType<PostType[]>> {

        const page = pageNumber || 1

        pageSize = pageSize || 10

        const totalCount = await postsCollection.count()

        const pagesCount = Math.ceil(totalCount / pageSize)

        const startFrom = (page - 1) * pageSize

        const posts = await postsCollection
            .find({}, {projection: {_id:false}})
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
    async createPost(newPost: PostType): Promise<PostType> {
        await postsCollection.insertOne({...newPost})
        return newPost
    },
    async getPostById(id: number): Promise<PostType | null> {
        const post: PostType | null = await postsCollection.findOne({id}, {projection: {_id: false}})
        return post
    },
    async updatePost(id: number, title: string, shortDescription: string, content: string, blogger:BloggerType): Promise<boolean> {
        const result = await postsCollection.updateOne(
            {id},
            {$set: {title, shortDescription, content, bloggerId: blogger.id, bloggerName: blogger.name}}
        )
        return result.matchedCount !== 0
    },
    async deletePost(id: number): Promise<boolean> {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount !== 0
    }
}