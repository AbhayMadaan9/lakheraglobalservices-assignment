import express from "express";
import { auth } from "./common/middleware/auth.middleware";
import userRoutes from './user/user.route'
import taskRoutes from "./task/task.route"

// routes
const router = express.Router();


router.use("/user", userRoutes)
router.use("/task", auth(), taskRoutes)

export default router;
