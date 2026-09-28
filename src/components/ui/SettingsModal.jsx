import React from 'react';
import { X, Moon, Sun, Database, Server, RefreshCw } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  apiUrl
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Settings</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Appearance / Theme */}
          <div className="setting-row">
            <div>
              <span className="setting-title">Appearance</span>
              <p className="setting-desc">Switch between Dark and Light mode</p>
            </div>
            <button className="theme-toggle-btn" onClick={onToggleTheme}>
              {theme === 'dark' ? (
                <>
                  <Sun size={15} color="#facc15" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={15} color="#818cf8" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Database Connection */}
          <div className="setting-row">
            <div>
              <span className="setting-title">Cloud Database</span>
              <p className="setting-desc">MongoDB Atlas (zenithChatbotDB)</p>
            </div>
            <span className="status-pill connected">
              <Database size={13} />
              <span>Connected</span>
            </span>
          </div>

          {/* Backend API */}
          <div className="setting-row">
            <div>
              <span className="setting-title">Backend Server</span>
              <p className="setting-desc">{apiUrl}</p>
            </div>
            <span className="status-pill online">
              <Server size={13} />
              <span>Online</span>
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose} style={{ width: 'auto', padding: '8px 20px' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
