# Meeting Room Booking System - Server

## Overview

A full-stack meeting room booking system that allows users to book, manage, and cancel room reservations, while admins can manage rooms and bookings efficiently.

## Features

- Users can view available meeting rooms
- Users can book, manage, and cancel their bookings
- Admins can add, update, and delete meeting rooms
- Admins can manage all bookings (approve, reject, or delete)
- Pagination support for booking management

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Hosting:** (Specify if using a cloud provider like Render, Vercel, etc.)

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/Abubokkor98/meeting-room-booking-server
```

2. Navigate to the project directory:
   ```bash
   cd meeting-room-booking-server
   ```
3. Install dependencies:

   ```bash
   npm install
   ```

4. Setup Environment Variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```plaintext
       DB_USER=your_db_user
       DB_PASSWORD=your_db_password
   ```
5. Run the Server:
   ```bash
   npm start or nodemon index.js
   ```
6. the server will run on `http://localhost:5000`.

---

## API Endpoints

### Rooms

- **Get all rooms**: `GET /rooms`
- **Get room by ID**: `GET /rooms/:id`

### User Bookings

- **Get user bookings**: `GET /bookings?email={userEmail}`
- **Book a room**: `POST /bookings`
- **Cancel a booking**: `DELETE /bookings/:id?email={userEmail}`

### Admin Bookings

- **Get all bookings with pagination**: `GET /admin/bookings?page={page}&limit={limit}`
- **Update booking status**: `PATCH /admin/bookings/:id`
- **Delete a booking**: `DELETE /admin/bookings/:id`

### Admin Rooms Management

- **Add a new room**: `POST /admin/rooms`
- **Update a room**: `PUT /admin/rooms/:roomId`
- **Delete a room**: `DELETE /admin/rooms/:roomId`

---

### 🗃️ Seed Data for Testing

### Example of a Meeting Room:

```json
{
  "_id": "room_id_here",
  "name": "Room Name",
  "photo": "room_image_url",
  "capacity": "50",
  "location": "Room Location",
  "amenities": ["Projector", "Whiteboard"],
  "pricePerHour": "500",
  "availability": {
    "startTime": "09:00",
    "endTime": "18:00"
  },
  "description": "Room description here"
}
```

```json
{
  "_id": "booking_id_here",
  "userEmail": "user_email_here",
  "roomName": "Room Name",
  "roomImage": "room_image_url",
  "facility": ["WiFi"],
  "date": "2025-03-09",
  "startTime": "10:00",
  "endTime": "12:00",
  "totalPrice": "1000",
  "status": "confirmed"
}
```

---

### **🙋‍♂️ About the Developer**

Built with 💻 and passion by **Abu Bokkor Siddik**.

- **GitHub**: [Abubokkor98](https://github.com/Abubokkor98)
- **LinkedIn**: [Your LinkedIn Profile](https://www.linkedin.com/in/abubokkor)

