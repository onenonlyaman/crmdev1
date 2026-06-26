/**
 * AddNoteModal — client/src/modules/crm/customers/components/AddNoteModal.jsx
 * Modal for adding a note to a customer's activity timeline.
 * Props: isOpen, onClose, onSave
 */
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function AddNoteModal({ isOpen, onClose, onSave }) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) setText('');
  }, [isOpen]);

  if (!isOpen) return null;

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  function handleSave() {
    if (!text.trim()) return;
    onSave(text.trim());
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          background: '#1a1a1a',
          border: '1px solid #2b2b2b',
          borderRadius: '10px',
          width: '440px',
          maxWidth: '94vw',
          padding: '24px',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '22px',
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#f8f8f8' }}>
            Add Note
          </span>
          <button
            onClick={onClose}
            title="Close"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              color: '#6b6b6b',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f8f8f8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6b6b6b')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write your note here..."
          rows={5}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            minHeight: '120px',
            background: '#232323',
            border: `1px solid ${focused ? '#388AE5' : '#343434'}`,
            borderRadius: '6px',
            padding: '10px 12px',
            fontSize: '13px',
            color: '#f8f8f8',
            fontFamily: 'Inter, sans-serif',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s',
          }}
        />

        {/* Footer */}
        <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #343434',
              borderRadius: '6px',
              padding: '7px 16px',
              fontSize: '13px',
              color: '#afafaf',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#232323'; e.currentTarget.style.color = '#f8f8f8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#afafaf'; }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 16px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#111111',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e5e7eb')}
            onMouseLeave={e => (e.currentTarget.style.background = '#f3f4f6')}
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
}
