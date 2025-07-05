import * as userService from "./user.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await userService.createUser(req.body);
    res.send(createResponse(result, "User created sucssefully"));
  },
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.generateTokens(req.body);
  res.send(createResponse(result, "User login sucssefully"));
});
