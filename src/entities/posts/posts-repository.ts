import {pagination} from "../../utils/pagination";
import {PostsResponseType, PostType} from "./types";
import {Post} from "./model";

export const postsRepository = {
    async getPosts(pageNumber?: number, _pageSize?: number): Promise<PostsResponseType> {
        const totalCount = await Post.countDocuments()

        const {page, pageSize, startFrom, pagesCount} = pagination(pageNumber, _pageSize, totalCount)

        const posts = await Post
            .find({}, {_id: false, __v: false})
            .skip(startFrom)
            .limit(pageSize)
            .lean()

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: posts
        }
    },

    async getBloggerPosts(bloggerId: string, pageNumber?: number , _pageSize?: number ): Promise<PostsResponseType> {
        const totalCount = await Post.countDocuments({bloggerId})

        const {page, pageSize, startFrom, pagesCount} = pagination(pageNumber, _pageSize, totalCount)

        const posts = await Post
            .find({bloggerId}, { _id: false, __v: false})
            .skip(startFrom)
            .limit(pageSize)
            .lean()

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: posts
        }
    },

    async createPost(newPost: PostType): Promise<PostType> {

        const post = new Post(newPost)

        await post.save()

        return newPost
    },

    async getPostById(id: string): Promise<PostType | null> {
        const post: PostType | null = await Post.findOne({id}, {_id: false, __v: false})

        return post
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
        const result = await Post.updateOne(
            {id},
            {$set: {title, shortDescription, content, bloggerId}}
        )
        return result.matchedCount !== 0
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await Post.deleteOne({id})

        return result.deletedCount !== 0
    },
}