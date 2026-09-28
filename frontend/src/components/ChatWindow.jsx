import React, { useState, useRef, useEffect } from 'react';
import { BorderBeam } from './ui/border-beam-search';

// Simple markdown formatter for AI answers from MongoDB Atlas
function FormatText({ text }) {
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="ai-text">
      {parts.map((part, idx) => {
        // Code Block
        if (part.startsWith('```') && part.endsWith('```')) {
          const firstLine = part.indexOf('\n');
          const lang = part.slice(3, firstLine).trim() || 'code';
          const code = part.slice(firstLine + 1, -3);

          return (
            <div key={idx} className="code-box">
              <div className="code-header">
                <span>{lang}</span>
                <button 
                  style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', fontSize: '11.5px', fontWeight: 600 }}
                  onClick={() => navigator.clipboard.writeText(code)}
                >
                  Copy
                </button>
              </div>
              <pre><code>{code}</code></pre>
            </div>
          );
        }

        // Standard Paragraphs & Bullets
        return part.split(/\n\n+/).map((para, pIdx) => {
          if (!para.trim()) return null;
          if (para.startsWith('### ')) return <h3 key={pIdx}>{para.replace('### ', '')}</h3>;
          if (para.startsWith('- ')) {
            return (
              <ul key={pIdx}>
                {para.split('\n').map((l, lIdx) => (
                  <li key={lIdx}>{l.replace(/^[*-]\s+/, '')}</li>
                ))}
              </ul>
            );
          }
          return <p key={pIdx}>{para}</p>;
        });
      })}
    </div>
  );
}

export default function ChatWindow({ messages, onSendMessage, isSending, isGuest, user }) {
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const starterCards = [
    { title: "🌤️ Weather Today", desc: "Check current weather info from MongoDB Atlas" },
    { title: "💻 What is MERN stack?", desc: "Learn about MongoDB, Express, React & Node" },
    { title: "⚛️ React Fundamentals", desc: "Overview of components, Virtual DOM & hooks" },
    { title: "🐍 Python Web Scraper", desc: "Get an example web scraping script" }
  ];

  return (
    <main className="chat-window">
      {/* Messages Scroll Area */}
      <div className="messages">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="welcome">
            <div className="welcome-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <h2 className="welcome-title">How can ZenithAI help you today?</h2>
            <p className="welcome-desc">
              {isGuest ? "Exploring in Guest Mode." : `Logged in as ${user?.email || 'User'}. Chats saved to MongoDB.`}
            </p>

            <div className="cards">
              {starterCards.map((card, idx) => (
                <div 
                  key={idx} 
                  className="card"
                  onClick={() => onSendMessage(card.title.replace(/^.+?\s/, ''))}
                >
                  <span className="card-title">{card.title}</span>
                  <span className="card-desc">{card.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Active Dialogue */
          <div className="message-list">
            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                {/* Avatar */}
                <div className={`avatar ${msg.sender === 'user' ? 'user-avatar' : 'ai-avatar'}`}>
                  {msg.sender === 'user' ? (isGuest ? 'G' : 'U') : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  )}
                </div>

                {/* Bubble */}
                <div className="bubble">
                  {msg.sender === 'user' ? msg.text : <FormatText text={msg.text} />}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Input Field with BorderBeam Animated Glow */}
      <footer className="input-bar">
        <BorderBeam size="line" colorVariant="colorful" duration={3.1} borderRadius={24}>
          <form className="input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="Message ZenithAI..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isSending}
            />
            <button type="submit" className="send-btn" disabled={!input.trim() || isSending}>
              ↑
            </button>
          </form>
        </BorderBeam>
        <div className="disclaimer">
          ZenithAI fetches answers directly from MongoDB Atlas.
        </div>
      </footer>
    </main>
  );
}
