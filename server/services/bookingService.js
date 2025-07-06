// server/services/bookingService.js
const { getRooms, setRooms, resetRooms } = require('../db');

// Constants
const FLOORS = 10;
const ROOMS_PER_FLOOR = 10;
const TOP_FLOOR_ROOMS = 7;
const MAX_BOOKING = 5;

// Initialize rooms with room numbers and floor info
function initRooms() {
  const rooms = [];

  for (let floor = 1; floor <= FLOORS; floor++) {
    const numRooms = floor === 10 ? TOP_FLOOR_ROOMS : ROOMS_PER_FLOOR;
    for (let i = 1; i <= numRooms; i++) {
      const roomNumber = floor === 10 ? 1000 + i : floor * 100 + i;
      rooms.push({
        roomNumber,
        floor,
        booked: false,
      });
    }
  }

  setRooms(rooms);
}

// Get available rooms
function getAvailableRooms() {
  return getRooms().filter(room => !room.booked);
}

// Reset bookings
function resetBookings() {
  const rooms = getRooms().map(room => ({
    ...room,
    booked: false
  }));
  setRooms(rooms);
}

// Randomly occupy rooms
function randomOccupy() {
  const rooms = getRooms().map(room => ({
    ...room,
    booked: Math.random() < 0.3 // 30% chance to book
  }));
  setRooms(rooms);
}

// Book rooms based on optimal proximity logic
function bookRooms(requestedCount) {
  if (requestedCount < 1 || requestedCount > MAX_BOOKING) {
    return { success: false, message: 'Can book 1 to 5 rooms only.' };
  }

  const available = getAvailableRooms();
  if (available.length < requestedCount) {
    return { success: false, message: 'Not enough rooms available.' };
  }

  // Step 1: Try to find enough rooms on the same floor
  const floorsMap = {};
  for (const room of available) {
    if (!floorsMap[room.floor]) floorsMap[room.floor] = [];
    floorsMap[room.floor].push(room);
  }

  for (const floor in floorsMap) {
    const roomsOnFloor = floorsMap[floor];
    if (roomsOnFloor.length >= requestedCount) {
      // Sort by room number to get closest rooms
      const sorted = roomsOnFloor.sort((a, b) => a.roomNumber - b.roomNumber);
      const selected = sorted.slice(0, requestedCount);
      markBooked(selected);
      return { success: true, rooms: selected };
    }
  }

  // Step 2: Select combination of rooms that minimizes travel time
  const allCombos = getAllCombinations(available, requestedCount);
  let minTime = Infinity;
  let bestCombo = null;

  for (const combo of allCombos) {
    const time = calculateTotalTravelTime(combo);
    if (time < minTime) {
      minTime = time;
      bestCombo = combo;
    }
  }

  if (bestCombo) {
    markBooked(bestCombo);
    return { success: true, rooms: bestCombo };
  }

  return { success: false, message: 'Could not find suitable room combination.' };
}

// Mark given rooms as booked
function markBooked(bookedRooms) {
  const rooms = getRooms().map(room => {
    if (bookedRooms.find(r => r.roomNumber === room.roomNumber)) {
      return { ...room, booked: true };
    }
    return room;
  });
  setRooms(rooms);
}

// Generate all combinations of size n
function getAllCombinations(arr, n) {
  const results = [];
  const recurse = (start, combo) => {
    if (combo.length === n) {
      results.push([...combo]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      recurse(i + 1, combo);
      combo.pop();
    }
  };
  recurse(0, []);
  return results;
}

// Calculate travel time between first and last room
function calculateTotalTravelTime(rooms) {
  if (rooms.length <= 1) return 0;

  const sorted = rooms.sort((a, b) => {
    if (a.floor === b.floor) return a.roomNumber - b.roomNumber;
    return a.floor - b.floor;
  });

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const vertical = Math.abs(last.floor - first.floor) * 2;
  const horizontal = Math.abs((last.roomNumber % 100) - (first.roomNumber % 100));

  return vertical + horizontal;
}

module.exports = {
  initRooms,
  getAvailableRooms,
  bookRooms,
  resetBookings,
  randomOccupy
};