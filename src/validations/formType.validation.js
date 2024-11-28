const Joi = require('joi');

const createFormType = {
  body: Joi.object().keys({
    name: Joi.string().required().min(3).max(255).trim(),
  }),
};

const updateFormType = {
  body: Joi.object().keys({
    name: Joi.string().optional().min(3).max(255).trim(),
  }),
};

module.exports = {
  createFormType,
  updateFormType,
};
