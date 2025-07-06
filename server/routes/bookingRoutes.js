// server/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAvailableRooms,
  bookRooms,
  resetBookings,
  randomOccupy
} = require('../services/bookingService');

router.get('/rooms', (req, res) => {
  res.json(getAvailableRooms());
});

router.post('/book', (req, res) => {
  const { count } = req.body;
  if (!count || count < 1 || count > 5) {
    return res.status(400).json({ error: 'Invalid room count (1-5 allowed)' });
  }
  const result = bookRooms(count);
  res.json(result);
});

router.post('/reset', (req, res) => {
  resetBookings();
  res.json({ message: 'Bookings reset' });
});

router.post('/random', (req, res) => {
  randomOccupy();
  res.json({ message: 'Random occupancy generated' });
});

module.exports = router;