// server/index.js
const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/bookingRoutes');
const { initRooms } = require('./services/bookingService');

const app = express();
const PORT = 4001;

// Middleware
app.use(cors({
    origin: '*', // 👈 Allow all origins
    methods: ['GET', 'POST'],
  }));
app.use(express.json());

// Initialize rooms
initRooms();

// Routes
app.use('/api', bookingRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});