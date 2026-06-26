/**
 * AddContactModal — client/src/modules/crm/contacts/AddContactModal.jsx
 * Modal for creating a new CRM Contact.
 * Props: isOpen, onClose, onSave
 */
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const STATUS_OPTIONS = ['Active', 'Inactive', 'Lead'];
const SOURCE_OPTIONS = ['Walk-in', '99acres', 'MagicBricks', 'Instagram', 'Referral', 'Other'];

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  jobTitle: '',
  company: '',
  status: 'Active',
  source: 'Walk-in',
  notes: '',
};

const inputStyle = {
  width: '100%',
  background: '#232323',
  border: '1px solid #343434',
  borderRadius: '6px',
  padding: '7px 11px',
  fontSize: '13px',
  color: '#f8f8f8',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '500',
  color: '#7c7c7c',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '5px',
};

function FieldGroup({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function FocusInput({ as: Tag = 'input', style: extraStyle, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <Tag
      {...props}
      style={{ ...inputStyle, ...extraStyle, borderColor: focused ? '#388AE5' : '#343434' }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export default function AddContactModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) setForm(INITIAL_FORM);
  }, [isOpen]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  function handleSave() {
    onSave(form);
    onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        zIndex: 9999, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          background: '#1a1a1a', border: '1px solid #2b2b2b',
          borderRadius: '10px', width: '500px', maxWidth: '94vw',
          maxHeight: '90vh', overflowY: 'auto', padding: '24px',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#f8f8f8' }}>New Contact</span>
          <button
            onClick={onClose}
            title="Close"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: '#6b6b6b', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f8f8f8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6b6b6b')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Row 1 — First / Last name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="First Name">
              <FocusInput type="text" name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} />
            </FieldGroup>
            <FieldGroup label="Last Name">
              <FocusInput type="text" name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} />
            </FieldGroup>
          </div>

          {/* Row 2 — Email / Mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Email">
              <FocusInput type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} />
            </FieldGroup>
            <FieldGroup label="Mobile">
              <FocusInput type="tel" name="mobile" placeholder="+91 98765 43210" value={form.mobile} onChange={handleChange} />
            </FieldGroup>
          </div>

          {/* Row 3 — Job Title / Company */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Job Title">
              <FocusInput type="text" name="jobTitle" placeholder="e.g. Director" value={form.jobTitle} onChange={handleChange} />
            </FieldGroup>
            <FieldGroup label="Company">
              <FocusInput type="text" name="company" placeholder="Company name" value={form.company} onChange={handleChange} />
            </FieldGroup>
          </div>

          {/* Row 4 — Status / Source */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Status">
              <FocusInput as="select" name="status" value={form.status} onChange={handleChange} style={{ cursor: 'pointer' }}>
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt} style={{ background: '#232323' }}>{opt}</option>)}
              </FocusInput>
            </FieldGroup>
            <FieldGroup label="Source">
              <FocusInput as="select" name="source" value={form.source} onChange={handleChange} style={{ cursor: 'pointer' }}>
                {SOURCE_OPTIONS.map(opt => <option key={opt} value={opt} style={{ background: '#232323' }}>{opt}</option>)}
              </FocusInput>
            </FieldGroup>
          </div>

          {/* Row 5 — Notes */}
          <FieldGroup label="Notes">
            <FocusInput as="textarea" name="notes" rows={2} placeholder="Any additional notes..." value={form.notes} onChange={handleChange} style={{ resize: 'vertical' }} />
          </FieldGroup>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: '1px solid #343434', borderRadius: '6px', padding: '7px 16px', fontSize: '13px', color: '#afafaf', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#232323'; e.currentTarget.style.color = '#f8f8f8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#afafaf'; }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '7px 16px', fontSize: '13px', fontWeight: '500', color: '#111111', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e5e7eb')}
            onMouseLeave={e => (e.currentTarget.style.background = '#f3f4f6')}
          >
            Save Contact
          </button>
        </div>
      </div>
    </div>
  );
}
