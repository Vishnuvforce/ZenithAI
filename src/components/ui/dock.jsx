import React from 'react';
import { 
  Home, 
  Search, 
  Sun, 
  Moon, 
  Cog, 
  User as UserIcon, 
  MessageSquarePlus, 
  CloudSun,
  ShieldCheck
} from 'lucide-react';

// Single Dock Icon button with tooltip & hover halo
function DockIcon({ icon: Icon, label, badge, onClick, active, color }) {
  return (
    <button
      type="button"
      className={`dock-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <Icon className="dock-icon" style={color ? { color } : {}} strokeWidth={2.1} />
      {badge && <span className="dock-badge">{badge}</span>}
      <span className="dock-tooltip">{label}</span>
    </button>
  );
}

export default function Dock({
  theme = 'dark',
  onToggleTheme,
  user,
  isGuest,
  onNewChat,
  onToggleSidebar,
  onOpenSettings,
  onOpenProfile,
  onCheckWeather
}) {
  return (
    <div className="dock-wrapper">
      <div className="dock-bar">
        {/* New Chat */}
        <DockIcon 
          icon={MessageSquarePlus} 
          label="New Chat" 
          onClick={onNewChat} 
          color="#10a37f"
        />

        {/* Search & Sidebar History */}
        <DockIcon 
          icon={Search} 
          label="Search Chats" 
          onClick={onToggleSidebar} 
        />

        {/* Live Weather */}
        <DockIcon 
          icon={CloudSun} 
          label="Live Weather" 
          onClick={onCheckWeather} 
          color="#38bdf8"
        />

        {/* Divider */}
        <span className="dock-divider" aria-hidden="true" />

        {/* Theme Toggle (Light / Dark Mode) */}
        <DockIcon 
          icon={theme === 'dark' ? Sun : Moon} 
          label={theme === 'dark' ? "Light Mode" : "Dark Mode"} 
          onClick={onToggleTheme} 
          color={theme === 'dark' ? "#facc15" : "#818cf8"}
        />

        {/* Settings Modal */}
        <DockIcon 
          icon={Cog} 
          label="Settings" 
          onClick={onOpenSettings} 
        />

        {/* Profile / Account Status */}
        <DockIcon 
          icon={isGuest ? ShieldCheck : UserIcon} 
          label={isGuest ? "Guest Mode" : (user?.email?.split('@')[0] || "Profile")} 
          badge={isGuest ? "G" : "●"}
          onClick={onOpenProfile} 
          color={isGuest ? "#facc15" : "#10a37f"}
        />
      </div>
    </div>
  );
}
