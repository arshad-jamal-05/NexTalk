# NexTalk 🎥

NexTalk is a next-generation real-time video conferencing web application. It enables users to join or host video calls, chat in-meeting, share screens, and track their meeting history — all with a clean, modern UI and secure authentication.

---

## ✨ Features

- **User Authentication**: Secure signup, login, and logout with token-based auth.
- **Video Conferencing**: Real-time peer-to-peer video/audio calls using WebRTC.
- **In-Meeting Chat**: Live chat room inside the meeting with message history.
- **Screen Sharing**: Share your screen with other participants.
- **Meeting History**: Track and view all past meetings from your dashboard.
- **Guest Access**: Join any meeting as a guest directly from the landing page.
- **Auto Username**: Logged-in users are auto-identified — no manual name entry needed.
- **Meeting Code Join**: Enter a specific meeting code on the pre-join screen to join any room.
- **Mic & Camera Controls**: Toggle audio/video on the fly during a call.
- **Responsive UI**: Clean layout with MUI components and custom CSS.
- **Protected Routes**: HOC-based route protection using `withAuth`.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **React Router DOM** — client-side routing
- **Material UI (MUI)** — UI components and icons
- **Socket.io Client** — real-time communication
- **Axios** — HTTP requests
- **Tailwind CSS** — utility-based styling

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB + Mongoose** — database and ODM
- **Socket.io** — WebSocket server for signaling and chat
- **bcrypt** — password hashing
- **crypto** — token generation
- **cors** — cross-origin resource sharing

---

## 📁 Folder Structure

```
nexttalk/
│
├── frontend/
│   ├── public/                 # Static assets (logo, images)
│   ├── src/
│   │   ├── assets/             # Images used in components
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx # Global auth state and API calls
│   │   ├── pages/
│   │   │   ├── Landing.jsx     # Landing/home page
│   │   │   ├── Authentication.jsx  # MUI-based login/register
│   │   │   ├── AuthCard.jsx    # Tailwind-based login/register card
│   │   │   ├── Home.jsx        # Dashboard after login
│   │   │   ├── VideoMeet.jsx   # Main video conferencing page
│   │   │   └── History.jsx     # Meeting history page
│   │   ├── utils/
│   │   │   └── withAuth.jsx    # HOC for route protection
│   │   ├── style/
│   │   │   ├── VideoMeet.css
│   │   │   └── VideoMeet.module.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── user.controller.js   # Auth logic
│   │   │   └── socketManager.js     # Socket.io signaling & chat
│   │   ├── models/
│   │   │   ├── user.model.js        # User schema
│   │   │   └── meeting.model.js     # Meeting history schema
│   │   ├── routes/
│   │   │   └── users.routes.js      # API routes
│   │   └── app.js                   # Express app entry point
│   └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### Backend Setup

```sh
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```sh
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/v1/users/register` | Register new user |
| POST | `/api/v1/users/login` | Login and get token |
| GET | `/api/v1/users/get_user` | Get user info by token |
| POST | `/api/v1/users/add_to_activity` | Add meeting to history |
| GET | `/api/v1/users/get_all_activity` | Get meeting history |

---

## 🔐 Authentication Flow

1. User registers/logs in via `/auth`
2. On successful login, a `crypto` token is saved in the DB and returned to frontend
3. Token is stored in `localStorage`
4. Protected routes check `localStorage` for token via `withAuth` HOC
5. On VideoMeet page, token is used to auto-fetch username from profile

---

## 🔄 Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-call` | Client → Server | Join a meeting room |
| `user-joined` | Server → Client | Notify all users of new joiner |
| `signal` | Both | WebRTC signaling (SDP/ICE) |
| `chat-message` | Both | Send/receive chat messages |
| `user-left` | Server → Client | Notify when user disconnects |

---

## 🔮 Future Plans

- Add video recording and download
- Raise hand / emoji reactions in meeting
- Waiting room / meeting password protection
- User profile editing
- Deployment on cloud (Render/Vercel)
- Email notifications for meeting invites
- Mobile app using React Native
- Admin panel for meeting analytics

---

## 📬 Contact

- Email: [bharatamir4321@gmail.com](mailto:bharatamir4321@gmail.com)
- Instagram: [@decent_arshad](https://www.instagram.com/decent_arshad/)
- LinkedIn: [ARSHAD JAMAL](https://www.linkedin.com/in/arshad-jamal-/)

---

**NexTalk** — Next generation video conferencing. Connect clearly, anywhere.
