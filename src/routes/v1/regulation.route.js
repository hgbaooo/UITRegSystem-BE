const express = require('express');
const multer = require('multer');
const auth = require('../../middlewares/auth');
const regulationController = require('../../controllers/regulation.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadFields = upload.fields([
  { name: 'sourceFile', maxCount: 1 },
  { name: 'updatedFile', maxCount: 1 },
]);

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Regulations
 *   description: Regulations management API
 */

router.post('/ask', auth('askRegulation'), regulationController.askQuestion);
router.post('/create-regulation', auth('manageRegulations'), uploadFields, regulationController.createRegulation);
router.get('/get-regulation/:regulationId', regulationController.getRegulation);
router.get('/get-all-regulations', regulationController.getAllRegulations);
router.delete('/delete-regulation/:regulationId', auth('manageRegulations'), regulationController.deleteRegulation);

/**
 * @swagger
 * /regulations/ask:
 *   post:
 *     summary: Get answer based on trained data
 *     tags: [Regulations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: User's question to the model
 *             example:
 *               question: "Mục tiêu của chương trình giáo dục của trường?"
 *     responses:
 *       200:
 *         description: Successfully retrieved the answer
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                 results:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                         answer:
 *                           type: string
 *                           description: The answer to the prompt
 *                         source:
 *                           type: string
 *                           description: The source of the answer
 *                         issueDate:
 *                           type: string
 *                           description: The issued date of the source
 *                         updateDate:
 *                           type: string
 *                           description: The updated date of the source
 *                         sourcePath:
 *                           type: string
 *                           description: The source path of the source
 *                         updateFilesPath:
 *                           type: string
 *                           description: The path of the updated file source
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /regulations/create-regulation:
 *   post:
 *     summary: Create a new regulation
 *     tags: [Regulations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - issuedDate
 *               - sourceFile
 *             properties:
 *               name:
 *                 type: string
 *                 description: Regulation name
 *               issuedDate:
 *                 type: string
 *                 format: date
 *                 description: Date the regulation was issued
 *               updatedDate:
 *                 type: string
 *                 format: date
 *                 description: Date the regulation was updated (optional)
 *               sourceFile:
 *                 type: string
 *                 format: binary
 *                 description: Source file for the regulation
 *               updatedFile:
 *                 type: string
 *                 format: binary
 *                 description: Updated file for the regulation
 *             example:
 *               name: "New Regulation"
 *               issuedDate: "2023-01-01"
 *               updatedDate: "2023-01-02"
 *               sourceFile: null
 *               updatedFile: null
 *     responses:
 *       201:
 *         description: Regulation created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Regulation'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /regulations/get-regulation/{regulationId}:
 *   get:
 *     summary: Retrieve a regulation by ID
 *     tags: [Regulations]
 *     parameters:
 *       - in: path
 *         name: regulationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the regulation
 *     responses:
 *       200:
 *         description: Regulation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Regulation'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /regulations/get-all-regulations:
 *   get:
 *     summary: Retrieve all regulations
 *     tags: [Regulations]
 *     responses:
 *       200:
 *         description: List of all regulations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Regulation'
 */

/**
 * @swagger
 * /regulations/delete-regulation/{regulationId}:
 *   delete:
 *     summary: Delete a regulation
 *     tags: [Regulations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: regulationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the regulation to delete
 *     responses:
 *       200:
 *         description: Regulation deleted successfully.
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

module.exports = router;
