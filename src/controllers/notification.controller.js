const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');

const createNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.createNotification(req.body);
  res.status(httpStatus.CREATED).send(notification);
});

const getNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.notificationId);
  res.status(httpStatus.OK).send(notification);
});

const getAllNotifications = catchAsync(async (req, res) => {
  const notifications = await notificationService.getAllNotifications();
  res.status(httpStatus.OK).send(notifications);
});

const updateNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.updateNotificationById(req.params.notificationId, req.body);
  res.status(httpStatus.OK).send(notification);
});

const deleteNotification = catchAsync(async (req, res) => {
  await notificationService.deleteNotificationById(req.params.notificationId);
  res.status(httpStatus.OK).json({ message: 'Notification deleted successfully' });
});

module.exports = {
  createNotification,
  getNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification,
};
