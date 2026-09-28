import React from 'react';
import { 
  MessageSquarePlus, 
  CloudSun, 
  Sun, 
  Moon, 
  Cog, 
  User as UserIcon, 
  LogOut,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({
  user,
  isGuest,
  theme,
  onToggleTheme,
  onNewChat,
  onOpenSettings,
  onOpenProfile,
  onCheckWeather,
  onLogout
}) {
  return (
    <header className="navbar">
      {/* Brand Section */}
      <div className="nav-left">
        <div className="nav-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        <span className="nav-title">ZenithAI Workspace</span>
        <span className="nav-pill">v2.5</span>
      </div>

      {/* Dock Integrated Directly into Navbar */}
      <div className="nav-dock">
        {/* New Chat */}
        <button 
          className="dock-item" 
          onClick={onNewChat} 
          title="New Chat"
        >
          <MessageSquarePlus size={17} color={theme === 'dark' ? "#10a37f" : "#059669"} />
          <span className="dock-tooltip">New Chat</span>
        </button>

        {/* Live Weather */}
        <button 
          className="dock-item" 
          onClick={onCheckWeather} 
          title="Live Weather"
        >
          <CloudSun size={17} color={theme === 'dark' ? "#38bdf8" : "#0284c7"} />
          <span className="dock-tooltip">Live Weather</span>
        </button>

        {/* Divider */}
        <span className="nav-dock-divider" />

        {/* Light / Dark Mode Toggle */}
        <button 
          className="dock-item" 
          onClick={onToggleTheme} 
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? (
            <Sun size={17} color="#facc15" />
          ) : (
            <Moon size={17} color="#4f46e5" />
          )}
          <span className="dock-tooltip">{theme === 'dark' ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Settings Modal */}
        <button 
          className="dock-item" 
          onClick={onOpenSettings} 
          title="Settings"
        >
          <Cog size={17} color={theme === 'dark' ? "#a1a1aa" : "#475569"} />
          <span className="dock-tooltip">Settings</span>
        </button>

        {/* Profile Button */}
        <button 
          className={`dock-item profile-dock-btn ${isGuest ? 'guest' : ''}`}
          onClick={onOpenProfile} 
          title="User Profile"
        >
          {isGuest ? (
            <ShieldCheck size={17} color={theme === 'dark' ? "#facc15" : "#d97706"} />
          ) : (
            <UserIcon size={17} color={theme === 'dark' ? "#10a37f" : "#059669"} />
          )}
          <span className="profile-label">
            {isGuest ? 'Guest' : (user?.email?.split('@')[0] || 'Profile')}
          </span>
          <span className="dock-tooltip">Profile</span>
        </button>

        {/* Divider */}
        <span className="nav-dock-divider" />

        {/* Logout */}
        <button 
          className="dock-item logout" 
          onClick={onLogout} 
          title={isGuest ? "Exit Guest Mode" : "Log Out"}
        >
          <LogOut size={16} color={theme === 'dark' ? "#f87171" : "#dc2626"} />
          <span className="dock-tooltip">{isGuest ? "Exit" : "Log out"}</span>
        </button>
      </div>
    </header>
  );
}
