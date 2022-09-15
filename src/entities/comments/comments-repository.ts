import {usePagination} from "../../utils/usePagination";
import {CommentsResponseType, CommentType, LikeStatusType} from "./types";
import {Comment} from "./model";
import {UserType} from "../users/types";

export class CommentsRepository  {
    async getCommentById(id: string, userId?: string): Promise<Omit<CommentType, "info"> | null> {

        const comment: CommentType | null = await Comment.findOne(
            {id},
            {
                _id: false,
                postId: false,
            })
            .lean()

        if (!comment) {
            return null
        }

        if (userId) {
            const userLikeStatus = comment.info.find(el => el.userId === userId)
            if (userLikeStatus) {
                comment.likesInfo.myStatus = userLikeStatus.likeStatus || 'None'
            }
        }

        const {info, ...commentData} = comment

        return commentData
    }

    async deleteCommentById(commentId: string): Promise<boolean> {
        const result = await Comment.deleteOne({id: commentId})

        return result.deletedCount !== 0
    }

    async updateComment(id: string, content: string): Promise<boolean> {
        const result = await Comment.updateOne({id}, {content})

        return result.matchedCount !== 0;
    }

    async createPostComment(newComment: CommentType): Promise<Omit<CommentType, "postId" | "info">> {

        const comment = new Comment(newComment)

        await comment.save()

        const {postId, info, ...commentData} = newComment

        return commentData
    }

    async getPostComments (postId: string, pageNumber?: number, _pageSize?: number, userId?: string): Promise<CommentsResponseType> {
        const totalCount = await Comment.countDocuments({postId})

        const {page, pageSize, startFrom, pagesCount} = usePagination(pageNumber, _pageSize, totalCount)

        const comments = await Comment
            .find({postId}, {_id: false, postId: false})
            .skip(startFrom)
            .limit(pageSize)
            .lean()

        if (userId) {
            comments.forEach(item => {
                const userLikeStatus = item.info.find(el => el.userId === userId)
                if (userLikeStatus) {
                    item.likesInfo.myStatus = userLikeStatus.likeStatus
                }
            })
        }

        const items = comments.map(({info, ...rest}) => {
            return rest
        })

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
    }

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
