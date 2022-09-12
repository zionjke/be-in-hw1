import {CommentsResponseType, CommentType, LikeStatusType} from "./types";
import {v4} from "uuid";
import {UserType} from "../users/types";
import {ApiError} from "../../exceptions/api-error";
import {CommentsRepository} from "./comments-repository";
import {PostsService} from "../posts/posts-service";

export class CommentsService {
    commentsRepository: CommentsRepository
    postsService: PostsService

    constructor() {
        this.commentsRepository = new CommentsRepository()
        this.postsService = new PostsService()
    }

    async getCommentById(id: string, userId?: string): Promise<Omit<CommentType, "info">> {
        const comment = await this.commentsRepository.getCommentById(id, userId)

        if (!comment) {
            throw ApiError.NotFoundError('Comment not found')
        }

        return comment
    }

    async deleteCommentById(commentId: string, userId: string) {

        const comment = await this.getCommentById(commentId)

        if (userId !== comment.userId) {
            throw ApiError.ForbiddenError()
        }

        const isDeleted = await this.commentsRepository.deleteCommentById(commentId)

        if (!isDeleted) {
            throw ApiError.NotFoundError('Comment not found')
        }
    }

    async updateComment(commentId: string, content: string, userId: string) {

        const comment = await this.getCommentById(commentId)

        if (userId !== comment.userId) {
            throw ApiError.ForbiddenError()
        }

        const isUpdated = await this.commentsRepository.updateComment(commentId, content)

        if (!isUpdated) {
            throw ApiError.NotFoundError('Comment not found')
        }
    }

    async createPostComment(content: string, postId: string, user: UserType): Promise<Omit<CommentType, "postId" | "info">> {

        const post = await this.postsService.getPostById(postId)

        const newComment: CommentType = {
            id: v4(),
            content,
            userId: user.id,
            userLogin: user.login,
            postId: post.id,
            addedAt: new Date(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None"
            },
            info: []
        }

        return this.commentsRepository.createPostComment(newComment)
    }

    async getPostComments(postId: string, pageNumber?: number, _pageSize?: number, userId?: string):Promise<CommentsResponseType> {

        const post = await this.postsService.getPostById(postId)

        const data = await this.commentsRepository.getPostComments(post.id, pageNumber, _pageSize, userId)

        return data
    }

    async likeComment(commentId: string, likeStatus: LikeStatusType, user: UserType) {
        const isLiked = await this.commentsRepository.likeComment(commentId, likeStatus, user)

        if (!isLiked) {
            throw ApiError.NotFoundError('Comment not found')
        }
    }
}
