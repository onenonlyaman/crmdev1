import React, { useState } from 'react';

export default function NewNoteModal({ onClose, onSave }) {
  const [content, setContent] = useState('');

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#0a0a0a', border: '1px solid #1c1c1c', borderRadius: '8px',
        width: '450px', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #1c1c1c', fontSize: '14px', fontWeight: 600, color: '#f8f8f8' }}>
          New Note
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <textarea rows={5} placeholder="Write your note..." value={content} onChange={e => setContent(e.target.value)} style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '10px', color: '#f8f8f8', fontSize: '13px', resize: 'none', outline: 'none' }} />
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid #1c1c1c', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 14px', color: '#f8f8f8', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { if(content) onSave(content) }} style={{ background: '#388AE5', border: 'none', borderRadius: '5px', padding: '6px 14px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>Save Note</button>
        </div>
      </div>
    </div>
  );
}
