const Joi = require('joi');

const createFormType = {
  body: Joi.object().keys({
    name: Joi.string().required().min(3).max(255).trim(),
    description: Joi.string().required(),
  }),
};

const updateFormType = {
  body: Joi.object().keys({
    name: Joi.string().optional().min(3).max(255).trim(),
    description: Joi.string().optional(),
  }),
};

module.exports = {
  createFormType,
  updateFormType,
};
