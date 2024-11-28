const express = require('express');
const multer = require('multer');
const httpStatus = require('http-status');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const formValidation = require('../../validations/form.validation');
const formController = require('../../controllers/form.controller');
const ApiError = require('../../utils/ApiError');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const mimeType = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(file.originalname.split('.').pop());

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Only images, PDFs and Docx are allowed'));
  },
});

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Forms
 *   description: Form management API
 */

router.post(
  '/create-form',
  auth('manageForms'),
  upload.array('files'),
  (req, res, next) => {
    if (req.files) {
      req.body.files = req.files.map((file) => file.filename);
    }
    next();
  },
  validate(formValidation.createForm),
  formController.createForm
);

router.get('/get-all-forms', auth('getForms'), formController.getAllForms);

router.get('/get-form/:formId', auth('getForms'), formController.getForm);

router.patch('/update-form/:formId', auth('manageForms'), validate(formValidation.updateForm), formController.updateForm);

router.delete('/delete-form/:formId', auth('manageForms'), formController.deleteForm);

/**
 * @swagger
 * /forms/create-form:
 *   post:
 *     summary: Create a form with optional files
 *     description: Only authorized users can create forms with optional file uploads (images, PDFs, and Docx).
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the form.
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: List of files to be uploaded (images, PDFs, Docx).
 *             example:
 *               title: Sample Form
 *               description: This is a sample form description.
 *               files: []
 *     responses:
 *       "201":
 *         description: Form created successfully, including files.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Form created successfully"
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["file1.jpg", "file2.pdf"]
 *       "400":
 *         description: Bad Request - Validation or file upload error.
 *       "401":
 *         description: Unauthorized - User does not have permission.
 *       "415":
 *         description: Unsupported Media Type - Invalid file type or format.
 */

/**
 * @swagger
 * /forms/get-all-forms:
 *   get:
 *     summary: Get all forms
 *     tags: [Forms]
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
 *                 $ref: '#/components/schemas/Form'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /forms/get-form/{formId}:
 *   get:
 *     summary: Get a form by ID
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *         description: Form ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Form'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /forms/update-form/{formId}:
 *   patch:
 *     summary: Update a form
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               title: Updated Form Title
 *               description: Updated form description.
 *     responses:
 *       "200":
 *         description: Form updated successfully.
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /forms/delete-form/{formId}:
 *   delete:
 *     summary: Delete a form
 *     description: Only authorized users can delete forms.
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *         description: Form ID
 *     responses:
 *       "200":
 *         description: Form deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Form deleted successfully"
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

module.exports = router;
