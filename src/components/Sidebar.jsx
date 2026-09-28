import React, { useState, useEffect } from 'react';

export default function Sidebar({
  isGuest,
  token,
  apiUrl,
  activeChatId,
  onSelectChat,
  onNewChat,
  refreshTrigger
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState([]);

  // Fetch past chats from MongoDB Atlas
  useEffect(() => {
    if (isGuest || !token) {
      setChats([]);
      return;
    }

    const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
    fetch(`${apiUrl}/chats${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setChats(Array.isArray(data) ? data : []))
      .catch(err => console.log('Chat list error:', err));
  }, [search, isGuest, token, apiUrl, refreshTrigger]);

  // Delete chat
  const deleteChat = async (e, chatId) => {
    e.stopPropagation();
    try {
      await fetch(`${apiUrl}/chats/${chatId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setChats(prev => prev.filter(c => c._id !== chatId));
      if (activeChatId === chatId) onNewChat();
    } catch (err) {
      console.log('Delete error:', err);
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      {/* Top Header: New Chat & Toggle */}
      <div className="sidebar-top">
        <button className="btn-new" onClick={onNewChat}>
          <span>+</span>
          {isOpen && <span>New Chat</span>}
        </button>

        <button className="btn-toggle" onClick={() => setIsOpen(!isOpen)} title="Toggle sidebar">
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      {isOpen && (
        <>
          {/* Live Search Input */}
          {!isGuest && (
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="Search chats..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          )}

          {/* Guest Message or Chat List */}
          {isGuest ? (
            <div className="guest-box">
              ⚠️ <strong>Guest Mode:</strong><br />
              Logged in as Guest. Sign in to save and persist chat histories to MongoDB.
            </div>
          ) : (
            <div className="chat-list">
              {chats.length === 0 ? (
                <div style={{ padding: '16px 8px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                  No saved conversations yet.
                </div>
              ) : (
                chats.map(chat => (
                  <div
                    key={chat._id}
                    className={`chat-item ${activeChatId === chat._id ? 'active' : ''}`}
                    onClick={() => onSelectChat(chat._id)}
                  >
                    <span className="chat-title">{chat.title || 'Conversation'}</span>
                    <button className="btn-del" onClick={e => deleteChat(e, chat._id)}>✕</button>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </aside>
  );
}
