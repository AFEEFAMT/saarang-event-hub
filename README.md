# Saarang Event Hub

A full-stack event registration platform for Saarang. Browse events, register for tickets, and manage your schedule with a secure admin dashboard for organizers.

## Live Demo

- **Frontend:** https://saarang-event-hub-pied.vercel.app/
- **Backend:** https://saarang-api.onrender.com

---

## Tech Stack

- **Frontend:** React 19, Vite, React Router DOM v7, Axios
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs

---

## Architecture

```
Frontend (Vercel) → Backend API (Render) → Database (MongoDB Atlas)
```

---

## Features

- JWT-based authentication with role-based access (user / admin)
- Browse, search, and filter events by category and day with pagination
- Register and unregister from events with live capacity tracking
- Duplicate registration prevention enforced at both route and database level (unique index)
- Atomic counter updates on registration to prevent race conditions
- My Registrations page to track your signed-up events
- Admin panel to create and delete events (admin role required)
- Environment-aware API routing via `VITE_API_URL`

---

## Local Setup

### Prerequisites

- Node.js installed on your machine
- A MongoDB Atlas account (free tier works)

### Clone the Repository

```bash
git clone https://github.com/yourusername/saarang-event-hub.git
cd saarang-event-hub
```

### Backend Setup

Navigate to the `api` directory and install the required dependencies:

```bash
cd api
npm install
```

Create a `.env` file inside the `/api` directory with your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_string
CLIENT_URL=http://localhost:5173
```

Seed the database with sample events and test accounts, then start the development server:

```bash
npm run seed
npm run dev
```

### Frontend Setup

Open a new terminal window, navigate back to the project root, then go into the `client` directory and start the frontend:

```bash
cd client
npm install
npm run dev
```

> **Note:** The app runs at `http://localhost:5173`. For production deployment, set `VITE_API_URL` in your Vercel environment variables to point to your live Render backend URL.

---

## Test Accounts

These credentials are created automatically when you run `npm run seed`:

| Role      | Email             | Password  |
| --------- | ----------------- | --------- |
| **Admin** | admin@saarang.org | admin123  |
| **User**  | user@test.com     | user123   |

---

## API Routes

| Method | Route                        | Auth  | Description                              |
| ------ | ---------------------------- | ----- | ---------------------------------------- |
| POST   | `/api/auth/signup`           | No    | Register a new user                      |
| POST   | `/api/auth/login`            | No    | Login and receive a token                |
| GET    | `/api/events`                | No    | List events (supports category, day, search, page) |
| GET    | `/api/events/:id`            | No    | Get a single event                       |
| POST   | `/api/events`                | Admin | Create a new event                       |
| DELETE | `/api/events/:id`            | Admin | Delete an event and its registrations    |
| GET    | `/api/registrations/my`      | User  | Get your registered events               |
| POST   | `/api/registrations/:eventId`| User  | Register for an event                    |
| DELETE | `/api/registrations/:eventId`| User  | Unregister from an event                 |
