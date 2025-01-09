const mongoose = require('mongoose');

const formSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    docxUrl: {
      type: String,
      required: true,
    },
    formTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FormType',
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'forms' }
);

module.exports = mongoose.model('Form', formSchema);
