const httpStatus = require('http-status');
const { ObjectId } = require('mongoose').Types;
const { Notification } = require('../models');
const ApiError = require('../utils/ApiError');

const createNotification = async (notificationBody) => {
  try {
    return await Notification.create(notificationBody);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating notification');
  }
};

const getAllNotifications = async () => {
  try {
    const notifications = await Notification.find();
    return notifications;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching notifications');
  }
};

const getNotificationById = async (notificationId) => {
  try {
    if (!ObjectId.isValid(notificationId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document ID');
    }
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
    }
    return notification;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching notification');
  }
};

const updateNotificationById = async (notificationId, updateBody) => {
  try {
    if (!ObjectId.isValid(notificationId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document ID');
    }
    const notification = await getNotificationById(notificationId);
    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
    }
    Object.assign(notification, updateBody);
    await notification.save();
    return notification;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating notification');
  }
};

const deleteNotificationById = async (notificationId) => {
  try {
    if (!ObjectId.isValid(notificationId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document ID');
    }
    const notification = await getNotificationById(notificationId);
    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
    }
    await notification.remove();
    return notification;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting notification');
  }
};

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById,
};
