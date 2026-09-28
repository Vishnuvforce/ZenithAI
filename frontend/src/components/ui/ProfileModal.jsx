import React from 'react';
import { X, LogOut, ShieldCheck, Mail, Database } from 'lucide-react';

export default function ProfileModal({
  isOpen,
  onClose,
  user,
  isGuest,
  onLogout
}) {
  if (!isOpen) return null;

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>User Profile</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="profile-body">
          <div className="profile-avatar-wrap">
            <img 
              src={defaultAvatar} 
              alt="Profile" 
              className="profile-img"
            />
            <span className={`profile-status-indicator ${isGuest ? 'guest' : 'active'}`} />
          </div>

          <h4 className="profile-name">
            {isGuest ? 'Guest Explorer' : (user?.email?.split('@')[0] || 'User')}
          </h4>
          <p className="profile-email">
            {isGuest ? 'Anonymous Session' : user?.email}
          </p>

          <div className="profile-meta-list">
            <div className="profile-meta-item">
              <Mail size={14} />
              <span>{isGuest ? 'Temporary Guest Account' : 'Verified MERN User'}</span>
            </div>
            <div className="profile-meta-item">
              <Database size={14} />
              <span>{isGuest ? 'Chat history not saved' : 'Synced to MongoDB Atlas'}</span>
            </div>
          </div>

          <button 
            className="btn-profile-logout"
            onClick={() => {
              onClose();
              onLogout();
            }}
          >
            <LogOut size={15} />
            <span>{isGuest ? 'Exit Guest Mode' : 'Log Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
