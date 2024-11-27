const express = require('express');
const router = express.Router();
const regulationController = require('../../controllers/regulation.controller');

/**
 * @swagger
 * /regulation/predict:
 *   post:
 *     summary: Get prediction answer
 *     description: This endpoint receives a question and returns the predicted answer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: "Không nạp học phí đúng hạn thì bị phạt thế nào?"
 *     responses:
 *       200:
 *         description: Successfully retrieved the answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *                   example: "Điều 16. Xử lý học vụ ..."
 *       500:
 *         description: An error occurred while processing your request.
 */
router.post('/predict', regulationController.predictAnswer);

module.exports = router;
