import {pagination} from "../../utils/pagination";
import {CommentDBType, CommentsResponseType, CommentType} from "./types";
import {Comment} from "./model";

export const commentsRepository = {
    async getCommentById(id: string): Promise<CommentType | null> {
        const comment:CommentType | null = await Comment.findOne(
            {id},
            {
                _id: false,
                postId: false,
                __v: false,
                likesInfo: false
            })

        return comment
    },

    async deleteCommentById(commentId: string): Promise<boolean> {
        const result = await Comment.deleteOne({id: commentId})

        return result.deletedCount !== 0
    },

    async updateComment(id: string, content: string): Promise<boolean> {
        const result = await Comment.updateOne({id}, {$set: {content}})

        return result.matchedCount !== 0;
    },

    async createPostComment(newComment: CommentDBType): Promise<Omit<CommentType, "likesInfo">> {

        const comment = new Comment(newComment)

        await comment.save()

        const {postId, ...commentData} = newComment

        return commentData
    },

    async getPostComments(postId: string, pageNumber?: number, _pageSize?: number): Promise<CommentsResponseType> {
        const totalCount = await Comment.countDocuments({postId})

        const {page, pageSize, startFrom, pagesCount} = pagination(pageNumber, _pageSize, totalCount)

        const comments = await Comment
            .find({postId}, {_id: false, postId: false, __v: false, likesInfo: false})
            .skip(startFrom)
            .limit(pageSize)
            .lean()

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: comments
        }
    }
}