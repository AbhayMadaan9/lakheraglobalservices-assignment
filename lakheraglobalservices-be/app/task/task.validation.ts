
import Joi from "joi"

export const createTask = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().min(6).required()
});
export const updateTask = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().min(6).required()
});
export const editTask = Joi.object({
    title: Joi.string().min(2),
    description: Joi.string().min(6)
});
