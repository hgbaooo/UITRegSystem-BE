const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNotification = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    message: Joi.string().required(),
  }),
};

const updateNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      message: Joi.string(),
    })
    .min(1),
};

module.exports = {
  createNotification,
  updateNotification,
};
