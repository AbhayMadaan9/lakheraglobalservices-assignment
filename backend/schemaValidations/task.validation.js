const Joi = require('joi');

const validateCreateTask = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.optional()
});

const validateUpdateTask = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.optional()
});

module.exports = {
  validateCreateTask,
  validateUpdateTask
};
