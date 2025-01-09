const mongoose = require('mongoose');

const regulationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
    sourceUrl: {
      type: String,
      required: true,
    },
    updatedSource: {
      type: String,
    },
  },
  { collection: 'regulations' }
);

module.exports = mongoose.model('Regulation', regulationSchema);
