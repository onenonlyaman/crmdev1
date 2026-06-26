import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Check, Calendar, User, X, Circle, ChevronDown } from 'lucide-react';

export default function TasksTab() {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Backlog',
    assignedTo: 'Admin User',
    dueDate: '',
    priority: 'Low'
  });
  
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    if (showModal) {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const d = String(now.getDate()).padStart(2, '0');
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const y = now.getFullYear();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setForm({
        title: '',
        description: '',
        status: 'Backlog',
        assignedTo: 'Admin User',
        dueDate: `${d}/${m}/${y} ${hh}:${mm}`,
        priority: 'Low'
      });
    }
  }, [showModal]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return '#7c3aed';
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#9ca3af';
      default: return '#9ca3af';
    }
  };

  const cycleStatus = () => {
    const statuses = ['Backlog', 'Open', 'Replied', 'Closed', 'Resolved', 'Cancelled'];
    const idx = statuses.indexOf(form.status);
    setForm({ ...form, status: statuses[(idx + 1) % statuses.length] });
  };

  const cyclePriority = () => {
    const priorities = ['Low', 'Medium', 'High', 'Urgent'];
    const idx = priorities.indexOf(form.priority);
    setForm({ ...form, priority: priorities[(idx + 1) % priorities.length] });
  };

  const handleCreate = () => {
    if (!form.title.trim()) return;
    setTasks([...tasks, { ...form, done: false }]);
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <Plus size={12} /> New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
          <CheckSquare size={36} color="#232323" strokeWidth={1} />
          <p style={{ fontSize: '13px', color: '#383838', marginTop: '12px' }}>No tasks yet</p>
        </div>
      ) : (
        <div>
          {tasks.map((task, i) => {
            return (
              <div key={i} style={{ background: '#171717', border: '1px solid #1c1c1c', borderRadius: '8px', padding: '12px 14px', marginBottom: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <button
                  onClick={() => setTasks(tasks.map((t, idx) => idx === i ? { ...t, done: !t.done } : t))}
                  style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #2b2b2b', background: task.done ? '#388AE5' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', padding: 0 }}
                >
                  {task.done && <Check size={10} color="#fff" />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: task.done ? '#424242' : '#f8f8f8', textDecoration: task.done ? 'line-through' : 'none' }}>
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {task.dueDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#383838' }}>
                        <Calendar size={11} /> {task.dueDate}
                      </div>
                    )}
                    {task.assignedTo && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#383838' }}>
                        <User size={11} /> {task.assignedTo}
                      </div>
                    )}
                    <div style={{ fontSize: '11px', color: getPriorityColor(task.priority), fontWeight: task.priority === 'Urgent' ? 700 : 400 }}>
                      {task.priority}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#ffffff', borderRadius: '10px', width: '480px', maxWidth: '94vw', padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '17px', fontWeight: 600, color: '#111111' }}>Create Task</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
                <X size={18} color="#9ca3af" />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Title</div>
              <input 
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder="Call with John Doe"
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '14px', color: '#111111', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.currentTarget.style.borderColor = '#111111'}
                onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Description</div>
              <textarea 
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Took a call with John Doe and discussed the new project."
                rows={4}
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#374151', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.currentTarget.style.borderColor = '#111111'}
                onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {/* Status Pill */}
              <div onClick={cycleStatus} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', color: '#374151', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#d1d5db'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <Circle size={12} color="#9ca3af" strokeDasharray="3 3" /> {form.status}
              </div>

              {/* Assigned To Pill */}
              <div style={{ position: 'relative' }}>
                <div onClick={() => setShowUserDropdown(!showUserDropdown)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', color: '#374151', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#d1d5db'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#388AE5', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {form.assignedTo.charAt(0)}
                  </div>
                  {form.assignedTo} <ChevronDown size={10} />
                </div>
                {showUserDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, width: '160px' }}>
                    {['Admin User', 'Amit Kulkarni', 'Sneha Patil', 'Rahul Desai'].map(user => (
                      <div key={user} onClick={() => { setForm({...form, assignedTo: user}); setShowUserDropdown(false); }} style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>{user}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Due Date Pill */}
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', color: '#374151', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#d1d5db'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                  <Calendar size={12} color="#9ca3af" /> 
                  <input type="text" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} style={{ background: 'transparent', border: 'none', outline: 'none', width: '110px', color: '#374151', fontSize: '12px' }} />
                </div>
              </div>

              {/* Priority Pill */}
              <div onClick={cyclePriority} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', color: '#374151', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#d1d5db'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getPriorityColor(form.priority) }}></div> {form.priority}
              </div>
            </div>

            <button onClick={handleCreate} style={{ width: '100%', background: '#111111', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 500, color: '#ffffff', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = '#000000'} onMouseLeave={e => e.currentTarget.style.background = '#111111'}>
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
