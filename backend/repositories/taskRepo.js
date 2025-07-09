const db = require("../models/index");
const { Op } = require('sequelize')
const getTaskRepo = async ({taskId}) => {
  try {
    const task = await db.Task.findOne({
   where: { id: taskId },
    });
    return task;
  } catch (error) {
    console.log(error);
  }
};

const getTasksRepo = async ({ userId, skip = 0, limit = 10, search = '' }) => {
  try {
    const tasks = await db.Task.findAll({
      where: { user_id: userId },
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ],
      offset: skip,
      limit: limit,
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};
const getTotalTasks = async ({ userId }) => {
  try {
    const count = await db.Task.count({
      where: { user_id: userId }
    });

    return count;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

const createTaskRepo = async (taskObj) => {
  try {
    const task = await db.Task.create(taskObj);
    return task;
  } catch (error) {
    console.log(error);
  }
};

const deleteTaskRepo = async (reqId) => {
  try {
    const task = await db.Task.destroy({
      where: {
        id: reqId,
      },
    });
    return task;
  } catch (error) {
    console.log(error);
  }
};
const updateTaskRepo = async (reqId, updatedObj) => {
  try {
    const task = await db.Task.update(updatedObj, {
      where: {
        id: reqId,
      },
      returning: true
    });
    return task;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getTasksRepo,
  getTaskRepo,
  createTaskRepo,
  deleteTaskRepo,
  updateTaskRepo,
  getTotalTasks
};
