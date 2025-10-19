import Joi from "joi";
import { idValidator } from "../profile/validator";

export const followeeIdValidator = Joi.object({
    followeeId: Joi.string().guid({ version: 'uuidv4'}).required()
})