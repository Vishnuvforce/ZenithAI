import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import SettingsModal from './components/ui/SettingsModal.jsx';
import ProfileModal from './components/ui/ProfileModal.jsx';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export default function App() {
  // Theme State: 'dark' | 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('zenith_theme') || 'dark');

  // Apply data-theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zenith_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Session States
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('isGuest') === 'true');

  // View state: 'landing' | 'auth' | 'workspace'
  const [view, setView] = useState(() => (localStorage.getItem('token') || localStorage.getItem('isGuest') === 'true') ? 'workspace' : 'landing');

  // Auth Form State
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Chat States
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Sidebar toggle state passed down
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const canvasRef = useRef(null);

  // --------------------------------------------------------------------------
  // Canvas Particles Background
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (view === 'workspace') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let frameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const count = 50;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = theme === 'dark' ? 'rgba(16, 163, 127, 0.6)' : 'rgba(5, 150, 105, 0.5)';
        ctx.fill();

        // Draw Lines between close dots
        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = theme === 'dark' 
              ? `rgba(16, 163, 127, ${0.2 * (1 - dist / 110)})`
              : `rgba(5, 150, 105, ${0.2 * (1 - dist / 110)})`;
            ctx.stroke();
          }
        }
      }
      frameId = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(frameId);
  }, [view, theme]);

  // --------------------------------------------------------------------------
  // Auth Functions
  // --------------------------------------------------------------------------
  const openAuth = (mode) => {
    setAuthMode(mode);
    setError('');
    setView('auth');
  };

  const handleGuest = () => {
    setIsGuest(true);
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.setItem('isGuest', 'true');
    setView('workspace');
    handleNewChat();
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('Email and password required');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    const endpoint = authMode === 'signup' ? `${API_URL}/register` : `${API_URL}/login`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      setToken(data.token);
      setUser(data.user);
      setIsGuest(false);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.removeItem('isGuest');
      setView('workspace');
      handleNewChat();
    } catch {
      setError('Cannot connect to server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setIsGuest(false);
    localStorage.clear();
    setView('landing');
    setMessages([]);
    setActiveChatId(null);
  };

  // --------------------------------------------------------------------------
  // Chat Functions
  // --------------------------------------------------------------------------
  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  const handleSelectChat = async (id) => {
    if (isGuest || !token) return;
    try {
      const res = await fetch(`${API_URL}/chats/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setActiveChatId(data._id);
      setMessages(data.messages || []);
    } catch (err) {
      console.log('Error loading chat:', err);
    }
  };

  const handleSendMessage = async (promptText) => {
    if (!promptText || isSending) return;

    // Show user message immediately
    const userMsg = { sender: 'user', text: promptText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsSending(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (!isGuest && token) headers['Authorization'] = `Bearer ${token}`;
      else headers['x-guest'] = 'true';

      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: promptText, chatId: activeChatId })
      });

      const data = await res.json();
      const aiMsg = { sender: 'ai', text: data.reply, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);

      if (data.chatId && !activeChatId) setActiveChatId(data.chatId);
      setRefreshTrigger(prev => prev + 1);
    } catch {
      setMessages(prev => [...prev, { sender: 'ai', text: '⚠️ Network error: Could not reach backend.' }]);
    } finally {
      setIsSending(false);
    }
  };

  // --------------------------------------------------------------------------
  // View Rendering
  // --------------------------------------------------------------------------
  if (view === 'workspace') {
    return (
      <div className="app-layout">
        {/* Global Navbar with integrated Dock */}
        <Navbar 
          user={user} 
          isGuest={isGuest} 
          theme={theme}
          onToggleTheme={toggleTheme}
          onNewChat={handleNewChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onCheckWeather={() => handleSendMessage("How is the weather today?")}
          onLogout={handleLogout} 
        />

        {/* Main Workspace Body */}
        <div className="main-content">
          <Sidebar
            isGuest={isGuest}
            token={token}
            apiUrl={API_URL}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            refreshTrigger={refreshTrigger}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(prev => !prev)}
          />
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isSending={isSending}
            isGuest={isGuest}
            user={user}
          />
        </div>

        {/* Settings Modal Dialog */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
          apiUrl={API_URL}
        />

        {/* Profile Modal Dialog */}
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
          isGuest={isGuest}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  return (
    <div className="landing">
      <canvas ref={canvasRef} className="canvas" />

      {/* Floating Theme Switcher on Landing Page */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 50 }}>
        <button 
          className="floating-theme-btn" 
          onClick={toggleTheme} 
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} color="#facc15" /> : <Moon size={18} color="#4f46e5" />}
        </button>
      </div>

      <div className="landing-box">
        {view === 'landing' ? (
          <>
            <div className="logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <h1 className="title">Welcome to ZenithAI</h1>

            <div className="actions">
              <button className="btn-primary" onClick={() => openAuth('login')}>Log in</button>
              <button className="btn-secondary" onClick={() => openAuth('signup')}>Sign up</button>
              <button className="btn-link" onClick={handleGuest}>Explore as guest ➔</button>
            </div>
          </>
        ) : (
          <div>
            <button className="back-btn" onClick={() => setView('landing')}>← Back</button>
            <h2 className="form-title">{authMode === 'login' ? 'Log In' : 'Sign Up'}</h2>
            <p className="form-subtitle">
              {authMode === 'login' ? 'Enter credentials to load saved chats' : 'Sign up to save chats to MongoDB'}
            </p>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleAuthSubmit}>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Please wait...' : (authMode === 'login' ? 'Continue' : 'Sign Up')}
              </button>
            </form>

            <div className="switch-auth">
              {authMode === 'login' ? (
                <>Don't have an account? <button onClick={() => setAuthMode('signup')}>Sign up</button></>
              ) : (
                <>Already have an account? <button onClick={() => setAuthMode('login')}>Log in</button></>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
