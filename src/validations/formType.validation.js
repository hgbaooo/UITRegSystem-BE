const Joi = require('joi');

const createFormType = {
  body: Joi.object().keys({
    name: Joi.string().required().min(3).max(255).trim(),
    files: Joi.array(),
  }),
};

const updateFormType = {
  body: Joi.object().keys({
    name: Joi.string().optional().min(3).max(255).trim(),
    files: Joi.array(),
  }),
};

module.exports = {
  createFormType,
  updateFormType,
};
