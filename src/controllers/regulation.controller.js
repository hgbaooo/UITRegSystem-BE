const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { regulationService, qaService } = require('../services');

const askQuestion = catchAsync(async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: 'Question is required' });
  }
  const result = await qaService.askQuestion(question);
  if (result && result.error) {
    return res.status(500).json({ error: result.error });
  }
  res.status(httpStatus.OK).json(result);
});

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
  askQuestion,
  createRegulation,
  getRegulation,
  getAllRegulations,
  deleteRegulation,
};
