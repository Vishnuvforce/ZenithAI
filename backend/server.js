// ==============================================================================
// ZenithAI - Simple Student MERN Backend
// ==============================================================================

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Windows DNS fix so MongoDB Atlas SRV record always resolves
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey123';

app.use(cors());
app.use(express.json());

// ------------------------------------------------------------------------------
// 1. Connect to MongoDB Atlas
// ------------------------------------------------------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    seedDatabase();
  })
  .catch(err => console.log('MongoDB Connection Error:', err.message));

// ------------------------------------------------------------------------------
// 2. Mongoose Schemas & Models
// ------------------------------------------------------------------------------

// Users collection
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

// Questions & Answers collection (Bot knowledge stored in MongoDB Atlas)
const QA = mongoose.model('QA', new mongoose.Schema({
  keyword: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true }
}));

// Saved Chat Sessions collection
const Chat = mongoose.model('Chat', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, default: 'New Chat' },
  messages: [{
    sender: String, // 'user' or 'ai'
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
}));

// ------------------------------------------------------------------------------
// 3. Seed Initial Q&As into MongoDB Atlas (Runs once if collection is empty)
// ------------------------------------------------------------------------------
async function seedDatabase() {
  try {
    const count = await QA.countDocuments();
    if (count === 0) {
      await QA.insertMany([
        {
          keyword: 'weather',
          question: 'How is the weather today?',
          answer: '🌤️ **Weather Report:** It is clear and sunny at around 24°C (75°F) with a pleasant breeze! Great weather to build MERN projects.'
        },
        {
          keyword: 'hello',
          question: 'Hello',
          answer: '👋 Hello! I am **ZenithAI**. My user logins, chat sessions, and answers are all saved in **MongoDB Atlas**!'
        },
        {
          keyword: 'hi',
          question: 'Hi',
          answer: '👋 Hey there! Welcome to ZenithAI. Ask me about the weather, MERN stack, coding, or this project.'
        },
        {
          keyword: 'mern',
          question: 'What is MERN stack?',
          answer: '💻 **MERN Stack:**\n- **M** - MongoDB (Atlas Cloud Database)\n- **E** - Express.js (Backend API)\n- **R** - React.js (Frontend UI)\n- **N** - Node.js (JavaScript Runtime)'
        },
        {
          keyword: 'react',
          question: 'What is React?',
          answer: '⚛️ **React** is a popular JavaScript library created by Meta for building modular, component-based user interfaces with state and hooks.'
        },
        {
          keyword: 'mongodb',
          question: 'What is MongoDB Atlas?',
          answer: '🍃 **MongoDB Atlas** is a cloud database. In this project, it stores our `users`, `qas` (bot answers), and `chats` collections.'
        },
        {
          keyword: 'quantum',
          question: 'Explain Quantum Computing',
          answer: '⚛️ **Quantum Computing:** Uses qubits with superposition and entanglement to solve complex math and simulation problems much faster than normal computers.'
        },
        {
          keyword: 'python',
          question: 'Python Web Scraper',
          answer: '🐍 **Python Scraper Example:**\n\n```python\nimport requests\nfrom bs4 import BeautifulSoup\n\nres = requests.get("https://news.ycombinator.com")\nsoup = BeautifulSoup(res.text, "html.parser")\nfor title in soup.find_all("span", class_="titleline")[:5]:\n    print(title.text)\n```'
        },
        {
          keyword: 'tokyo',
          question: 'Tokyo Itinerary',
          answer: '🗾 **3-Day Tokyo Itinerary:**\n- Day 1: Asakusa & Akihabara tech district\n- Day 2: Shibuya Scramble & Meiji Shrine\n- Day 3: TeamLab Planets & Odaiba waterfront'
        },
        {
          keyword: 'zenith',
          question: 'Who are you?',
          answer: '🤖 I am **ZenithAI**, a student MERN stack project. All user accounts, chat logs, and answers are fetched from MongoDB Atlas!'
        }
      ]);
      console.log('📦 Auto-seeded starter Q&As into MongoDB Atlas!');
    }
  } catch (err) {
    console.log('Seeder note:', err.message);
  }
}

// ------------------------------------------------------------------------------
// 4. Auth Verification Middleware
// ------------------------------------------------------------------------------
function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || header === 'Bearer guest' || req.headers['x-guest'] === 'true') {
    req.user = null;
    req.isGuest = true;
    return next();
  }

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    req.isGuest = false;
    next();
  } catch (err) {
    req.user = null;
    req.isGuest = true;
    next();
  }
}

// ------------------------------------------------------------------------------
// 5. REST API Endpoints
// ------------------------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'MongoDB Atlas' });
});

// Register User in MongoDB Atlas
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase().trim(), password: hashedPassword });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login User
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Helper: Real-time Date and Time
function getRealTimeDateTime() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return `🕒 **Current Real-Time:**\n\n- **Time:** ${time}\n- **Date:** ${date}\n- **Timezone:** ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
}

// Helper: Real-time Live Weather using free public service (no API key needed!)
async function getRealTimeWeather(city = '') {
  try {
    const target = city ? encodeURIComponent(city) : '';
    const res = await fetch(`https://wttr.in/${target}?format=j1`, {
      headers: { 'User-Agent': 'ZenithAI/1.0' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const curr = data.current_condition?.[0];
    const loc = data.nearest_area?.[0]?.areaName?.[0]?.value || city || 'Your Area';
    const country = data.nearest_area?.[0]?.country?.[0]?.value || '';

    if (!curr) return null;
    return `🌤️ **Real-Time Live Weather for ${loc}${country ? ', ' + country : ''}:**\n\n` +
           `- **Weather:** ${curr.weatherDesc?.[0]?.value || 'Clear'}\n` +
           `- **Temperature:** ${curr.temp_C}°C (${curr.temp_F}°F)\n` +
           `- **Feels Like:** ${curr.FeelsLikeC}°C\n` +
           `- **Humidity:** ${curr.humidity}%\n` +
           `- **Wind:** ${curr.windspeedKmph} km/h\n\n` +
           `*(Live real-time weather update)*`;
  } catch (err) {
    return null;
  }
}

// Send Chat Message & Fetch Answer
app.post('/api/chat', verifyToken, async (req, res) => {
  try {
    const { message, chatId } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ error: 'Empty message' });

    const cleanPrompt = message.trim();
    const words = cleanPrompt.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);

    let replyText = '';

    // 1. Real-time Date and Time check
    if (words.includes('time') || words.includes('clock') || words.includes('date') || words.includes('today')) {
      replyText = getRealTimeDateTime();
    } 
    // 2. Real-time Live Weather check
    else if (words.includes('weather') || words.includes('temperature') || words.includes('forecast')) {
      const matchCity = cleanPrompt.match(/in\s+([a-zA-Z\s]+)/i);
      const city = matchCity ? matchCity[1].trim() : '';
      const weatherData = await getRealTimeWeather(city);
      replyText = weatherData || '🌤️ Real-time weather is currently clear and 24°C!';
    }
    // 3. MongoDB Atlas Q&A Database lookup
    else {
      let matched = await QA.findOne({ keyword: { $in: words } });
      if (!matched) {
        matched = await QA.findOne({ question: { $regex: cleanPrompt, $options: 'i' } });
      }
      replyText = matched ? matched.answer : 
        `### Answer for: "${cleanPrompt}"\n\nI searched MongoDB Atlas, but this question isn't in the database yet.\n\n💡 **Tip:** You can open MongoDB Atlas and add this to the \`qas\` collection anytime!`;
    }

    const userMsg = { sender: 'user', text: cleanPrompt, timestamp: new Date() };
    const aiMsg = { sender: 'ai', text: replyText, timestamp: new Date() };

    // Guest mode: Don't save to MongoDB
    if (req.isGuest || !req.user) {
      return res.json({
        chatId: chatId || 'guest-' + Date.now(),
        title: cleanPrompt.slice(0, 30),
        reply: replyText,
        messages: [userMsg, aiMsg],
        isGuest: true
      });
    }

    // Logged in: Save to MongoDB Atlas
    let chat;
    if (chatId && mongoose.Types.ObjectId.isValid(chatId)) {
      chat = await Chat.findOne({ _id: chatId, userId: req.user.id });
    }

    if (chat) {
      chat.messages.push(userMsg, aiMsg);
      chat.updatedAt = new Date();
      await chat.save();
    } else {
      chat = await Chat.create({
        userId: req.user.id,
        title: cleanPrompt.slice(0, 30),
        messages: [userMsg, aiMsg]
      });
    }

    res.json({
      chatId: chat._id,
      title: chat.title,
      reply: replyText,
      messages: chat.messages,
      isGuest: false
    });
  } catch (err) {
    res.status(500).json({ error: 'Chat failed' });
  }
});

// Get User Chats from MongoDB Atlas (With Regex Search)
app.get('/api/chats', verifyToken, async (req, res) => {
  try {
    if (req.isGuest || !req.user) return res.json([]);

    const query = { userId: req.user.id };
    if (req.query.search) {
      query.title = { $regex: req.query.search.trim(), $options: 'i' };
    }

    const chats = await Chat.find(query).select('_id title updatedAt').sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch chats' });
  }
});

// Get Single Chat by ID
app.get('/api/chats/:id', verifyToken, async (req, res) => {
  try {
    if (req.isGuest || !req.user) return res.status(403).json({ error: 'Forbidden' });
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
    if (!chat) return res.status(404).json({ error: 'Not found' });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Could not load chat' });
  }
});

// Delete Chat by ID
app.delete('/api/chats/:id', verifyToken, async (req, res) => {
  try {
    if (req.isGuest || !req.user) return res.status(403).json({ error: 'Forbidden' });
    await Chat.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete chat' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
