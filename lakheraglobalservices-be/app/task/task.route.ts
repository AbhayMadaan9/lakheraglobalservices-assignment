import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as taskController from "./task.controller";
import * as taskValidator from "./task.validation";

const router = Router();

router
  .get("/", taskController.getAllTask)
  .get("/:id", taskController.getTaskById)
  .delete("/:id", taskController.deleteTask)
  .post("/", catchError(taskValidator.createTask), taskController.createTask)
  .put("/:id", catchError(taskValidator.updateTask), taskController.updateTask)
  .patch("/:id", catchError(taskValidator.editTask), taskController.editTask);

export default router;
