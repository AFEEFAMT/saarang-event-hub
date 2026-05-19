const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,

    enum: [
      'Music', 'Drama', 'Dance', 'Fine Arts', 'Literary Arts',
      'Speaking Arts', 'Design', 'Fashion', 'Gaming', 'Informals',
      'Meraki', 'Nova', 'Choreo', 'Quiz', 'Writing', 'Classical Arts',
      'Oratory', 'Wordgames', 'Media', 'Comedy', 'Other',
    ],
  },
  description: {
    type: String,
    default: '',
  },
  venue: {
    type: String,
    required: true,
  },
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  startTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):?([0-5]\d)$/ 
  },
  endTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):?([0-5]\d)$/
  },
  maxParticipants: {
    type: Number,
    default: 100,
  },
  registrationCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // links to the User model
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true }
});

eventSchema.index({ day: 1, category: 1 });

// dynamic calc, without taking up db space
eventSchema.virtual('isFull').get(function () {
  return this.registrationCount >= this.maxParticipants;
});

module.exports = mongoose.model('Event', eventSchema);