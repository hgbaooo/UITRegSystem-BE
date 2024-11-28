const Joi = require('joi');

const createForm = {
  body: Joi.object().keys({
    name: Joi.string().required().min(3).max(255).trim(),
    formTypeId: Joi.string().required().hex().length(24),
  }),
};

const updateForm = {
  body: Joi.object().keys({
    name: Joi.string().optional().min(3).max(255).trim(),
    formTypeId: Joi.string().optional().hex().length(24),
  }),
};

module.exports = {
  createForm,
  updateForm,
};
