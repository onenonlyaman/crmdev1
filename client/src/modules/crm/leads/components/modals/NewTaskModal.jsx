import React, { useState } from 'react';

export default function NewTaskModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('Admin User');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');

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
          New Task
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#afafaf' }}>Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 10px', color: '#f8f8f8', fontSize: '13px', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <label style={{ fontSize: '12px', color: '#afafaf' }}>Assigned To</label>
              <input value={assignedTo} onChange={e => setAssignedTo(e.target.value)} style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 10px', color: '#f8f8f8', fontSize: '13px', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <label style={{ fontSize: '12px', color: '#afafaf' }}>Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 10px', color: '#f8f8f8', fontSize: '13px', colorScheme: 'dark', outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#afafaf' }}>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)} style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 10px', color: '#f8f8f8', fontSize: '13px', outline: 'none' }}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#afafaf' }}>Description</label>
            <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 10px', color: '#f8f8f8', fontSize: '13px', resize: 'none', outline: 'none' }} />
          </div>
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid #1c1c1c', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '6px 14px', color: '#f8f8f8', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { if(title) onSave({ title, assignedTo, dueDate, priority, description }) }} style={{ background: '#388AE5', border: 'none', borderRadius: '5px', padding: '6px 14px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>Create Task</button>
        </div>
      </div>
    </div>
  );
}
