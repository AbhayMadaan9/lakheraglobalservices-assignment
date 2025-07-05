import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import process from "process";
import { getUserById } from "../../user/user.service";
import User from "../../../database/models/tUser";

export const auth = (
  publicRoutes: string[] = []
) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (publicRoutes.includes(req.path)) {
        next();
        return;
      }

      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        throw createHttpError(401, {
          message: `Invalid token`,
        });
      }

      const decodedUser = jwt.verify(token, process.env.JWT_SECRET!) as User;

      const user = await getUserById(decodedUser.id);

      if (!user) {
        throw createHttpError(401, { message: "User not found" });
      }

      const { password, ...remainingUser } = user;
      req.user = remainingUser;
      next();
    }
  );
