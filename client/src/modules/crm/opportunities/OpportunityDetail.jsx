/**
 * OpportunityDetail — client/src/modules/crm/opportunities/OpportunityDetail.jsx
 * Full detail page for a single CRM opportunity.
 * Two-column layout: OpportunitySidebar (left) + OpportunityTimeline (right).
 * Topbar actions: Delete, Convert to Customer, Edit/Save toggle.
 */
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Trash2, UserCheck, Pencil, Check } from 'lucide-react';
import { useOpportunities } from '../../../context/OpportunitiesContext';
import { useCustomers } from '../../../context/CustomersContext';
import { ArrowRightCircle } from 'lucide-react';
import { TopbarContext } from '../../../context/TopbarContext';
import OpportunitySidebar from './components/OpportunitySidebar';
import OpportunityTimeline from './components/OpportunityTimeline';
import AddNoteModal from './components/AddNoteModal';
import LogCallModal from './components/LogCallModal';
import LogActivityModal from './components/LogActivityModal';

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
        border: '1px solid #343434',
        borderRadius: '6px',
        padding: '4px 12px',
        fontSize: '12px',
        color: '#e03636',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.15s',
      }}
    >
      <Trash2 size={13} />
      Delete
    </button>
  );
}

function ConvertToCustomerBtn({ onClick, isWon }) {
  const [hov, hoverProps] = useHover();

  if (isWon) {
    return (
      <button
        {...hoverProps}
        onClick={onClick}
        style={{
          background: 'transparent',
          border: '1px solid #173b2c',
          borderRadius: '6px',
          padding: '4px 12px',
          fontSize: '12px',
          color: '#28a745',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          transition: 'background 0.15s',
        }}
      >
        <UserCheck size={13} />
        View Customer →
      </button>
    );
  }

  return (
    <button
      {...hoverProps}
      onClick={onClick}
      style={{
        background: hov ? '#0b2e1c' : 'transparent',
        border: '1px solid #343434',
        borderRadius: '6px',
        padding: '4px 12px',
        fontSize: '12px',
        color: '#30a66d',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.15s',
      }}
    >
      <UserCheck size={13} />
      Convert to Customer
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
        background: isEditing
          ? (hov ? '#2d7ad4' : '#388AE5')
          : (hov ? '#e5e7eb' : '#f3f4f6'),
        border: 'none',
        borderRadius: '6px',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: '500',
        color: isEditing ? '#ffffff' : '#111111',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.15s',
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
export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { opportunities, updateOpportunity, deleteOpportunity } = useOpportunities();
  const { customers, addCustomer } = useCustomers();
  const { setRightActions } = useContext(TopbarContext);

  const opportunity = opportunities.find(o => o.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activities, setActivities] = useState([]);
  const [showConvertConfirm, setShowConvertConfirm] = useState(false);
  const [convertType, setConvertType] = useState('');

  /* Sync editData when opportunity changes */
  useEffect(() => {
    if (opportunity) setEditData({ ...opportunity });
  }, [opportunity]);

  /* Add activity helper */
  const addActivity = useCallback((type, content) => {
    setActivities(prev => [{
      id: Date.now(),
      type,
      content,
      timestamp: new Date().toLocaleString('en-IN'),
    }, ...prev]);
  }, []);

  /* Save edits */
  const handleSave = useCallback(() => {
    updateOpportunity(id, editData);
    setIsEditing(false);
    addActivity('status', 'Opportunity details updated');
  }, [id, editData, updateOpportunity, addActivity]);

  /* Delete opportunity */
  const handleDelete = useCallback(() => {
    if (window.confirm('Delete this opportunity? This cannot be undone.')) {
      deleteOpportunity(id);
      navigate('/crm/opportunities');
    }
  }, [id, deleteOpportunity, navigate]);

  /* Toggle edit mode */
  const toggleEdit = useCallback(() => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  }, [isEditing, handleSave]);

  /* Convert to Customer */
  const handleConvertToCustomer = useCallback(() => {
    const alreadyExists = customers.find(c => c.linkedOpportunityId === opportunity.id);
    if (alreadyExists) {
      navigate(`/crm/customers/${alreadyExists.id}`);
      return;
    }

    const newCustomer = {
      id: `CUST-${String(customers.length + 1).padStart(4, '0')}`,
      customerName: opportunity.party,
      customerGroup: 'Individual',
      territory: opportunity.preferredArea || '',
      contactPerson: opportunity.party,
      email: '',
      mobile: '',
      address: '',
      gstin: '',
      panNumber: '',
      assignedTo: opportunity.assignedTo || '',
      status: 'Active',
      totalDeals: 1,
      totalValue: opportunity.amount || 0,
      linkedOpportunityId: opportunity.id,
      createdOn: new Date().toLocaleDateString('en-IN'),
    };

    addCustomer(newCustomer);
    updateOpportunity(opportunity.id, { status: 'Won' });
    addActivity('status', `Opportunity converted to Customer ${newCustomer.id}`);
    navigate(`/crm/customers/${newCustomer.id}`);
  }, [opportunity, customers, addCustomer, updateOpportunity, addActivity, navigate]);

  const handleConvertClick = useCallback(() => {
    if (opportunity?.status === 'Won') {
      handleConvertToCustomer();
    } else {
      setConvertType('Customer');
      setShowConvertConfirm(true);
    }
  }, [opportunity?.status, handleConvertToCustomer]);

  /* Inject topbar actions */
  useEffect(() => {
    setRightActions(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <DeleteBtn onClick={handleDelete} />
        <ConvertToCustomerBtn onClick={handleConvertClick} isWon={opportunity?.status === 'Won'} />
        <EditSaveBtn isEditing={isEditing} onClick={toggleEdit} />
      </div>
    );
    return () => setRightActions(null);
  }, [isEditing, setRightActions, handleDelete, handleConvertClick, toggleEdit, opportunity?.status]);

  /* ── Not found ──────────────────────────────────────────────── */
  if (!opportunity) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: '#0f0f0f',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ fontSize: '14px', color: '#6b6b6b', marginBottom: '16px' }}>
          Opportunity not found
        </div>
        <Link
          to="/crm/opportunities"
          style={{
            fontSize: '13px',
            color: '#388AE5',
            textDecoration: 'none',
          }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
        >
          ← Back to Opportunities
        </Link>
      </div>
    );
  }

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: '#0f0f0f' }}>
      <OpportunitySidebar
        opportunity={isEditing ? editData : opportunity}
        isEditing={isEditing}
        onUpdate={(field, val) => setEditData(prev => ({ ...prev, [field]: val }))}
      />
      <OpportunityTimeline
        activities={activities}
        onAddNote={() => setShowNoteModal(true)}
        onLogCall={() => setShowCallModal(true)}
        onLogActivity={() => setShowActivityModal(true)}
        addActivity={addActivity}
        opportunity={opportunity}
      />
      <AddNoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSave={(text) => {
          addActivity('note', text);
          setShowNoteModal(false);
        }}
      />
      <LogCallModal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        onSave={(data) => {
          addActivity('call', data);
          setShowCallModal(false);
        }}
      />
      <LogActivityModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        onSave={(data) => {
          addActivity('activity', data);
          setShowActivityModal(false);
        }}
      />
      {showConvertConfirm && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #2b2b2b',
            borderRadius: '10px',
            padding: '24px',
            width: '380px',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <ArrowRightCircle size={32} color="#388AE5" />
            </div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#f8f8f8', textAlign: 'center' }}>
              Convert to {convertType}?
            </div>
            <div style={{ fontSize: '13px', color: '#7c7c7c', textAlign: 'center', marginTop: '8px', lineHeight: '1.5' }}>
              {convertType === 'Opportunity'
                ? "This will create a new Opportunity from this lead and mark the lead as Converted."
                : "This will create a new Customer record and mark this opportunity as Won."}
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button
                onClick={() => setShowConvertConfirm(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #343434',
                  borderRadius: '6px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  color: '#afafaf',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConvertConfirm(false);
                  if (convertType === 'Customer') {
                    handleConvertToCustomer();
                  }
                }}
                style={{
                  background: '#388AE5',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                Confirm Convert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
