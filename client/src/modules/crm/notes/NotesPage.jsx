import React, { useState } from 'react';
import { useNotes } from '../../../context/NotesContext';
import { LayoutList, ChevronDown, RefreshCw, SlidersHorizontal, ArrowUpDown, Columns, MoreHorizontal, StickyNote, Users, Handshake, Building2, X } from 'lucide-react';

export default function NotesPage() {
  const { notes, addNote } = useNotes();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    linkedType: 'Lead',
    linkedRecord: '',
    content: ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    
    addNote({
      id: `NOTE-${String(notes.length + 1).padStart(4, '0')}`,
      title: formData.title,
      content: formData.content,
      linkedTo: formData.linkedRecord || 'Unknown',
      linkedId: 'UNKNOWN-000',
      linkedType: formData.linkedType.toLowerCase(),
      createdBy: 'Admin User',
      createdOn: new Date().toLocaleDateString('en-IN'),
      updatedOn: new Date().toLocaleDateString('en-IN'),
    });
    
    setShowModal(false);
    setFormData({ title: '', linkedType: 'Lead', linkedRecord: '', content: '' });
  };

  const getLinkedIcon = (type) => {
    switch (type) {
      case 'lead': return <Users size={10} />;
      case 'deal': return <Handshake size={10} />;
      case 'org': return <Building2 size={10} />;
      default: return <Users size={10} />;
    }
  };

  const inputStyle = {
    width: '100%',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '13px',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f0f0f' }}>
      {/* PAGE HEADER */}
      <div style={{ height: '48px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#f8f8f8' }}>Notes</div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#111111', cursor: 'pointer' }}
        >
          + Create Note
        </button>
      </div>

      {/* TOOLBAR */}
      <div style={{ height: '40px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <LayoutList size={13} /> List View <ChevronDown size={11} color="#383838" />
          </button>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.color = '#f8f8f8'} onMouseLeave={e => e.currentTarget.style.color = '#6b6b6b'}>
            <RefreshCw size={14} color="currentColor" />
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

      {/* CONTENT */}
      {notes.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <StickyNote size={48} color="#232323" strokeWidth={1} />
          <div style={{ fontSize: '14px', color: '#383838', marginTop: '12px', marginBottom: '16px' }}>No notes yet</div>
          <button 
            onClick={() => setShowModal(true)}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#111111', cursor: 'pointer' }}
          >
            + Create your first Note
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', padding: '20px' }}>
            {notes.map(note => (
              <div 
                key={note.id}
                style={{ background: '#171717', border: '1px solid #1c1c1c', borderRadius: '10px', padding: '16px', cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#388AE5';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(56,138,229,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1c1c1c';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#f8f8f8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {note.title}
                  </div>
                  <button style={{ background: 'none', border: 'none', color: '#383838', cursor: 'pointer', display: 'flex' }} onMouseEnter={e => e.currentTarget.style.color = '#7c7c7c'} onMouseLeave={e => e.currentTarget.style.color = '#383838'}>
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#0e2037', color: '#5aaef2', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', marginBottom: '8px' }}>
                  {getLinkedIcon(note.linkedType)}
                  {note.linkedTo}
                </div>

                <div style={{ fontSize: '13px', color: '#6b6b6b', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {note.content}
                </div>

                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#2d1a4a', color: '#9c45e3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '600' }}>
                      {note.createdBy ? note.createdBy.charAt(0) : '?'}
                    </div>
                    <span style={{ fontSize: '11px', color: '#383838' }}>{note.createdBy}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#383838' }}>{note.createdOn}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD NOTE MODAL (LIGHT THEME) */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '500px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>Create Note</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <form id="add-note-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div>
                  <label style={labelStyle}>Note Title</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="e.g. Site visit feedback" 
                    required
                    style={inputStyle} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Type</label>
                    <select 
                      value={formData.linkedType} 
                      onChange={e => setFormData({...formData, linkedType: e.target.value})} 
                      style={inputStyle}
                    >
                      <option>Lead</option>
                      <option>Deal</option>
                      <option>Organization</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Record</label>
                    <input 
                      type="text" 
                      value={formData.linkedRecord} 
                      onChange={e => setFormData({...formData, linkedRecord: e.target.value})} 
                      placeholder="Name or ID" 
                      style={inputStyle} 
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Content</label>
                  <textarea 
                    value={formData.content} 
                    onChange={e => setFormData({...formData, content: e.target.value})} 
                    placeholder="Write your note here..." 
                    rows="6" 
                    style={{ ...inputStyle, resize: 'vertical' }}
                  ></textarea>
                </div>

              </form>
            </div>

            <div style={{ padding: '16px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" form="add-note-form" style={{ padding: '8px 16px', background: '#111827', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#ffffff', cursor: 'pointer' }}>
                Create
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
