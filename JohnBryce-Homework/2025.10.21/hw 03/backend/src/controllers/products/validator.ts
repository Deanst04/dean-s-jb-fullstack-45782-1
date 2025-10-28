import Joi from "joi";

export const newProductValidator = Joi.object({
    categoryId: Joi.string().uuid().required(),
    name: Joi.string().max(40).required(),
    manufactureDate: Joi.date().required(),
    expirationDate: Joi.date().required(),
    price: Joi.number().min(3).required(),
})

// export const updatePostValidator = newPostValidator

export const productsByCategoryId = Joi.object({
    categoryId: Joi.string().uuid().required()
})

export const productById = Joi.object({
    productId: Joi.string().uuid().required()
})