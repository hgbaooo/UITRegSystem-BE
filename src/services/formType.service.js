const httpStatus = require('http-status');
const { ObjectId } = require('mongoose').Types;
const { FormType } = require('../models');
const ApiError = require('../utils/ApiError');
const firebaseService = require('./firebase.service');

const createFormType = async (formTypeBody, files) => {
  try {
    let fileUrl = null;

    if (files) {
      fileUrl = await firebaseService.uploadFileToFirebase(files, 'formTypes', formTypeBody.name);
    }

    const newFormType = new FormType({
      name: formTypeBody.name,
      description: formTypeBody.description,
      url: fileUrl,
    });

    await newFormType.save();
    return newFormType;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create form type');
  }
};

const getAllFormTypes = async () => {
  try {
    return await FormType.find();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching form types');
  }
};

const getFormTypeById = async (formTypeId) => {
  try {
    if (!ObjectId.isValid(formTypeId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document ID');
    }
    const formType = await FormType.findById(formTypeId);
    if (!formType) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Form type not found');
    }
    return formType;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching form type');
  }
};

const updateFormTypeById = async (formTypeId, updateBody) => {
  try {
    if (!ObjectId.isValid(formTypeId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document ID');
    }
    const formType = await getFormTypeById(formTypeId);
    Object.assign(formType, updateBody);
    await formType.save();
    return formType;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating form type');
  }
};

const deleteFormTypeById = async (formTypeId) => {
  try {
    if (!ObjectId.isValid(formTypeId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document ID');
    }
    const formType = await getFormTypeById(formTypeId);
    await formType.remove();
    return formType;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting form type');
  }
};

module.exports = {
  createFormType,
  getAllFormTypes,
  getFormTypeById,
  updateFormTypeById,
  deleteFormTypeById,
};
