/**
 * AddMaintenanceModal — client/src/modules/crm/maintenance/AddMaintenanceModal.jsx
 * Modal for creating a new Maintenance Request.
 * Props: isOpen, onClose, onSave
 */
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const MAINTENANCE_TYPES = ['Plumbing', 'Electrical', 'Civil', 'Carpentry', 'Painting', 'Elevator', 'Security', 'Housekeeping', 'Other'];
const STATUS_OPTIONS    = ['Open', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];
const PRIORITY_OPTIONS  = ['Low', 'Medium', 'High', 'Urgent'];

const INITIAL_FORM = {
  subject: '',
  customer: '',
  maintenanceType: 'Civil',
  status: 'Open',
  priority: 'Medium',
  assignedTo: '',
  scheduledDate: '',
  propertyUnit: '',
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
      style={{ ...inputStyle, ...extraStyle, borderColor: focused ? '#388AE5' : '#343434', colorScheme: props.type === 'date' ? 'dark' : undefined }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export default function AddMaintenanceModal({ isOpen, onClose, onSave }) {
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
          borderRadius: '10px', width: '540px', maxWidth: '94vw',
          maxHeight: '90vh', overflowY: 'auto', padding: '24px',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#f8f8f8' }}>New Maintenance Request</span>
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
          {/* Row 1 — Subject */}
          <FieldGroup label="Subject">
            <FocusInput type="text" name="subject" placeholder="e.g. Water leakage in flat 302" value={form.subject} onChange={handleChange} />
          </FieldGroup>

          {/* Row 2 — Customer / Maintenance Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Customer">
              <FocusInput type="text" name="customer" placeholder="Customer name" value={form.customer} onChange={handleChange} />
            </FieldGroup>
            <FieldGroup label="Maintenance Type">
              <FocusInput as="select" name="maintenanceType" value={form.maintenanceType} onChange={handleChange} style={{ cursor: 'pointer' }}>
                {MAINTENANCE_TYPES.map(opt => <option key={opt} value={opt} style={{ background: '#232323' }}>{opt}</option>)}
              </FocusInput>
            </FieldGroup>
          </div>

          {/* Row 3 — Status / Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Status">
              <FocusInput as="select" name="status" value={form.status} onChange={handleChange} style={{ cursor: 'pointer' }}>
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt} style={{ background: '#232323' }}>{opt}</option>)}
              </FocusInput>
            </FieldGroup>
            <FieldGroup label="Priority">
              <FocusInput as="select" name="priority" value={form.priority} onChange={handleChange} style={{ cursor: 'pointer' }}>
                {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt} style={{ background: '#232323' }}>{opt}</option>)}
              </FocusInput>
            </FieldGroup>
          </div>

          {/* Row 4 — Assigned To / Scheduled Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Assigned To">
              <FocusInput type="text" name="assignedTo" placeholder="Staff name" value={form.assignedTo} onChange={handleChange} />
            </FieldGroup>
            <FieldGroup label="Scheduled Date">
              <FocusInput type="date" name="scheduledDate" value={form.scheduledDate} onChange={handleChange} />
            </FieldGroup>
          </div>

          {/* Row 5 — Property / Unit */}
          <FieldGroup label="Property / Unit">
            <FocusInput type="text" name="propertyUnit" placeholder="e.g. Tower A, Flat 302" value={form.propertyUnit} onChange={handleChange} />
          </FieldGroup>

          {/* Row 6 — Description */}
          <FieldGroup label="Description">
            <FocusInput as="textarea" name="notes" rows={3} placeholder="Describe the issue in detail..." value={form.notes} onChange={handleChange} style={{ resize: 'vertical' }} />
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
            style={{ background: '#388AE5', border: 'none', borderRadius: '6px', padding: '7px 16px', fontSize: '13px', fontWeight: '500', color: '#ffffff', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#2d7ad4')}
            onMouseLeave={e => (e.currentTarget.style.background = '#388AE5')}
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
