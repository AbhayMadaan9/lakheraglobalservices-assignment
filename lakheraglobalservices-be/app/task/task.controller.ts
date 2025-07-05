import * as taskService from "./task.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const result = await taskService.createTask(req.body);
  res.send(createResponse(result, "Task created sucssefully"));
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const result = await taskService.updateTask(req.params.id, req.body);
  res.send(createResponse(result, "Task updated sucssefully"));
});

export const editTask = asyncHandler(async (req: Request, res: Response) => {
  const result = await taskService.editTask(req.params.id, req.body);
  res.send(createResponse(result, "Task updated sucssefully"));
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const result = await taskService.deleteTask(req.params.id);
  res.send(createResponse(result, "Task deleted sucssefully"));
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const result = await taskService.getTaskById(req.params.id);
  res.send(createResponse(result));
});

export const getAllTask = asyncHandler(async (req: Request, res: Response) => {
  const result = await taskService.getAllTask();
  res.send(createResponse(result));
});
