import {CommentType} from "../types";
import {commentsRepository} from "../repositories/comments-repository";

export const commentsService = {
    async getCommentById(id:string):Promise<CommentType | null> {
        return await commentsRepository.getCommentById(id)
    },

    async deleteCommentById(id:string):Promise<boolean> {
        return await commentsRepository.deleteCommentById(id)
    },

    async updateComment(id:string, content:string):Promise<boolean> {
        return await commentsRepository.updateComment(id, content)
    }
}