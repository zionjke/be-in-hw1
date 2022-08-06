import {commentsCollection} from "../../db";
import {pagination} from "../../utils/pagination";
import {CommentDBType, CommentsResponseType, CommentType} from "./types";

export const commentsRepository = {
    async getCommentById(id: string): Promise<CommentType | null> {
        const comment = await commentsCollection.findOne({id}, {projection: {_id: false, postId: false}})

        return comment
    },

    async deleteCommentById(commentId: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: commentId})

        return result.deletedCount !== 0
    },

    async updateComment(id: string, content: string): Promise<boolean> {
        const result = await commentsCollection.updateOne({id}, {$set: {content}})

        return result.matchedCount !== 0;
    },

    async createPostComment(newComment:CommentDBType): Promise<CommentType> {

        await commentsCollection.insertOne({...newComment})

        const {postId, ...commentData} = newComment

        return commentData
    },

    async getPostComments(postId: string, pageNumber?: number, _pageSize?: number): Promise<CommentsResponseType> {
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