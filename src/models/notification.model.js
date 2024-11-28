const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { collection: 'notifications' }
);

module.exports = mongoose.model('Notification', notificationSchema);
