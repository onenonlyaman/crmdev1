import React, { useState } from 'react';
import { CheckCheck } from 'lucide-react';

const INITIAL_MESSAGES = [
  { id: 1, type: 'template', title: 'Welcome to BOS CRM', body: 'Hi there, we are excited to have you on board. Let us know if you have any questions!', sender: 'Admin User', timestamp: '10:00 AM' },
  { id: 2, type: 'received', body: 'Thanks! Looking forward to using it.', timestamp: '10:05 AM' },
  { id: 3, type: 'sent', body: 'Let us know if you need any help setting up.', timestamp: '10:06 AM' },
];

export default function WhatsAppTab({ deal }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [showComposer, setShowComposer] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = {
      id: messages.length + 1,
      type: 'sent',
      body: newMessage.trim(),
      timestamp: timeStr,
    };
    setMessages([...messages, msg]);
    setNewMessage('');
    setShowComposer(false);
  };

  const handleSendTemplate = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = {
      id: messages.length + 1,
      type: 'template',
      title: 'Follow-up Template',
      body: 'Just checking in to see if you needed any more information. Reply to this message if you have questions!',
      sender: 'Admin User',
      timestamp: timeStr,
    };
    setMessages([...messages, msg]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #e5e7eb', background: '#ffffff', flexShrink: 0 }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111111', margin: 0 }}>WhatsApp</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleSendTemplate} style={{ background: '#f3f4f6', color: '#111111', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, border: '1px solid #e5e7eb', cursor: 'pointer' }}>
            Send Template
          </button>
          <button onClick={() => setShowComposer(true)} style={{ background: '#111111', color: '#ffffff', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
            + New WhatsApp Message
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#f9fafb', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map(msg => {
          if (msg.type === 'received') {
            return (
              <div key={msg.id} style={{ alignSelf: 'flex-start', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', borderTopLeftRadius: '2px', padding: '8px 12px', maxWidth: '75%', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: '14px', color: '#1a1a1a', margin: '0 0 4px 0', whiteSpace: 'pre-wrap' }}>{msg.body}</p>
                <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'right' }}>{msg.timestamp}</div>
              </div>
            );
          }
          if (msg.type === 'sent') {
            return (
              <div key={msg.id} style={{ alignSelf: 'flex-end', background: '#dcf8c6', border: '1px solid #c8e6b1', borderRadius: '8px', borderTopRightRadius: '2px', padding: '8px 12px', maxWidth: '75%', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: '14px', color: '#1a1a1a', margin: '0 0 4px 0', whiteSpace: 'pre-wrap' }}>{msg.body}</p>
                <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px' }}>
                  {msg.timestamp}
                  <CheckCheck size={14} color="#3b82f6" />
                </div>
              </div>
            );
          }
          if (msg.type === 'template') {
            return (
              <div key={msg.id} style={{ alignSelf: 'flex-end', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', borderTopRightRadius: '2px', padding: '12px', maxWidth: '75%', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111111', margin: '0 0 4px 0' }}>{msg.title}</h4>
                <p style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 8px 0', whiteSpace: 'pre-wrap' }}>{msg.body}</p>
                <div style={{ fontSize: '11px', color: '#6b7280', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '8px' }}>
                  <span>Sent by {msg.sender}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {msg.timestamp}
                    <CheckCheck size={14} color="#3b82f6" />
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Bottom Composer */}
      {showComposer && (
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', background: '#ffffff', flexShrink: 0 }}>
          <textarea 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a WhatsApp message..."
            style={{ width: '100%', minHeight: '80px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'none', marginBottom: '12px', fontFamily: 'Inter', color: '#111111', background: '#ffffff' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button onClick={() => setShowComposer(false)} style={{ background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#6b7280', cursor: 'pointer' }}>
              Discard
            </button>
            <button onClick={handleSend} style={{ background: '#111111', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: 500, color: '#ffffff', cursor: 'pointer' }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
