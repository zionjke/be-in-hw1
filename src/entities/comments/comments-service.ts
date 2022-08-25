import {commentsRepository} from "./comments-repository";
import {CommentsResponseType, CommentType} from "./types";
import {postsService} from "../posts/posts-service";
import {v4} from "uuid";
import {UserType} from "../users/types";
import { ApiError } from "../../exceptions/api-error";

export const commentsService = {
    async getCommentById(id: string): Promise<CommentType> {
        const comment = await commentsRepository.getCommentById(id)

        if (!comment) {
            throw ApiError.NotFoundError('Comment not found')
        }

        return comment
    },

    async deleteCommentById(commentId: string, userId: string) {

        const comment = await this.getCommentById(commentId)

        if (userId !== comment.userId) {
            throw ApiError.ForbiddenError()
        }

        const isDeleted = await commentsRepository.deleteCommentById(commentId)

        if (!isDeleted) {
            throw ApiError.NotFoundError('Comment not found')
        }
    },

    async updateComment(commentId: string, content: string, userId: string) {

        const comment = await this.getCommentById(commentId)

        if (userId !== comment.userId) {
            throw ApiError.ForbiddenError()
        }

        const isUpdated = await commentsRepository.updateComment(commentId, content)

        if (!isUpdated) {
            throw ApiError.NotFoundError('Comment not found')
        }
    },

    async createPostComment(content: string, postId: string, user: UserType): Promise<Omit<CommentType, "likesInfo" | "postId">> {

        const post = await postsService.getPostById(postId)

        const newComment: CommentType = {
            id: v4(),
            content,
            userId: user.id,
            userLogin: user.login,
            postId: post.id,
            addedAt: new Date(),
            likesInfo: {
                likesCount: 0,
                dislikesCount:0,
                myStatus: "None"
            }
        }

        return commentsRepository.createPostComment(newComment)
    },

    async getPostComments(postId: string, pageNumber?: number, _pageSize?: number,): Promise<CommentsResponseType> {

        const post = await postsService.getPostById(postId)

        return commentsRepository.getPostComments(post.id, pageNumber, _pageSize)
    },

    async likeComment(commentId:string, user:UserType) {
        const comment = await this.getCommentById(commentId)


    }
}