import React, { useState } from 'react';

export default function NewEmailModal({ lead, onClose, onSend }) {
  const [to, setTo] = useState(lead?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#0a0a0a', border: '1px solid #1c1c1c', borderRadius: '8px',
        width: '500px', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #1c1c1c', fontSize: '14px', fontWeight: 600, color: '#f8f8f8' }}>
          New Email
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#afafaf' }}>To</label>
            <input value={to} onChange={e => setTo(e.target.value)} style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 10px', color: '#f8f8f8', fontSize: '13px', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#afafaf' }}>Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 10px', color: '#f8f8f8', fontSize: '13px', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#afafaf' }}>Message</label>
            <textarea rows={6} value={message} onChange={e => setMessage(e.target.value)} style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 10px', color: '#f8f8f8', fontSize: '13px', resize: 'none', outline: 'none' }} />
          </div>
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid #1c1c1c', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 14px', color: '#f8f8f8', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSend({ to, subject, message })} style={{ background: '#388AE5', border: 'none', borderRadius: '5px', padding: '6px 14px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>Send Email</button>
        </div>
      </div>
    </div>
  );
}
