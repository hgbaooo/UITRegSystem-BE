const httpStatus = require('http-status');
const { ObjectId } = require('mongoose').Types;
const { FormType } = require('../models');
const ApiError = require('../utils/ApiError');

const createFormType = async (formTypeBody) => {
  try {
    return await FormType.create(formTypeBody);
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
  if (!ObjectId.isValid(formTypeId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document ID');
  }
  try {
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
  if (!ObjectId.isValid(formTypeId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document ID');
  }
  try {
    const formType = await FormType.findByIdAndUpdate(formTypeId, { $set: updateBody }, { new: true, runValidators: true });
    if (!formType) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Form type not found');
    }
    return formType;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating form type');
  }
};

const deleteFormTypeById = async (formTypeId) => {
  if (!ObjectId.isValid(formTypeId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid document ID');
  }
  try {
    const formType = await FormType.findByIdAndDelete(formTypeId);
    if (!formType) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Form type not found');
    }
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
