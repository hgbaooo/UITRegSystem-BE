const httpStatus = require('http-status');
const { ObjectId } = require('mongoose').Types;
const { Regulation } = require('../models');
const ApiError = require('../utils/ApiError');
const firebaseService = require('./firebase.service');

const createRegulation = async (regulationBody, sourceFile, updatedFile) => {
  try {
    if (sourceFile.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Source file is required');
    }
    const fileUrl = await firebaseService.uploadFileToFirebase(sourceFile, 'regulations', regulationBody.name);
    let updatedUrl = null;
    let updatedDate = null;

    if (updatedFile) {
      updatedUrl = await firebaseService.uploadFileToFirebase(updatedFile, 'regulations', `updated${regulationBody.name}`);
      updatedDate = new Date(regulationBody.updatedDate);
    }

    const issuedDate = new Date(regulationBody.issuedDate);

    const newRegulation = new Regulation({
      name: regulationBody.name,
      issuedDate,
      updatedDate,
      sourceUrl: fileUrl,
      updatedSource: updatedUrl,
    });

    await newRegulation.save();
    return newRegulation;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error creating regulation: ${error.message}`);
  }
};

module.exports = {
  createRegulation,
};
const getRegulationById = async (regulationId) => {
  try {
    if (!ObjectId.isValid(regulationId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid regulation ID');
    }
    const regulation = await Regulation.findById(regulationId);
    if (!regulation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Regulation not found');
    }
    return regulation;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating regulation');
  }
};

const getAllRegulations = async () => {
  try {
    const regulations = await Regulation.find();
    return regulations;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating regulation');
  }
};

const deleteRegulationById = async (regulationId) => {
  try {
    if (!ObjectId.isValid(regulationId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid regulation ID');
    }
    const regulation = await Regulation.findByIdAndDelete(regulationId);
    if (!regulation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Regulation not found');
    }
    return regulation;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating regulation');
  }
};

module.exports = {
  createRegulation,
  getRegulationById,
  getAllRegulations,
  deleteRegulationById,
};
