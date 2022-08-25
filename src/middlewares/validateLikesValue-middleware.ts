import {body} from "express-validator";

export const validateLikesValueMiddleware = body('likeStatus', 'Invalid value').isString().isIn(["None", "Like", "Dislike"])