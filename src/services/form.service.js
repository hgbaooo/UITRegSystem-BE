const httpStatus = require('http-status');
const { ObjectId } = require('mongoose').Types;
const { Form, FormType } = require('../models');
const ApiError = require('../utils/ApiError');
const firebaseService = require('./firebase.service');

const createForm = async (formBody, file, docxFile) => {
  try {
    const { formTypeId } = formBody;

    if (!ObjectId.isValid(formTypeId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid form type ID');
    }

    const formType = await FormType.findById(formTypeId);
    if (!formType) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'FormType ID provided not found');
    }

    let fileUrl = null;
    let docxUrl = null;

    if (file) {
      fileUrl = await firebaseService.uploadFileToFirebase(file, 'forms', formBody.name);
    }

    if (docxFile) {
      docxUrl = await firebaseService.uploadFileToFirebase(docxFile, 'forms', `docxFile${formBody.name}`);
    }

    const newForm = new Form({
      name: formBody.name,
      description: formBody.description,
      formTypeId: formBody.formTypeId,
      url: fileUrl,
      docxUrl,
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
    const forms = await Form.find().populate('formTypeId', 'name');
    return forms.map((form) => ({
      ...form.toObject(),
      formTypeName: form.formTypeId.name,
    }));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching forms with form type names');
  }
};

const getFormById = async (formId) => {
  try {
    if (!ObjectId.isValid(formId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document ID');
    }
    const form = await Form.findById(formId).populate('formTypeId', 'name');
    if (!form) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
    }
    return {
      ...form.toObject(),
      formTypeName: form.formTypeId.name,
    };
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
