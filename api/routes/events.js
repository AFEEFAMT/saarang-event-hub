const express = require('express');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, day, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (day) filter.day = Number(day);
    if (search) {
      filter.title = { $regex: search, $options: 'i' }; 
    }

    // parallel execution for speed
    const [total, events] = await Promise.all([
      Event.countDocuments(filter),
      Event.find(filter)
        .sort({ day: 1, startTime: 1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean() 
    ]);

    res.json({
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      events,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch events.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const newEvent = await Event.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Bad request. Check data payload.' });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    // cascade delete registrations
    await Registration.deleteMany({ event: req.params.id });

    res.json({ message: 'Event and registrations wiped.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete.' });
  }
});

module.exports = router;