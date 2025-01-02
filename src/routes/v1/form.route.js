const express = require('express');
const multer = require('multer');
const validate = require('../../middlewares/validate');
const formValidation = require('../../validations/form.validation');
const formController = require('../../controllers/form.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Forms
 *   description: Form management API
 */

router.post('/create-form', upload.single('file'), validate(formValidation.createForm), formController.createForm);

router.get('/get-form/:formId', formController.getForm);

router.get('/get-all-forms', formController.getAllForms);

router.patch('/update-form/:formId', validate(formValidation.updateForm), formController.updateForm);

router.delete('/delete-form/:formId', formController.deleteForm);

/**
 * @swagger
 * /forms/create-form:
 *   post:
 *     summary: Create a new form
 *     tags: [Forms]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - formTypeId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Form name
 *               description:
 *                 type: string
 *                 description: Form description
 *               formTypeId:
 *                 type: string
 *                 description: Reference to form type ID
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional file (e.g., image, PDF)
 *             example:
 *               name: "Feedback Form"
 *               formTypeId: "605c72ef1532071f1c1d8f3c"
 *               file: null
 *     responses:
 *       201:
 *         description: Form created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Form'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /forms/get-all-forms:
 *   get:
 *     summary: Retrieve all forms
 *     tags: [Forms]
 *     responses:
 *       200:
 *         description: List of forms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Form'
 */

/**
 * @swagger
 * /forms/get-form/{formId}:
 *   get:
 *     summary: Retrieve a form by ID
 *     tags: [Forms]
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the form
 *     responses:
 *       200:
 *         description: Form details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Form'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /forms/update-form/{formId}:
 *   patch:
 *     summary: Update form details
 *     tags: [Forms]
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the form
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               name: "Updated Feedback Form"
 *               description: "Updated description."
 *     responses:
 *       200:
 *         description: Form updated successfully.
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /forms/delete-form/{formId}:
 *   delete:
 *     summary: Delete a form
 *     tags: [Forms]
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the form
 *     responses:
 *       200:
 *         description: Form deleted successfully.
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

module.exports = router;