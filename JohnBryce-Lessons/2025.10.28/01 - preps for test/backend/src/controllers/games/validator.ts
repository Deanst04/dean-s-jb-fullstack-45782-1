import Joi from "joi";

export const newGameValidator = Joi.object({
    audienceId: Joi.string().uuid().required(),
    name: Joi.string().min(10).max(40).uppercase().required(),
    description: Joi.string().min(20).required(),
    price: Joi.number().required(),
})

// export const updatePostValidator = newPostValidator

export const gamesByAudienceIdValidator = Joi.object({
    audienceId: Joi.string().uuid().required()
})