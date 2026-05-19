require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

const SAARANG_EVENTS = [
  { 
    title: 'Spotlight - Author Panel', 
    category: 'Other', 
    venue: 'CLT', 
    day: 1, 
    startTime: '10:00', 
    endTime: '11:00', 
    maxParticipants: 300,
    description: 'Spons Book Author Panel discussion.'
  },
  { 
    title: 'Shadow Puppetry', 
    category: 'Meraki', 
    venue: 'CLT', 
    day: 1, 
    startTime: '12:00', 
    endTime: '14:00', 
    maxParticipants: 150,
    description: 'Beautiful shadow puppetry showcase by Meraki.'
  },
  { 
    title: '48 Hrs Short Film Making', 
    category: 'Media', 
    venue: 'CLT FOYER', 
    day: 1, 
    startTime: '09:00', 
    endTime: '17:00', 
    maxParticipants: 200,
    description: 'Media Club short film making competition.'
  },
  { 
    title: 'Mime It Out', 
    category: 'Drama', 
    venue: 'HSB 133', 
    day: 1, 
    startTime: '09:00', 
    endTime: '17:00', 
    maxParticipants: 120,
    description: 'Express without words in this dramatic mime competition.'
  },
  { 
    title: 'Alankar', 
    category: 'Music', 
    venue: 'RJN 101', 
    day: 1, 
    startTime: '09:00', 
    endTime: '18:00', 
    maxParticipants: 100,
    description: 'Solo instrumental and vocal music competition.'
  },
  { 
    title: 'Standup Comedy', 
    category: 'Comedy', 
    venue: 'MSB 301', 
    day: 1, 
    startTime: '12:00', 
    endTime: '17:00', 
    maxParticipants: 250,
    description: 'Open mic and standup comedy performances.'
  },
  { 
    title: 'ProShows - EDM Night', 
    category: 'Music', 
    venue: 'OAT', 
    day: 1, 
    startTime: '18:00', 
    endTime: '23:00', 
    maxParticipants: 6000,
    description: 'The massive EDM night at the Open Air Theatre.'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB connected. Wiping data...');

    // parallel wipe is faster
    await Promise.all([
      User.deleteMany(),
      Event.deleteMany(),
      Registration.deleteMany()
    ]);
    console.log('Wipe complete.');

    await User.create([
      {
        name: 'Saarang Admin',
        email: 'admin@saarang.org',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'Test Student',
        email: 'user@test.com',
        password: 'user123',
        role: 'user',
      }
    ]);
    console.log('Test accounts created.');

    await Event.insertMany(SAARANG_EVENTS);
    console.log(`Seeded ${SAARANG_EVENTS.length} events.`);

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seedDatabase();