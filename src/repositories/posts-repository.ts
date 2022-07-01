import {ResponseType, PostType, BloggerType, CommentType} from "../types";
import {commentsCollection, postsCollection} from "../db";
import {pagination} from "../utils/pagination";

export const postsRepository = {
    async getAllPosts(pageNumber: number | undefined, _pageSize: number | undefined): Promise<ResponseType<PostType[]>> {
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
    async createPost(newPost: PostType): Promise<PostType> {
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
            {$set: {title, shortDescription, content, bloggerId: blogger.id, bloggerName: blogger.name}}
        )
        return result.matchedCount !== 0
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount !== 0
    },

    async createPostComment(newComment: CommentType): Promise<CommentType> {
        await commentsCollection.insertOne({...newComment})

        return newComment
    },

    async getAllCommentsPost(pageNumber: number | undefined, _pageSize: number | undefined):Promise<ResponseType<CommentType[]>> {
        const totalCount = await commentsCollection.count()

        const {page, pageSize, startFrom, pagesCount} = pagination(pageNumber, _pageSize, totalCount)

        const comments = await commentsCollection
            .find({}, {projection: {_id: false}})
            .skip(startFrom)
            .limit(pageSize)
            .toArray()

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: comments
        }
    }
}