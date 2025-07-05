import createHttpError from "http-errors";
import { AppDataSource } from "../../database";
import Task from "../../database/models/tTask";

export const createTask = async (data: Partial<Task>) => {
  const { title, description, user } = data;
  const task = AppDataSource.manager.create(Task, { title, description, user });
  const result = await AppDataSource.manager.save(task);
  if (!result) {
    throw createHttpError(400, {
      message: "Failed to create task",
      data: null,
    });
  }
  return result;
};

export const updateTask = async (id: string, data: Partial<Task>) => {
  const task = await AppDataSource.manager.findOne(Task, { where: { id } });
  if (!task) {
    throw createHttpError(404, { message: "Task not found" });
  }
  AppDataSource.manager.merge(Task, task, data);
  const result = await AppDataSource.manager.save(task);
  return result;
};

export const editTask = async (id: string, data: Partial<Task>) => {
  // Alias for updateTask
  return updateTask(id, data);
};

export const deleteTask = async (id: string) => {
  const task = await AppDataSource.manager.findOne(Task, { where: { id } });
  if (!task) {
    throw createHttpError(404, { message: "Task not found" });
  }
  await AppDataSource.manager.remove(Task, task);
  return { message: "Task deleted successfully" };
};

export const getTaskById = async (id: string) => {
  const task = await AppDataSource.manager.findOne(Task, { where: { id } });
  if (!task) {
    throw createHttpError(404, { message: "Task not found" });
  }
  return task;
};

export const getAllTask = async () => {
  const tasks = await AppDataSource.manager.find(Task);
  return tasks;
};