const httpStatus = require('http-status');
const { ObjectId } = require('mongoose').Types;
const { Form, FormType } = require('../models');
const ApiError = require('../utils/ApiError');
const firebaseService = require('./firebase.service');

const createForm = async (formBody, file, userId) => {
  try {
    const { formTypeId } = formBody;

    const formType = await FormType.findById(formTypeId);
    if (!formType) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid formType ID provided');
    }
    let fileUrl = null;

    if (file) {
      fileUrl = await firebaseService.uploadFileToFirebase(file, 'forms', formBody.name);
    }

    const newForm = new Form({
      name: formBody.name,
      formTypeId: formBody.formTypeId,
      url: fileUrl,
      userId,
      createdAt: Date.now(),
    });

    await newForm.save();
    return newForm;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating form');
  }
};

const getAllForms = async () => {
  try {
    return await Form.find();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching forms');
  }
};

const getFormById = async (formId) => {
  try {
    if (!ObjectId.isValid(formId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document ID');
    }
    const form = await Form.findById(formId);
    if (!form) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
    }
    return form;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching form');
  }
};

const getFormsByFormTypeId = async (formTypeId) => {
  try {
    if (!ObjectId.isValid(formTypeId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid form type ID');
    }
    const forms = await Form.find({ formTypeId });
    return forms;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching forms by formTypeId');
  }
};

const updateFormById = async (formId, updateBody) => {
  try {
    if (!ObjectId.isValid(formId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document ID');
    }
    const form = await getFormById(formId);
    Object.assign(form, updateBody);
    await form.save();
    return form;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating form');
  }
};

const deleteFormById = async (formId) => {
  try {
    if (!ObjectId.isValid(formId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document ID');
    }
    const form = await getFormById(formId);
    await form.remove();
    return form;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting form');
  }
};

module.exports = {
  createForm,
  getAllForms,
  getFormById,
  getFormsByFormTypeId,
  updateFormById,
  deleteFormById,
};
