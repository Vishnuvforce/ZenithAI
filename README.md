# 🌟 ZenithAI v2.5 — Full-Stack MERN Conversational Platform

An intelligent AI chatbot running on the **MERN Stack** (MongoDB Atlas, Express.js, React.js 18, Node.js) featuring pure Vanilla CSS, dual-theme engine (Dark & Light), real-time weather & time integrations, and isolated frontend/backend directories for seamless cloud deployment.

---

## 🚀 Features

- **Cloud Database (MongoDB Atlas):**
  - `users`: User authentication with bcrypt password hashing and 24h JWT tokens.
  - `qas`: Pre-stored questions, keywords, and bot replies fetched directly from MongoDB Atlas with auto-seeding.
  - `chats`: Conversation threads and chat histories saved under user accounts.
- **Real-Time Data:**
  - **Live Weather:** Fetches live real-time weather and temperature for any city using a public REST API.
  - **Live Time & Date:** Accurate real-time system clock and date reporting.
- **Modern UI / UX:**
  - Integrated Dock toolbar inside the Navbar with dynamic Light/Dark mode contrast synchronization.
  - Interactive HTML5 particle canvas animation backdrop on the landing page.
  - 21st.dev `BorderBeam` animated glowing chat bar on input.
  - Collapsible history sidebar with real-time regex search.
  - Settings & Profile modals with live cloud connection indicators.

---

## 📁 Project Architecture

```
ZenithAI/
├── .gitignore                   # Ignores .env and node_modules
├── package.json                 # Monorepo scripts (dev, build, server, install:all)
├── package-lock.json            # Root dependency lockfile
│
├── frontend/                    # FRONTEND (React 18 + Vite)
│   ├── package.json             # Frontend dependencies & Vite scripts
│   ├── vite.config.js           # Port 3000 config
│   ├── index.html               # Single-page application entry HTML
│   └── src/                     # React source files
│       ├── main.jsx             # React root with ErrorBoundary
│       ├── App.jsx              # App controller, auth state & particle canvas
│       ├── App.css              # Custom Vanilla CSS & theme engine
│       └── components/          # Navbar, Sidebar, ChatWindow, and UI modals
│
└── backend/                     # BACKEND (Express / Node.js)
    ├── package.json             # Backend dependencies (express, mongoose, jwt, bcrypt)
    └── server.js                # Express API router & Atlas schemas (User, QA, Chat)
```

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Vishnuvforce/ZenithAI.git
cd ZenithAI
```

### 2. Install Dependencies
```bash
# Install both frontend and backend dependencies in one command:
npm run install:all
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Project

- **Start the Backend:**
  ```bash
  npm run server
  ```
- **Start the Frontend:**
  ```bash
  npm run dev
  ```
  Open `http://localhost:3000` in your browser.

---

## 🌐 Easy Deployment Guide

- **Frontend Deployment (Vercel / Netlify):**
  - **Root Directory:** `frontend`
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
  - **Environment Variables:** `VITE_API_URL=https://your-backend.onrender.com/api`

- **Backend Deployment (Render / Railway):**
  - **Root Directory:** `backend`
  - **Build Command:** `npm install`
  - **Start Command:** `node server.js`
  - **Environment Variables:** `MONGO_URI`, `JWT_SECRET`, `PORT=5000`
