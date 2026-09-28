import React from 'react';

export default function Navbar({ user, isGuest, onLogout }) {
  return (
    <header className="navbar">
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

      <div className="nav-right">
        {/* Account status badge */}
        <div className={`nav-badge ${isGuest ? 'guest' : ''}`}>
          <span className="dot" />
          <span>{isGuest ? 'Guest User' : user?.email}</span>
        </div>

        {/* Exit or Logout button */}
        <button className="btn-logout" onClick={onLogout} title="Exit session">
          <span>{isGuest ? 'Exit' : 'Log out'}</span>
        </button>
      </div>
    </header>
  );
}
