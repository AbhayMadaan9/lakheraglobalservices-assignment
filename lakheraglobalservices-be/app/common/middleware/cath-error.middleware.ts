import { type Response, type Request, type NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import Joi from "joi";

// Accept a Joi schema and validate req.body against it
export const catchError = (schema: Joi.ObjectSchema) =>
  expressAsyncHandler((req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const data = { errors: error.details };
      throw createHttpError(400, {
        message: "Validation error!",
        data,
      });
    } else {
      next();
    }
  });
