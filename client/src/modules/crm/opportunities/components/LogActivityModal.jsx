/**
 * LogActivityModal — client/src/modules/crm/opportunities/components/LogActivityModal.jsx
 * Modal for logging a structured activity (meeting, site visit, etc.) to the opportunity timeline.
 * Props: isOpen, onClose, onSave
 */
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const ACTIVITY_TYPES = ['Meeting', 'Site Visit', 'Demo', 'Follow-up Call', 'WhatsApp', 'Other'];

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '500',
  color: '#7c7c7c',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '5px',
};

function FocusInput({ as: Tag = 'input', style: extraStyle, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <Tag
      {...props}
      style={{
        width: '100%',
        background: '#232323',
        border: `1px solid ${focused ? '#388AE5' : '#343434'}`,
        borderRadius: '6px',
        padding: '7px 11px',
        fontSize: '13px',
        color: '#f8f8f8',
        fontFamily: 'Inter, sans-serif',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s',
        ...extraStyle,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export default function LogActivityModal({ isOpen, onClose, onSave }) {
  const today = new Date().toISOString().split('T')[0];
  const [activityType, setActivityType] = useState('Meeting');
  const [date, setDate] = useState(today);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setActivityType('Meeting');
      setDate(today);
      setDuration('');
      setNotes('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  function handleSave() {
    onSave({ activityType, date, duration, notes });
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
            Log Activity
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

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Activity Type */}
          <div>
            <label style={labelStyle}>Activity Type</label>
            <FocusInput
              as="select"
              value={activityType}
              onChange={e => setActivityType(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {ACTIVITY_TYPES.map(opt => (
                <option key={opt} value={opt} style={{ background: '#232323' }}>
                  {opt}
                </option>
              ))}
            </FocusInput>
          </div>

          {/* Date */}
          <div>
            <label style={labelStyle}>Date</label>
            <FocusInput
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Duration */}
          <div>
            <label style={labelStyle}>Duration</label>
            <FocusInput
              type="text"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="e.g. 1 hour"
            />
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes</label>
            <FocusInput
              as="textarea"
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="What happened in this activity..."
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '22px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
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
            onMouseEnter={e => {
              e.currentTarget.style.background = '#232323';
              e.currentTarget.style.color = '#f8f8f8';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#afafaf';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              background: '#388AE5',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 16px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#ffffff',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#2d7ad4')}
            onMouseLeave={e => (e.currentTarget.style.background = '#388AE5')}
          >
            Log Activity
          </button>
        </div>
      </div>
    </div>
  );
}
