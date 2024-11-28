const mongoose = require('mongoose');

const formTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { collection: 'formTypes' }
);

module.exports = mongoose.model('FormType', formTypeSchema);
