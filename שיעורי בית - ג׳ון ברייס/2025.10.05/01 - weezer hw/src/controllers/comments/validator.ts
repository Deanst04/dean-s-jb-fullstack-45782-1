import Joi from "joi";

export const newCommentValidator = Joi.object({
    body: Joi.string().min(20).required()
})

export const postIdValidator = Joi.object({
    postId: Joi.string().guid({ version: 'uuidv4'}).required()
})