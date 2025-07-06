// server/db.js

// In-memory "DB" for rooms
let rooms = [];

module.exports = {
  getRooms: () => rooms,
  setRooms: (newRooms) => {
    rooms = newRooms;
  }
};