const httpStatus = require('http-status');

const { ref, uploadBytes } = require('firebase/storage');
const { storage } = require('../config/firebase');
const ApiError = require('../utils/ApiError');

const uploadFileToFirebase = async (file, rootFolder, folderName) => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = `${rootFolder}/${folderName}/${fileName}`;
  const fileRef = ref(storage, filePath);

  try {
    await uploadBytes(fileRef, file.buffer, { contentType: file.mimetype });
    const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
      process.env.FIREBASE_STORAGE_BUCKET
    }/o/${encodeURIComponent(filePath)}?alt=media`;
    return fileUrl;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload file');
  }
};

module.exports = {
  uploadFileToFirebase,
};
