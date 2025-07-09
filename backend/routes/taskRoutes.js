const express = require("express");
const router = express.Router();

const { createTask, getTasks, updateTask, deleteTask, getTask } = require('../controllers/taskController');
const validateRequest = require("../middlewares/validateRequest.middleware");
const { validateCreateTask, validateUpdateTask } = require("../schemaValidations/task.validation");


router
    .get('/', getTasks)
    .get('/:id', getTask)
    .post('/', validateRequest(validateCreateTask), createTask)
    .put('/:id', validateRequest(validateUpdateTask), updateTask)
    .delete('/:id', deleteTask)
module.exports = router;