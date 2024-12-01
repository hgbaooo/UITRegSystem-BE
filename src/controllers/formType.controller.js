const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { formTypeService } = require('../services');

const createFormType = catchAsync(async (req, res) => {
  const formType = await formTypeService.createFormType(req.body, req.file);
  res.status(httpStatus.CREATED).send(formType);
});

const getAllFormTypes = catchAsync(async (req, res) => {
  const formTypes = await formTypeService.getAllFormTypes();
  res.status(httpStatus.OK).send(formTypes);
});

const getFormType = catchAsync(async (req, res) => {
  const formType = await formTypeService.getFormTypeById(req.params.formTypeId);
  res.status(httpStatus.OK).send(formType);
});

const updateFormType = catchAsync(async (req, res) => {
  const formType = await formTypeService.updateFormTypeById(req.params.formTypeId, req.body);
  res.status(httpStatus.OK).send(formType);
});

const deleteFormType = catchAsync(async (req, res) => {
  await formTypeService.deleteFormTypeById(req.params.formTypeId);
  res.status(httpStatus.OK).json({ message: 'Form type deleted successfully' });
});

module.exports = {
  createFormType,
  getAllFormTypes,
  getFormType,
  updateFormType,
  deleteFormType,
};
