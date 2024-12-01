const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { formService } = require('../services');

const createForm = catchAsync(async (req, res) => {
  const form = await formService.createForm(req.body, req.file, req.user.id);
  res.status(httpStatus.CREATED).send(form);
});

const getForm = catchAsync(async (req, res) => {
  const form = await formService.getFormById(req.params.formId);
  res.status(httpStatus.OK).send(form);
});

const getAllForms = catchAsync(async (req, res) => {
  const forms = await formService.getAllForms();
  res.status(httpStatus.OK).send(forms);
});

const updateForm = catchAsync(async (req, res) => {
  const form = await formService.updateFormById(req.params.formId, req.body);
  res.status(httpStatus.OK).send(form);
});

const deleteForm = catchAsync(async (req, res) => {
  await formService.deleteFormById(req.params.formId);
  res.status(httpStatus.OK).json({ message: 'Form deleted successfully' });
});

module.exports = {
  createForm,
  getForm,
  getAllForms,
  updateForm,
  deleteForm,
};
