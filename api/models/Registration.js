const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  // makes scaling easier later 
  status: {
    type: String,
    enum: ['registered', 'waitlisted', 'cancelled'],
    default: 'registered'
  }
}, { timestamps: true });

// db-level lock against double booking
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);