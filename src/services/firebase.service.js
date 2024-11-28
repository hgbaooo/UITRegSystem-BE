const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { bucket } = require('../config/firebase');

const uploadFileToFirebase = async (file, rootFolder, folderName) => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const fileRef = bucket.file(`${rootFolder}/${folderName}/${fileName}`);

  try {
    await fileRef.save(file.buffer, { contentType: file.mimetype });
    return `https://storage.googleapis.com/${bucket.name}/${rootFolder}/${folderName}/${fileName}`;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload file');
  }
};

module.exports = {
  uploadFileToFirebase,
};
