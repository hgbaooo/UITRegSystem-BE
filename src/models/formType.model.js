const mongoose = require('mongoose');

const formTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'formTypes' }
);

module.exports = mongoose.model('FormType', formTypeSchema);
