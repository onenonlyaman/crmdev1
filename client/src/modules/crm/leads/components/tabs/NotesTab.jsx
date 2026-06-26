import React, { useState } from 'react';
import { StickyNote, Plus } from 'lucide-react';
import NewNoteModal from '../modals/NewNoteModal';

export default function NotesTab({ lead, activities, onAddNote }) {
  const [showModal, setShowModal] = useState(false);
  const notes = activities?.filter(a => a.type === 'note') || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <Plus size={12} /> New Note
        </button>
      </div>

      {notes.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
          <StickyNote size={36} color="#232323" strokeWidth={1} />
          <p style={{ fontSize: '13px', color: '#383838', marginTop: '12px' }}>No notes yet</p>
        </div>
      ) : (
        <div>
          {notes.map((note, i) => (
            <div key={i} style={{ background: '#171717', border: '1px solid #1c1c1c', borderRadius: '8px', padding: '14px 16px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#388AE5', fontSize: '8px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '6px' }}>
                  Y
                </div>
                <span style={{ fontSize: '12px', color: '#afafaf' }}>You</span>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#383838' }}>{note.timestamp}</span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: '#afafaf', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {note.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <NewNoteModal
          onClose={() => setShowModal(false)}
          onSave={(content) => {
            onAddNote('note', content);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
