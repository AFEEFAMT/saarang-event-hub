const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// api routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));

// health check
app.get('/', (req, res) => {
  res.send('Saarang DevOps API running.');
});

// 404 fallback
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// global error handler (catches fatal crashes)
app.use((err, req, res, next) => {
  console.error('CRITICAL ERROR:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB Connection Failed:', err);
    process.exit(1); // kill server if no DB
  });