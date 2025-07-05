import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";

const router = Router();

router
  .post(
    "/login",
    catchError(userValidator.createUser),
    userController.loginUser,
  )
  .post(
    "/register",
    catchError(userValidator.loginUser),
    userController.registerUser,
  );

export default router;
