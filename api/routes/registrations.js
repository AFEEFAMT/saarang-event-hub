const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:eventId', protect, async (req, res) => {
  try {
    const targetEvent = await Event.findById(req.params.eventId).lean();
    if (!targetEvent) return res.status(404).json({ message: 'Event not found.' });

    if (targetEvent.registrationCount >= targetEvent.maxParticipants) {
      return res.status(400).json({ message: 'Event is full.' });
    }

    // create reg first. unique index blocks double-booking.
    const newReg = await Registration.create({
      user: req.user.id,
      event: req.params.eventId,
    });

    // atomic update to prevent counting errors
    await Event.findByIdAndUpdate(req.params.eventId, {
      $inc: { registrationCount: 1 },
    });

    res.status(201).json({ message: 'Registered successfully', registration: newReg });
  } catch (err) {
   
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already registered.' });
    }
    console.error(err);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

router.delete('/:eventId', protect, async (req, res) => {
  try {
    const reg = await Registration.findOneAndDelete({
      user: req.user.id,
      event: req.params.eventId,
    });
    
    if (!reg) return res.status(404).json({ message: 'Registration not found.' });

    await Event.findByIdAndUpdate(req.params.eventId, {
      $inc: { registrationCount: -1 },
    });

    res.json({ message: 'Registration cancelled.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Cancellation failed.' });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const userRegs = await Registration.find({ user: req.user.id })
      .populate('event')
      .sort({ createdAt: -1 })
      .lean(); // strip mongoose overhead

    // pluck just the event data to send to react
    const eventsAttending = userRegs.map(reg => reg.event);
    res.json(eventsAttending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch registrations.' });
  }
});

module.exports = router;