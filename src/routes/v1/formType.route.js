const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const formTypeValidation = require('../../validations/formType.validation');
const formTypeController = require('../../controllers/formType.controller');

const router = express.Router();

router.post(
  '/create-form-type',
  auth('manageFormTypes'),
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
 * tags:
 *   name: FormTypes
 *   description: API for managing form types
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FormType:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the form type
 *         description:
 *           type: string
 *           description: A brief description of the form type
 *       example:
 *         name: "Survey Form"
 *         description: "A form type used for surveys."
 */

/**
 * @swagger
 * /form-types/create-form-type:
 *   post:
 *     summary: Create a new form type
 *     description: Allows the creation of a form type by providing a name and description.
 *     tags: [FormTypes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the form type
 *               description:
 *                 type: string
 *                 description: A brief description of the form type
 *             required:
 *               - name
 *               - description
 *     responses:
 *       "201":
 *         description: Form type created successfully
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
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "500":
 *         description: Internal server error.
 */

/**
 * @swagger
 * /form-types/get-all-form-types:
 *   get:
 *     summary: Retrieve all form types
 *     tags: [FormTypes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: A list of form types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FormType'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /form-types/get-form-type/{formTypeId}:
 *   get:
 *     summary: Retrieve a specific form type by ID
 *     tags: [FormTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formTypeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the form type
 *     responses:
 *       "200":
 *         description: The form type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormType'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
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
 *         description: ID of the form type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the form type
 *               description:
 *                 type: string
 *                 description: The updated description of the form type
 *             required:
 *               - name
 *               - description
 *     responses:
 *       "200":
 *         description: Form type updated successfully
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
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
 *         description: ID of the form type
 *     responses:
 *       "200":
 *         description: Form type deleted successfully
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

module.exports = router;
