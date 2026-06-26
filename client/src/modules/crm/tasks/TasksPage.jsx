import React, { useState } from 'react';
import { useTasks } from '../../../context/TasksContext';
import { LayoutList, ChevronDown, RefreshCw, SlidersHorizontal, ArrowUpDown, Columns, MoreHorizontal, CheckSquare, Edit, Trash2, X, Users, Handshake, Building2 } from 'lucide-react';

export default function TasksPage() {
  const { tasks, addTask, deleteTask, toggleTask } = useTasks();
  const [filterTab, setFilterTab] = useState('All');
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignedTo: 'Admin User',
    dueDate: '',
    linkedType: 'Lead',
    linkedRecord: ''
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter(task => {
    if (filterTab === 'Open') return task.status === 'Open' && !task.done;
    if (filterTab === 'Closed') return task.done || task.status === 'Closed';
    if (filterTab === 'Overdue') return task.dueDate < todayStr && !task.done;
    return true; // All
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    
    addTask({
      id: `TASK-${String(tasks.length + 1).padStart(4, '0')}`,
      title: formData.title,
      description: formData.description,
      status: 'Open',
      assignedTo: formData.assignedTo,
      dueDate: formData.dueDate,
      priority: formData.priority,
      linkedTo: formData.linkedRecord || 'Unknown',
      linkedId: 'UNKNOWN-000',
      linkedType: formData.linkedType.toLowerCase(),
      done: false,
      createdOn: new Date().toLocaleDateString('en-IN'),
    });
    
    setShowModal(false);
    setFormData({ title: '', description: '', priority: 'Medium', assignedTo: 'Admin User', dueDate: '', linkedType: 'Lead', linkedRecord: '' });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Open': return { bg: '#0e2037', color: '#5aaef2' };
      case 'Replied': return { bg: '#371e06', color: '#e79913' };
      case 'Closed': case 'Resolved': return { bg: '#173b2c', color: '#28a745' };
      case 'Cancelled': return { bg: '#361515', color: '#e03636' };
      case 'Backlog': return { bg: '#232323', color: '#7c7c7c' };
      default: return { bg: '#232323', color: '#7c7c7c' };
    }
  };

  const getPriorityStyle = (prio) => {
    switch (prio) {
      case 'Low': return { color: '#7c7c7c', dot: '#7c7c7c' };
      case 'Medium': return { color: '#e79913', dot: '#f59e0b' };
      case 'High': return { color: '#e03636', dot: '#ef4444' };
      case 'Urgent': return { color: '#7c3aed', dot: '#7c3aed' };
      default: return { color: '#7c7c7c', dot: '#7c7c7c' };
    }
  };

  const getLinkedIcon = (type) => {
    switch (type) {
      case 'lead': return <Users size={10} />;
      case 'deal': return <Handshake size={10} />;
      case 'org': return <Building2 size={10} />;
      default: return <Users size={10} />;
    }
  };

  const tableGridTemplate = '40px minmax(250px, 2fr) 100px 150px 120px 100px 180px 120px 80px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f0f0f' }}>
      {/* PAGE HEADER */}
      <div style={{ height: '48px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#f8f8f8' }}>Tasks</div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#111111', cursor: 'pointer' }}
        >
          + Create Task
        </button>
      </div>

      {/* TOOLBAR */}
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', flexShrink: 0 }}>
        <div style={{ height: '40px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <LayoutList size={13} /> List View <ChevronDown size={11} color="#383838" />
            </button>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={14} />
            </button>
            <button style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <SlidersHorizontal size={13} /> Filter
            </button>
            <button style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <ArrowUpDown size={13} /> Sort
            </button>
            <button style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <Columns size={13} /> Columns
            </button>
          </div>
        </div>

        {/* FILTER TABS */}
        <div style={{ padding: '0 20px 10px', display: 'flex', gap: '10px' }}>
          {['All', 'Open', 'Closed', 'Overdue'].map(tab => {
            const isActive = filterTab === tab;
            return (
              <div 
                key={tab}
                onClick={() => setFilterTab(tab)}
                style={{ 
                  padding: '4px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer',
                  background: isActive ? '#232323' : 'transparent',
                  color: isActive ? '#f8f8f8' : '#6b6b6b',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                {tab === 'Overdue' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e03636' }}></div>}
                {tab}
              </div>
            );
          })}
        </div>
      </div>

      {/* TABLE */}
      {filteredTasks.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <CheckSquare size={48} color="#232323" strokeWidth={1} />
          <div style={{ fontSize: '14px', color: '#383838', marginTop: '12px' }}>
            {filterTab === 'Overdue' ? 'No overdue tasks 🎉' : filterTab === 'Closed' ? 'No closed tasks' : 'No tasks found'}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f' }}>
          {/* HEADER ROW */}
          <div style={{ height: '36px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', position: 'sticky', top: 0, zIndex: 10, display: 'grid', gridTemplateColumns: tableGridTemplate }}>
            <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
            {['Title', 'Status', 'Assigned To', 'Due Date', 'Priority', 'Linked To', 'Created On', ''].map((col, idx) => (
              <div key={idx} style={{ padding: '0 12px', fontSize: '11px', fontWeight: '500', color: '#424242', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                {col}
              </div>
            ))}
          </div>

          {/* ROWS */}
          {filteredTasks.map(task => {
            const isOverdue = task.dueDate < todayStr && !task.done;
            const statusStyle = getStatusStyle(task.status);
            const prioStyle = getPriorityStyle(task.priority);

            return (
              <div 
                key={task.id}
                style={{ display: 'grid', gridTemplateColumns: tableGridTemplate, minHeight: '48px', borderBottom: '1px solid #1c1c1c', alignItems: 'center', background: 'transparent', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#111111'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #2b2b2b', cursor: 'pointer', accentColor: '#388AE5' }}
                  />
                </div>
                
                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckSquare size={14} color={task.done ? '#388AE5' : '#383838'} />
                  <div style={{ fontSize: '13px', color: task.done ? '#424242' : '#f8f8f8', fontWeight: '400', textDecoration: task.done ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.title}
                  </div>
                </div>

                <div style={{ padding: '0 12px' }}>
                  <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '500' }}>
                    {task.status}
                  </span>
                </div>

                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, fontSize: '9px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1c1c1c', color: '#afafaf' }}>
                    {task.assignedTo ? task.assignedTo.charAt(0) : 'A'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#afafaf', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.assignedTo}
                  </div>
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: isOverdue ? '#e03636' : '#afafaf', fontWeight: isOverdue ? '500' : '400' }}>
                  {task.dueDate}
                </div>

                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: prioStyle.color }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: prioStyle.dot }}></div>
                  {task.priority}
                </div>

                <div style={{ padding: '0 12px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#0e2037', color: '#5aaef2', borderRadius: '10px', padding: '2px 8px', fontSize: '11px' }}>
                    {getLinkedIcon(task.linkedType)}
                    {task.linkedTo}
                  </div>
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#afafaf' }}>
                  {task.createdOn}
                </div>

                <div style={{ padding: '0 12px', display: 'flex', gap: '8px' }}>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#424242' }} onMouseEnter={e => e.currentTarget.style.color = '#7c7c7c'} onMouseLeave={e => e.currentTarget.style.color = '#424242'}>
                    <Edit size={14} />
                  </button>
                  <button onClick={() => deleteTask(task.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#424242' }} onMouseEnter={e => e.currentTarget.style.color = '#e03636'} onMouseLeave={e => e.currentTarget.style.color = '#424242'}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD TASK MODAL (LIGHT THEME) */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '500px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>Create Task</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <form id="add-task-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="Task Title" 
                    required
                    style={{ width: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#111827', outline: 'none', boxSizing: 'border-box' }} 
                  />
                </div>
                
                <div>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    placeholder="Add description..." 
                    rows="3" 
                    style={{ width: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#111827', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                  ></textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Due Date</label>
                    <input 
                      type="date" 
                      value={formData.dueDate} 
                      onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                      style={{ width: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#111827', outline: 'none', boxSizing: 'border-box' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Priority</label>
                    <select 
                      value={formData.priority} 
                      onChange={e => setFormData({...formData, priority: e.target.value})} 
                      style={{ width: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Link Type</label>
                    <select 
                      value={formData.linkedType} 
                      onChange={e => setFormData({...formData, linkedType: e.target.value})} 
                      style={{ width: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
                    >
                      <option>Lead</option>
                      <option>Deal</option>
                      <option>Organization</option>
                      <option>Customer</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Record</label>
                    <input 
                      type="text" 
                      value={formData.linkedRecord} 
                      onChange={e => setFormData({...formData, linkedRecord: e.target.value})} 
                      placeholder="Name or ID" 
                      style={{ width: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#111827', outline: 'none', boxSizing: 'border-box' }} 
                    />
                  </div>
                </div>

              </form>
            </div>

            <div style={{ padding: '16px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" form="add-task-form" style={{ padding: '8px 16px', background: '#111827', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#ffffff', cursor: 'pointer' }}>
                Create Task
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
