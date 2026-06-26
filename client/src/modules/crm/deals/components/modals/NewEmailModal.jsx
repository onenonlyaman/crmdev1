import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

export default function NewEmailModal({ contactEmail, onClose, onSend }) {
  const [to, setTo] = useState(contactEmail || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!to || !subject) return;
    onSend({ to, subject, message });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', borderRadius: '10px', width: '500px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#f8f8f8' }}>New Email</span>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#6b6b6b', cursor: 'pointer' }}><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            placeholder="To"
            value={to}
            onChange={e => setTo(e.target.value)}
            style={{ width: '100%', background: '#232323', border: '1px solid #343434', borderRadius: '6px', padding: '8px 12px', color: '#f8f8f8', fontSize: '13px', outline: 'none' }}
          />
          <input
            placeholder="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={{ width: '100%', background: '#232323', border: '1px solid #343434', borderRadius: '6px', padding: '8px 12px', color: '#f8f8f8', fontSize: '13px', outline: 'none' }}
          />
          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={6}
            style={{ width: '100%', background: '#232323', border: '1px solid #343434', borderRadius: '6px', padding: '8px 12px', color: '#f8f8f8', fontSize: '13px', outline: 'none', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #343434', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', color: '#afafaf', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSend} style={{ background: '#388AE5', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Send size={12} /> Send</button>
        </div>
      </div>
    </div>
  );
}
