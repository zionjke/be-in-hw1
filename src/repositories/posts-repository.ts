import {ResponseType, PostType, BloggerType, CommentType, UserType} from "../types";
import {commentsCollection, postsCollection} from "../db";
import {pagination} from "../utils/pagination";
import {v4} from "uuid";

export const postsRepository = {
    async getPosts(pageNumber: number | undefined, _pageSize: number | undefined): Promise<ResponseType<PostType[]>> {
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
    async createPost(title: string, shortDescription: string, content: string, blogger: BloggerType): Promise<PostType> {
        const newPost: PostType = {
            id: v4(),
            title,
            shortDescription,
            content,
            bloggerId: blogger.id,
            bloggerName: blogger.name
        }

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

    async createPostComment(content: string, postId: string, user: UserType): Promise<CommentType> {

        const newComment = {
            id: v4(),
            content,
            userId: user.id,
            userLogin: user.login,
            addedAt: new Date().toISOString()
        }

        await commentsCollection.insertOne({...newComment, postId})

        return newComment
    },

    async getPostComments(pageNumber: number | undefined, _pageSize: number | undefined, postId: string): Promise<ResponseType<CommentType[]>> {
        const totalCount = await commentsCollection.find({postId}).count()

        const {page, pageSize, startFrom, pagesCount} = pagination(pageNumber, _pageSize, totalCount)

        const comments = await commentsCollection
            .find({postId}, {projection: {_id: false, postId: false}})
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