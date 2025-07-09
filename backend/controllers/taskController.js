const { createResponse } = require("../helpers/response.helper");
const {
  getTasksRepo,
  getTaskRepo,
  createTaskRepo,
  deleteTaskRepo,
  updateTaskRepo,
  getTotalTasks,
} = require("../repositories/taskRepo");
const asyncHandler = require('express-async-handler')

const createTask = asyncHandler(async (req, res) => {
  const userId = req?.user?.id;
  if (!userId) {
    res.status(401).send(createResponse(null, 'Unauthenticated request'))
    return;
  }
  const task = await createTaskRepo({ ...req.body, user_id: userId });
  res.status(201).send(createResponse(task, 'Task created successfully'))
});

const getTasks = asyncHandler(async (req, res) => {
  const userId = req?.user?.id;
  if (!userId) {
    res.status(401).send(createResponse(null, 'Unauthenticated request'))
    return;
  }
  const { limit = 10, skip = 0, search = '' } = req.query;
  const tasks = await getTasksRepo({ userId, skip, limit });
  const total = await getTotalTasks({ userId })
  res.status(201).send(createResponse({ tasks, total }, 'Tasks fetched successfully'))
});
const getTask = asyncHandler(async (req, res) => {
  const userId = req?.user?.id;
  if (!userId) {
    res.status(401).send(createResponse(null, 'Unauthenticated request'))
    return;
  }
  const { id: taskId } = req.params;
  const task = await getTaskRepo({ taskId });
  res.status(201).send(createResponse(task, 'Task fetched successfully'))
});
const updateTask = asyncHandler(async (req, res) => {
  const userId = req?.user?.id;
  if (!userId) {
    res.status(401).send(createResponse(null, 'Unauthenticated request'))
    return;
  }
  const { id: taskId } = req.params;

  const task = await updateTaskRepo(taskId, req.body);
  res.status(202).send(createResponse(task, 'Tasks updated successfully'))
});
const deleteTask = asyncHandler(async (req, res) => {
  const userId = req?.user?.id;
  if (!userId) {
    res.status(401).send(createResponse(null, 'Unauthenticated request'))
    return;
  }
  const { id: taskId } = req.params;
  await deleteTaskRepo(taskId);
  res.status(204).send(createResponse(null, 'Tasks deleted successfully'))
});
module.exports = { createTask, getTasks, updateTask, deleteTask, getTask };
