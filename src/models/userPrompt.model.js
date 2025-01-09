const mongoose = require('mongoose');

const userPromptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'userPrompts' }
);

module.exports = mongoose.model('UserPrompt', userPromptSchema);
