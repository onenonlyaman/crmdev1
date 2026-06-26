import React, { useState } from 'react';

export default function NewCallModal({ lead, onClose, onSave }) {
  const [to, setTo] = useState(`${lead?.firstName || ''} ${lead?.lastName || ''}`.trim());
  const [duration, setDuration] = useState('');
  const [outcome, setOutcome] = useState('Completed');
  const [notes, setNotes] = useState('');

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
          Log a Call
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#afafaf' }}>To</label>
            <input value={to} onChange={e => setTo(e.target.value)} style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 10px', color: '#f8f8f8', fontSize: '13px', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <label style={{ fontSize: '12px', color: '#afafaf' }}>Duration</label>
              <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 5m 30s" style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 10px', color: '#f8f8f8', fontSize: '13px', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <label style={{ fontSize: '12px', color: '#afafaf' }}>Outcome</label>
              <select value={outcome} onChange={e => setOutcome(e.target.value)} style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 10px', color: '#f8f8f8', fontSize: '13px', outline: 'none' }}>
                <option>Completed</option>
                <option>No Answer</option>
                <option>Busy</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#afafaf' }}>Notes</label>
            <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 10px', color: '#f8f8f8', fontSize: '13px', resize: 'none', outline: 'none' }} />
          </div>
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid #1c1c1c', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 14px', color: '#f8f8f8', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSave({ to, duration, outcome, notes })} style={{ background: '#388AE5', border: 'none', borderRadius: '5px', padding: '6px 14px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>Log Call</button>
        </div>
      </div>
    </div>
  );
}
