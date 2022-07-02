import {commentsCollection} from "../db";
import {CommentType} from "../types";

export const commentsRepository = {
    async getCommentById(id: string): Promise<CommentType | null> {
        const comment = await commentsCollection.findOne({id}, {projection: {_id: false, postId: false}})

        return comment
    },

    async deleteCommentById(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id})

        return result.deletedCount !== 0
    },

    async updateComment(id: string, content: string): Promise<boolean> {
        const result = await commentsCollection.updateOne({id}, {$set: {content}})

        return result.matchedCount !== 0;
    }
}