import Joi from "joi";
export const createUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  userName: Joi.string().min(3).max(30).required(),
});
export const loginUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
