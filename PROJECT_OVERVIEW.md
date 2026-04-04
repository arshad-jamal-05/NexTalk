# Project Overview: NexTalk

## Project Purpose

NexTalk is a real-time video conferencing web application built for learning and practical application of full-stack web development. It allows users to register, log in, host or join video calls, chat live during meetings, share screens, and view their meeting history. The project demonstrates WebRTC peer-to-peer communication, Socket.io signaling, token-based authentication, and a modern React frontend.

---

## Main Technologies & Their Purpose

- **React.js (Vite)**: Frontend UI framework. Handles all views, state management, and user interactions.
- **React Router DOM**: Client-side routing between Landing, Auth, Home, VideoMeet, and History pages.
- **Material UI (MUI)**: Pre-built UI components (TextField, Button, IconButton, Badge, Snackbar, Card) and icons.
- **Tailwind CSS**: Utility-first CSS used alongside MUI for custom layouts and styling.
- **Axios**: HTTP client for communicating with the backend REST API.
- **Socket.io Client**: Real-time bidirectional communication with the backend for signaling and chat.
- **WebRTC**: Browser API for peer-to-peer audio/video streaming between participants.
- **Node.js + Express.js**: Backend server; handles REST API routes and hosts the Socket.io server.
- **MongoDB + Mongoose**: NoSQL database for storing users and meeting history.
- **bcrypt**: Hashes user passwords before storing them in the database.
- **crypto**: Generates secure random tokens for session management.
- **cors**: Allows the React frontend (different port) to communicate with the Express backend.
- **http-status**: Standardized HTTP status codes used in API responses.
- **nodemon**: Auto-restarts the backend server on file changes during development.

---

## API Connections: Authentication & Authorization

### Authentication

- Token-based (not JWT — uses `crypto.randomBytes` stored in MongoDB).
- Endpoints:
  - `POST /api/v1/users/register` — Create new user (hashes password with bcrypt).
  - `POST /api/v1/users/login` — Validate credentials, generate & return token.
  - `GET /api/v1/users/get_user` — Fetch user name/username from token.

### Authorization

- `withAuth` HOC in frontend checks `localStorage` for token before rendering protected pages.
- If no token found → redirect to `/auth`.
- Pages protected: `/home`, `/history`, `/:meetingCode`.

### Meeting History

- `POST /api/v1/users/add_to_activity` — Saves a meeting code + timestamp to user's history.
- `GET /api/v1/users/get_all_activity` — Returns all past meetings for the logged-in user.

---

## Folder & File Structure Explained

### Frontend (`/frontend/src/`)

- **`App.jsx`**: Root component. Sets up Router, AuthProvider, and all Routes.
- **`main.jsx`**: React DOM entry point; wraps App in StrictMode.
- **`App.css`**: Global styles — landing page layout, navbar, meet container.
- **`index.css`**: Base reset styles.

#### `contexts/`
- **`AuthContext.jsx`**: Global context provider. Manages all API calls (login, register, getUser, history). Exposes `handleLogin`, `handleRegister`, `getUserData`, `getHistoryOfUser`, `addToUserHistory` to all components.

#### `pages/`
- **`Landing.jsx`**: Public homepage. Shows branding, "Join as Guest" (random room), Register, Login links.
- **`Authentication.jsx`**: MUI-based full-page login/register form with background image.
- **`AuthCard.jsx`**: Tailwind-based compact login/register card (alternate UI).
- **`Home.jsx`**: Protected dashboard. Enter meeting code + join button. Shows History and Logout options. Wrapped with `withAuth`.
- **`VideoMeet.jsx`**: Core page. Pre-join lobby (camera preview + username/meeting code), then full meeting room with video grid, controls, and chat panel.
- **`History.jsx`**: Lists all past meetings (code + date) fetched from backend.

#### `utils/`
- **`withAuth.jsx`**: Higher-Order Component. Checks `localStorage` for token on mount; redirects to `/auth` if missing.

#### `style/`
- **`VideoMeet.css`**: Styles for meeting room — video container, chat panel, button bar, message bubbles.
- **`VideoMeet.module.css`**: CSS Module version of the same (kept for reference).

---

### Backend (`/backend/src/`)

- **`app.js`**: Express app entry point. Sets up middleware (cors, json, urlencoded), mounts routes, connects to MongoDB, starts HTTP server + Socket.io.

#### `controllers/`
- **`user.controller.js`**: Contains `login`, `register`, `getUserByToken`, `addToActivity`, `getAllActivity` functions. Handles all user-related business logic.
- **`socketManager.js`**: Socket.io logic. Manages `connections` (room → socket IDs), `messages` (room chat history), and `timeOnline`. Handles events: `join-call`, `signal`, `chat-message`, `disconnect`.

#### `models/`
- **`user.model.js`**: Mongoose schema for User — `name`, `username`, `password` (hashed), `token`.
- **`meeting.model.js`**: Mongoose schema for Meeting history — `user_id`, `meetingCode`, `date`.

#### `routes/`
- **`users.routes.js`**: Maps all `/api/v1/users/*` endpoints to controller functions.

---

## How the Pieces Fit Together

```
Browser (React)
    │
    ├── REST API (Axios) ──────► Express Routes ──► Controllers ──► MongoDB
    │
    └── WebSocket (Socket.io) ─► socketManager
                                      │
                                      ├── join-call   → adds socket to room
                                      ├── signal      → forwards WebRTC SDP/ICE
                                      ├── chat-message → broadcasts to room
                                      └── disconnect  → cleans up room & notifies peers

WebRTC (browser ↔ browser, P2P after signaling)
```

1. User opens `/auth` → logs in → token saved to `localStorage` → redirected to `/home`.
2. User enters meeting code on `/home` → navigated to `/:meetingCode`.
3. On `VideoMeet` page → if token exists → auto-fetch username from backend → skip username prompt.
4. Pre-join screen shows camera preview + meeting code field → user clicks Connect.
5. `connectToSocketServer()` called → socket connects → emits `join-call` with room URL.
6. Backend adds socket to room, notifies all peers via `user-joined`.
7. Each peer creates `RTCPeerConnection`, exchanges SDP offers/answers via `signal` events.
8. Video streams flow peer-to-peer via WebRTC. Chat goes through Socket.io.
9. On disconnect → backend cleans up room, emits `user-left` to remaining peers.

---

## Socket Event Reference

| Event | Emitted By | Received By | Purpose |
|-------|-----------|-------------|---------|
| `join-call` | Client | Server | Join a meeting room |
| `user-joined` | Server | All clients in room | Trigger WebRTC connection setup |
| `signal` | Client | Server → target client | Exchange SDP/ICE for WebRTC |
| `chat-message` | Client | Server → all in room | Send/receive chat |
| `user-left` | Server | All clients in room | Remove disconnected peer's video |

---

## Development Scripts

### Backend
```sh
npm run dev    # nodemon (auto-reload)
npm start      # node directly
```

### Frontend
```sh
npm run dev    # Vite dev server (HMR)
npm run build  # Production build
npm run lint   # ESLint check
```

---

## Environment Variables

Backend requires no `.env` currently (MongoDB URI is hardcoded in `app.js`).
For production, move these to `.env`:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
```

---

## Known Issues / TODOs (from codebase)

- `add_to_activity` and `get_all_activity` routes defined but missing controller binding in `users.routes.js`.
- `meeting.model.js` references `mongoose` without importing it (needs `import mongoose from "mongoose"`).
- `VideoMeet.jsx` uses deprecated `addStream` API — should be migrated to `addTrack`.
- `blackSilence` utility functions are defined inline repeatedly — should be extracted.
- `Authentication.jsx` has unused imports (`Avatar`, `FormControlLabel`, `Link`, `LockOutlinedIcon`, `Typography`).

---

## Notes

- Frontend runs on port `5173` (Vite default), backend on port `8000`.
- CORS is open (`*`) — restrict in production.
- Token auth is simple (random hex) — consider JWT for production.
- WebRTC works best on HTTPS in production (required for camera/mic permissions).

---

This file is for personal reference. Update it as new features are added.
