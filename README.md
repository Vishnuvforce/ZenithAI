# 🌟 ZenithAI — Full-Stack MERN Chatbot

AI chatbot that runs on the **MERN Stack** (MongoDB Atlas, Express.js, React.js, Node.js) instead of Python. Responsive, modern, clean, and simple. Perfect for beginner and student-level projects!

---

## 🚀 Features

- **Cloud Database (MongoDB Atlas):**
  - `users`: User authentication with bcrypt password hashing and 24h JWT tokens.
  - `qas`: Pre-stored questions, keywords, and bot replies fetched directly from MongoDB Atlas.
  - `chats`: Conversation threads and chat histories saved under user accounts.
- **Real-Time Data:**
  - **Live Weather:** Fetches live real-time weather and temperature for any city using a public REST API.
  - **Live Time & Date:** Accurate real-time system clock and date reporting.
- **Modern UI / UX:**
  - Interactive HTML5 particle canvas animation backdrop.
  - ChatGPT-style frosted glass layout mask with seamless Guest mode bypass.
  - Collapsible history sidebar with real-time regex search.
  - Upward arrow (`↑`) submit symbol with code syntax blocks and one-click copy.

---

## 📁 Project Architecture

```
ZenithAI/
├── .env.example                 # Example configuration template
├── .gitignore                   # Ignores .env and node_modules
├── package.json                 # Global frontend dependencies & scripts
├── vite.config.js               # Vite configurations
├── index.html                   # React HTML shell
├── src/                         # FRONTEND (React)
│   ├── main.jsx                 # React DOM initializer
│   ├── App.jsx                  # Main workspace wrapper & router
│   ├── App.css                  # Custom styling
│   └── components/
│       ├── Navbar.jsx           # Global top navigation bar
│       ├── Sidebar.jsx          # Collapsible history search panel
│       └── ChatWindow.jsx       # Main messaging window
└── backend/                     # BACKEND (Express / Node)
    ├── server.js                # Self-contained backend & MongoDB Atlas models
    └── package.json             # Backend dependencies
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
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
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
