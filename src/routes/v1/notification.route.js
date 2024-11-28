const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const notificationValidation = require('../../validations/notification.validation');
const notificationController = require('../../controllers/notification.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management API
 */

router.post(
  '/create-notification',
  auth('manageNotifications'),
  validate(notificationValidation.createNotification),
  notificationController.createNotification
);

router.get('/get-all-notifications', auth('getNotifications'), notificationController.getAllNotifications);

router.get('/get-notification/:notificationId', auth('getNotifications'), notificationController.getNotification);

router.patch(
  '/update-notification/:notificationId',
  auth('manageNotifications'),
  validate(notificationValidation.updateNotification),
  notificationController.updateNotification
);

router.delete(
  '/delete-notification/:notificationId',
  auth('manageNotifications'),
  notificationController.deleteNotification
);

/**
 * @swagger
 * /notifications/create-notification:
 *   post:
 *     summary: Create a notification
 *     description: Only admins can create notifications.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the notification.
 *               message:
 *                 type: string
 *                 description: The message content of the notification.
 *             example:
 *               title: Notification Example
 *               message: This is a sample notification message.
 *     responses:
 *       "201":
 *         description: Notification created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "500":
 *         description: Internal server error.
 *
 * /notifications/get-all-notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 * /notifications/get-notification/{notificationId}:
 *   get:
 *     summary: Get a notification by ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 * /notifications/update-notification/{notificationId}:
 *   patch:
 *     summary: Update a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *             example:
 *               title: Updated Notification Title
 *               message: Updated notification message content.
 *     responses:
 *       "200":
 *         description: Notification updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 * /notifications/delete-notification/{notificationId}:
 *   delete:
 *     summary: Delete a notification
 *     description: Only admins can delete notifications.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       "200":
 *         description: Notification deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Notification deleted successfully"
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

module.exports = router;
