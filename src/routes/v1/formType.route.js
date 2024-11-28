const express = require('express');
const multer = require('multer');
const httpStatus = require('http-status');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const formTypeValidation = require('../../validations/formType.validation');
const formTypeController = require('../../controllers/formType.controller');
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
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Only images, PDFs and Docx files are allowed'));
  },
});

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: FormTypes
 *   description: Form Type management API
 */

// Create a form type
router.post(
  '/create-form-type',
  auth('manageFormTypes'),
  upload.array('files'),
  (req, res, next) => {
    if (req.files) {
      req.body.files = req.files.map((file) => file.filename);
    }
    next();
  },
  validate(formTypeValidation.createFormType),
  formTypeController.createFormType
);

router.get('/get-all-form-types', auth('getFormTypes'), formTypeController.getAllFormTypes);

router.get('/get-form-type/:formTypeId', auth('getFormTypes'), formTypeController.getFormType);

router.patch(
  '/update-form-type/:formTypeId',
  auth('manageFormTypes'),
  validate(formTypeValidation.updateFormType),
  formTypeController.updateFormType
);

router.delete('/delete-form-type/:formTypeId', auth('manageFormTypes'), formTypeController.deleteFormType);

/**
 * @swagger
 * /form-types/create-form-type:
 *   post:
 *     summary: Create a new form type with files upload (URL is generated automatically)
 *     description: Create a new form type with name and files upload. The URL will be generated automatically based on the uploaded files.
 *     tags: [FormTypes]
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
 *               - files
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the form type.
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Files to be uploaded (e.g., image, PDF, DOCX).
 *             example:
 *               name: "Survey Form"
 *               files: [file1.pdf, image1.png]
 *     responses:
 *       "201":
 *         description: Form type created successfully with generated URLs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Form type created successfully."
 *                 data:
 *                   $ref: '#/components/schemas/FormType'
 *       "400":
 *         description: Bad Request - Validation Error
 *       "401":
 *         description: Unauthorized - User does not have permission
 *       "415":
 *         description: Unsupported Media Type - Invalid file format
 *       "500":
 *         description: Internal Server Error - Failed to create form type
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FormType:
 *       type: object
 *       required:
 *         - name
 *         - files
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the form type
 *         files:
 *           type: array
 *           items:
 *             type: string
 *             description: List of file URLs generated from the uploaded files
 *       example:
 *         name: "Survey Form"
 *         files: ["https://firebase.com/file1", "https://firebase.com/image1"]
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FormType:
 *       type: object
 *       required:
 *         - name
 *         - url
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the form type
 *         url:
 *           type: string
 *           description: The URL associated with the form type
 *         files:
 *           type: array
 *           items:
 *             type: string
 *             description: List of file URLs related to the form type
 *       example:
 *         name: "Survey Form"
 *         url: "https://example.com/survey-form"
 *         files: ["https://firebase.com/file1", "https://firebase.com/image1"]
 */

/**
 * @swagger
 * /form-types/get-all-form-types:
 *   get:
 *     summary: Get all form types
 *     tags: [FormTypes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK - List of all form types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FormType'
 *       "401":
 *         description: Unauthorized - User does not have permission
 */

/**
 * @swagger
 * /form-types/get-form-type/{formTypeId}:
 *   get:
 *     summary: Get form type by ID
 *     tags: [FormTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formTypeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Form type ID
 *     responses:
 *       "200":
 *         description: OK - The form type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormType'
 *       "404":
 *         description: Not Found - Form type not found
 */

/**
 * @swagger
 * /form-types/update-form-type/{formTypeId}:
 *   patch:
 *     summary: Update a form type
 *     tags: [FormTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formTypeId
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
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *             example:
 *               name: Updated Form Type Name
 *               url: http://updated-url.com
 *     responses:
 *       "200":
 *         description: Form type updated successfully.
 *       "404":
 *         description: Not Found - Form type not found
 */

/**
 * @swagger
 * /form-types/delete-form-type/{formTypeId}:
 *   delete:
 *     summary: Delete a form type
 *     tags: [FormTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formTypeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Form type ID
 *     responses:
 *       "200":
 *         description: Form type deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Form type deleted successfully"
 *       "404":
 *         description: Not Found - Form type not found
 */

module.exports = router;
