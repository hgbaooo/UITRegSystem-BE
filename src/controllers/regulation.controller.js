const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { regulationService } = require('../services');

const createRegulation = catchAsync(async (req, res) => {
  const regulation = await regulationService.createRegulation(req.body, req.files.sourceFile, req.files.updatedFile);
  res.status(httpStatus.CREATED).send(regulation);
});

const getRegulation = catchAsync(async (req, res) => {
  const regulation = await regulationService.getRegulationById(req.params.regulationId);
  res.status(httpStatus.OK).send(regulation);
});

const getAllRegulations = catchAsync(async (req, res) => {
  const regulations = await regulationService.getAllRegulations();
  res.status(httpStatus.OK).send(regulations);
});

const deleteRegulation = catchAsync(async (req, res) => {
  await regulationService.deleteRegulationById(req.params.regulationId);
  res.status(httpStatus.OK).json({ message: 'Regulation deleted successfully' });
});

module.exports = {
  createRegulation,
  getRegulation,
  getAllRegulations,
  deleteRegulation,
};
