/**
 * CustomerDetail — client/src/modules/crm/customers/CustomerDetail.jsx
 * Full detail page for a single CRM customer.
 * Two-column layout: CustomerSidebar (left) + CustomerTimeline (right).
 * Topbar actions: Delete, Send Email, Edit/Save toggle.
 */
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Trash2, Mail, Pencil, Check } from 'lucide-react';
import { useCustomers } from '../../../context/CustomersContext';
import { TopbarContext } from '../../../context/TopbarContext';
import CustomerSidebar from './components/CustomerSidebar';
import CustomerTimeline from './components/CustomerTimeline';
import AddNoteModal from './components/AddNoteModal';
import LogCallModal from './components/LogCallModal';

/* ─── useHover ────────────────────────────────────────────────── */
function useHover() {
  const [hov, setHov] = useState(false);
  return [hov, { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) }];
}

/* ─── Topbar buttons ──────────────────────────────────────────── */
function DeleteBtn({ onClick }) {
  const [hov, hoverProps] = useHover();
  return (
    <button
      {...hoverProps}
      onClick={onClick}
      style={{
        background: hov ? '#361515' : 'transparent',
        border: '1px solid #343434', borderRadius: '6px',
        padding: '4px 12px', fontSize: '12px', color: '#e03636',
        display: 'flex', alignItems: 'center', gap: '5px',
        cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.15s',
      }}
    >
      <Trash2 size={13} /> Delete
    </button>
  );
}

function SendEmailBtn({ onClick }) {
  const [hov, hoverProps] = useHover();
  return (
    <button
      {...hoverProps}
      onClick={onClick}
      style={{
        background: hov ? '#0e2037' : 'transparent',
        border: '1px solid #343434', borderRadius: '6px',
        padding: '4px 12px', fontSize: '12px', color: '#5aaef2',
        display: 'flex', alignItems: 'center', gap: '5px',
        cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.15s',
      }}
    >
      <Mail size={13} /> Send Email
    </button>
  );
}

function EditSaveBtn({ isEditing, onClick }) {
  const [hov, hoverProps] = useHover();
  return (
    <button
      {...hoverProps}
      onClick={onClick}
      style={{
        background: isEditing ? (hov ? '#2d7ad4' : '#388AE5') : (hov ? '#e5e7eb' : '#f3f4f6'),
        border: 'none', borderRadius: '6px',
        padding: '4px 12px', fontSize: '12px', fontWeight: '500',
        color: isEditing ? '#ffffff' : '#111111',
        display: 'flex', alignItems: 'center', gap: '5px',
        cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.15s',
      }}
    >
      {isEditing ? <Check size={13} /> : <Pencil size={13} />}
      {isEditing ? 'Save' : 'Edit'}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  Component                                                     */
/* ═══════════════════════════════════════════════════════════════ */
export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, updateCustomer, deleteCustomer } = useCustomers();
  const { setRightActions } = useContext(TopbarContext);

  const customer = customers.find(c => c.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (customer) setEditData({ ...customer });
  }, [customer]);

  const addActivity = useCallback((type, content) => {
    setActivities(prev => [{
      id: Date.now(), type, content,
      timestamp: new Date().toLocaleString('en-IN'),
    }, ...prev]);
  }, []);

  const handleSave = useCallback(() => {
    updateCustomer(id, editData);
    setIsEditing(false);
    addActivity('status', 'Customer details updated');
  }, [id, editData, updateCustomer, addActivity]);

  const handleDelete = useCallback(() => {
    if (window.confirm('Delete this customer? This cannot be undone.')) {
      deleteCustomer(id);
      navigate('/crm/customers');
    }
  }, [id, deleteCustomer, navigate]);

  const toggleEdit = useCallback(() => {
    if (isEditing) { handleSave(); } else { setIsEditing(true); }
  }, [isEditing, handleSave]);

  const handleSendEmail = useCallback(() => {
    console.log('send email', customer?.id);
  }, [customer]);

  /* Inject topbar actions */
  useEffect(() => {
    setRightActions(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <DeleteBtn onClick={handleDelete} />
        <SendEmailBtn onClick={handleSendEmail} />
        <EditSaveBtn isEditing={isEditing} onClick={toggleEdit} />
      </div>
    );
    return () => setRightActions(null);
  }, [isEditing, setRightActions, handleDelete, handleSendEmail, toggleEdit]);

  /* ── Not found ──────────────────────────────────────────────── */
  if (!customer) {
    return (
      <div
        style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '100%', background: '#0f0f0f',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ fontSize: '14px', color: '#6b6b6b', marginBottom: '16px' }}>
          Customer not found
        </div>
        <Link
          to="/crm/customers"
          style={{ fontSize: '13px', color: '#388AE5', textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
        >
          ← Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: '#0f0f0f' }}>
      <CustomerSidebar
        customer={isEditing ? editData : customer}
        isEditing={isEditing}
        onUpdate={(field, val) => setEditData(prev => ({ ...prev, [field]: val }))}
      />
      <CustomerTimeline
        activities={activities}
        onAddNote={() => setShowNoteModal(true)}
        onLogCall={() => setShowCallModal(true)}
        addActivity={addActivity}
        customer={customer}
      />
      <AddNoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSave={(text) => { addActivity('note', text); setShowNoteModal(false); }}
      />
      <LogCallModal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        onSave={(data) => { addActivity('call', data); setShowCallModal(false); }}
      />
    </div>
  );
}
