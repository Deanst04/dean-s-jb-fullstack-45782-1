import Joi from "joi";

// export const newPostValidator = Joi.object({
//     name: Joi.string().min(10).max(40).uppercase().required(),
//     description: Joi.string().min(20).required()
// })

// export const updatePostValidator = newPostValidator

export const gamesByAudienceIdValidator = Joi.object({
    audienceId: Joi.string().uuid().required()
})