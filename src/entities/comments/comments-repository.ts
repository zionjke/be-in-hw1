import {pagination} from "../../utils/pagination";
import {CommentsResponseType, CommentType, LikeStatusType} from "./types";
import {Comment} from "./model";
import {UserType} from "../users/types";

export const commentsRepository = {
    async getCommentById(id: string, userId?: string): Promise<CommentType | null> {

        const comment: CommentType | null = await Comment.findOne(
            {id},
            {
                _id: false,
                postId: false,
                __v: false,
                info: false
            })

        if (!comment) {
            return null
        }

        if (userId) {
            const userLikeStatus = comment.info.find(({userId}) => userId === userId)
            if (userLikeStatus) {
                comment.likesInfo.myStatus = userLikeStatus.likeStatus
            }
        }

        return comment
    },

    async deleteCommentById(commentId: string): Promise<boolean> {
        const result = await Comment.deleteOne({id: commentId})

        return result.deletedCount !== 0
    },

    async updateComment(id: string, content: string): Promise<boolean> {
        const result = await Comment.updateOne({id}, {content})

        return result.matchedCount !== 0;
    },

    async createPostComment(newComment: CommentType): Promise<Omit<CommentType, "postId" | "info">> {

        const comment = new Comment(newComment)

        await comment.save()

        const {postId, info, ...commentData} = newComment

        return commentData
    },

    async getPostComments(postId: string, pageNumber?: number, _pageSize?: number, userId?: string): Promise<CommentsResponseType> {
        const totalCount = await Comment.countDocuments({postId})

        const {page, pageSize, startFrom, pagesCount} = pagination(pageNumber, _pageSize, totalCount)

        const comments = await Comment
            .find({postId}, {_id: false, postId: false, __v: false, info: false})
            .skip(startFrom)
            .limit(pageSize)
            .lean()

        comments.forEach((p: CommentType) => {
            if (userId) {
                const userLikeStatus = p.info.find(({userId}) => userId === userId)
                if (userLikeStatus) {
                    p.likesInfo.myStatus = userLikeStatus.likeStatus
                }
            }
        })

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: comments
        }
    },

    async likeComment(commentId: string, likeStatus: LikeStatusType, user: UserType): Promise<boolean> {
        const comment = await Comment.findOne({id: commentId})

        if (!comment) {
            return false
        }

        const currentUserLikeStatus = comment.info.find(({userId}) => userId === user.id)

        if (!currentUserLikeStatus) {
            if (likeStatus === "Like") {
                comment.likesInfo.likesCount++
            } else if (likeStatus === "Dislike") {
                comment.likesInfo.dislikesCount++
            }
        } else {
            if (currentUserLikeStatus.likeStatus === "Like" && likeStatus !== "Like") {
                comment.likesInfo.likesCount--
            } else if (currentUserLikeStatus.likeStatus !== "Like" && likeStatus === "Like") {
                comment.likesInfo.likesCount++
            }

            if (currentUserLikeStatus.likeStatus === "Dislike" && likeStatus !== "Dislike") {
                comment.likesInfo.dislikesCount--
            } else if (currentUserLikeStatus.likeStatus !== "Dislike" && likeStatus === "Dislike") {
                comment.likesInfo.dislikesCount++
            }

            const currentIndex = comment.info.indexOf(currentUserLikeStatus)

            comment.info.splice(currentIndex, 1)
        }

        comment.info.push({
            addedAt: new Date(),
            userId: user.id,
            login: user.login,
            likeStatus
        })

        await comment.save()

        return true
    }
}