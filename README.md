# 🏨 Hotel Room Reservation System — Server

This is the **Node.js backend** for the Hotel Room Reservation System. It exposes a set of APIs that allow users to book rooms, reset bookings, and generate random room occupancy.

> 🔗 **Live URL**: [https://hotel-reservation-jjtt.onrender.com](https://hotel-reservation-jjtt.onrender.com)

🕒 **Note**: This server is hosted on **Render Free Tier**, which goes to sleep after 15 minutes of inactivity. Please allow **10–30 seconds** for the server to wake up when first accessed.

---

## 📦 API Endpoints

| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| GET    | `/api/rooms`      | Get list of available rooms          |
| POST   | `/api/book`       | Book `n` rooms based on proximity    |
| POST   | `/api/reset`      | Reset all bookings                   |
| POST   | `/api/random`     | Randomly book a set of rooms         |

---

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **CORS** (enabled for all origins)
- **In-memory room storage** (no database used)

---

## 🚀 Getting Started (Local Development)

1. **Clone the repository**

```bash
git clone https://github.com/rht16/hotel-reservation.git
cd hotel-reservation-server
