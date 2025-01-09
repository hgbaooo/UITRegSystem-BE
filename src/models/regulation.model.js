const mongoose = require('mongoose');

const userPromptSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
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
      required: true,
    },
  },
  { collection: 'userPrompts' }
);

module.exports = mongoose.model('UserPrompt', userPromptSchema);
