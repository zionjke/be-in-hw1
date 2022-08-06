import {ResponseType} from "../../types";
import {commentsCollection, postsCollection} from "../../db";
import {pagination} from "../../utils/pagination";
import {v4} from "uuid";
import {PostsResponseType, PostType} from "./types";
import {BloggerType} from "../bloggers/types";

export const postsRepository = {
    async getPosts(pageNumber?: number, _pageSize?: number): Promise<PostsResponseType> {
        const totalCount = await postsCollection.count()

        const {page, pageSize, startFrom, pagesCount} = pagination(pageNumber, _pageSize, totalCount)

        const posts = await postsCollection
            .find({}, {projection: {_id: false}})
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

    async createPost(newPost:PostType): Promise<PostType> {

        await postsCollection.insertOne({...newPost})

        return newPost
    },
    async getPostById(id: string): Promise<PostType | null> {
        const post: PostType | null = await postsCollection.findOne({id}, {projection: {_id: false}})

        return post
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogger: BloggerType): Promise<boolean> {
        const result = await postsCollection.updateOne(
            {id},
            {$set: {title, shortDescription, content, bloggerId: blogger.id}}
        )
        return result.matchedCount !== 0
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id})

        return result.deletedCount !== 0
    },
}