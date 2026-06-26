import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOpportunities } from '../../../context/OpportunitiesContext';
import { useLeads } from '../../../context/LeadsContext';
import { useCustomers } from '../../../context/CustomersContext';
import { Activity, Mail, Phone, CheckSquare, StickyNote, MessageCircle, Trophy, XCircle } from 'lucide-react';

import DealHeader from './components/DealHeader';
import DealRightPanel from './components/DealRightPanel';
import ActivityTab from './components/tabs/ActivityTab';
import EmailsTab from './components/tabs/EmailsTab';
import CallsTab from './components/tabs/CallsTab';
import TasksTab from './components/tabs/TasksTab';
import NotesTab from './components/tabs/NotesTab';
import WhatsAppTab from './components/tabs/WhatsAppTab';

export default function DealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { opportunities, updateOpportunity, deleteOpportunity, addOpportunity } = useOpportunities();
  const { leads } = useLeads();
  const { customers, addCustomer } = useCustomers();

  const deal = opportunities.find(o => o.id === id);

  const [activeTab, setActiveTab] = useState('activity');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [activities, setActivities] = useState([]);
  
  const [showWonModal, setShowWonModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  
  const [wonData, setWonData] = useState({ closeDate: new Date().toISOString().split('T')[0], finalAmount: '', notes: '' });
  const [lostData, setLostData] = useState({ lostReason: 'Price Too High', notes: '' });

  useEffect(() => {
    if (deal) {
      setEditData({ ...deal });
      setWonData(prev => ({ ...prev, finalAmount: deal.amount || '' }));
    }
  }, [deal]);

  const addActivity = (type, content) => {
    setActivities(prev => [{
      id: Date.now(),
      type,
      content,
      timestamp: new Date().toLocaleString('en-IN'),
    }, ...prev]);
  };

  const handleSave = () => {
    updateOpportunity(id, editData);
    setIsEditing(false);
    addActivity('status', 'Deal details updated');
  };

  const handleDelete = () => {
    if (window.confirm(`Delete deal "${deal.title}"?`)) {
      deleteOpportunity(id);
      navigate('/crm/deals');
    }
  };

  const handleMarkWon = () => {
    updateOpportunity(id, {
      status: 'Won',
      stage: 'Won',
      closeDate: wonData.closeDate,
      amount: wonData.finalAmount,
      winNotes: wonData.notes,
    });
    
    // Auto create customer if not exists
    const existingCustomer = customers.find(c => c.linkedOpportunityId === id);
    if (!existingCustomer) {
      const newCustomer = {
        id: `CUST-${String(customers.length + 1).padStart(4, '0')}`,
        customerName: deal.party,
        customerGroup: 'Individual',
        territory: deal.preferredArea || '',
        contactPerson: deal.party,
        email: '',
        mobile: '',
        assignedTo: deal.assignedTo || '',
        status: 'Active',
        totalDeals: 1,
        totalValue: wonData.finalAmount || deal.amount || 0,
        linkedOpportunityId: id,
        createdOn: new Date().toLocaleDateString('en-IN'),
      };
      addCustomer(newCustomer);
    }
    
    addActivity('status', 'Deal marked as Won 🎉');
    setShowWonModal(false);
  };

  const handleMarkLost = () => {
    updateOpportunity(id, {
      status: 'Lost',
      stage: 'Lost',
      lostReason: lostData.lostReason,
      lostNotes: lostData.notes,
    });
    addActivity('status', `Deal marked as Lost — ${lostData.lostReason}`);
    setShowLostModal(false);
  };

  if (!deal) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0f0f0f', color: '#f8f8f8' }}>
        <p style={{ fontSize: '14px', marginBottom: '16px' }}>Deal not found</p>
        <button
          onClick={() => navigate('/crm/deals')}
          style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '6px 14px', color: '#afafaf', cursor: 'pointer' }}
        >
          &larr; Back to Deals
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'emails', label: 'Emails', icon: Mail },
    { id: 'calls', label: 'Calls', icon: Phone },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f0f0f', overflow: 'hidden' }}>
      <DealHeader
        deal={deal}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onDelete={handleDelete}
        onMarkWon={() => setShowWonModal(true)}
        onMarkLost={() => setShowLostModal(true)}
        updateOpportunity={updateOpportunity}
      />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* LEFT — Tabs + Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid #1c1c1c' }}>
          
          {/* Tab bar */}
          <div style={{
            height: '36px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c',
            padding: '0 20px', display: 'flex', alignItems: 'flex-end', gap: 0, flexShrink: 0
          }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0 14px', height: '36px', display: 'flex', alignItems: 'center',
                    fontSize: '13px', color: isActive ? '#f8f8f8' : '#6b6b6b', cursor: 'pointer',
                    borderBottom: `2px solid ${isActive ? '#388AE5' : 'transparent'}`,
                    fontWeight: isActive ? 500 : 400, whiteSpace: 'nowrap', gap: '6px',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { if(!isActive) { e.currentTarget.style.color = '#afafaf'; e.currentTarget.style.background = '#111111'; } }}
                  onMouseLeave={e => { if(!isActive) { e.currentTarget.style.color = '#6b6b6b'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  <Icon size={13} />
                  {tab.label}
                </div>
              );
            })}
          </div>
          
          {/* Tab content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            {activeTab === 'activity' && <ActivityTab deal={deal} activities={activities} onAddActivity={addActivity} />}
            {activeTab === 'emails' && <EmailsTab deal={deal} activities={activities} onAddActivity={addActivity} />}
            {activeTab === 'calls' && <CallsTab deal={deal} activities={activities} onAddCall={addActivity} />}
            {activeTab === 'tasks' && <TasksTab deal={deal} />}
            {activeTab === 'notes' && <NotesTab deal={deal} activities={activities} onAddNote={addActivity} />}
            {activeTab === 'whatsapp' && <WhatsAppTab deal={deal} />}
          </div>
        </div>
        
        {/* RIGHT — Details Panel */}
        <DealRightPanel
          deal={isEditing ? editData : deal}
          isEditing={isEditing}
          onUpdate={(field, val) => setEditData(prev => ({...prev, [field]: val}))}
        />
      </div>

      {/* WON MODAL */}
      {showWonModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', borderRadius: '10px', width: '400px', padding: '24px', textAlign: 'center' }}>
            <Trophy size={32} color="#28a745" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '16px', color: '#f8f8f8', marginBottom: '24px' }}>Mark this deal as Won?</h3>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#7c7c7c', marginBottom: '6px' }}>CLOSE DATE</label>
                <input type="date" value={wonData.closeDate} onChange={e => setWonData({...wonData, closeDate: e.target.value})} style={{ width: '100%', background: '#232323', border: '1px solid #343434', borderRadius: '6px', padding: '8px 12px', color: '#f8f8f8', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#7c7c7c', marginBottom: '6px' }}>FINAL AMOUNT (₹)</label>
                <input type="number" value={wonData.finalAmount} onChange={e => setWonData({...wonData, finalAmount: e.target.value})} style={{ width: '100%', background: '#232323', border: '1px solid #343434', borderRadius: '6px', padding: '8px 12px', color: '#f8f8f8', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#7c7c7c', marginBottom: '6px' }}>WIN NOTES</label>
                <textarea placeholder="What closed this deal..." value={wonData.notes} onChange={e => setWonData({...wonData, notes: e.target.value})} rows={2} style={{ width: '100%', background: '#232323', border: '1px solid #343434', borderRadius: '6px', padding: '8px 12px', color: '#f8f8f8', fontSize: '13px', outline: 'none', resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button onClick={() => setShowWonModal(false)} style={{ background: 'transparent', border: '1px solid #343434', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', color: '#afafaf', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleMarkWon} style={{ background: '#173b2c', border: '1px solid #1a4a2e', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', color: '#28a745', fontWeight: 500, cursor: 'pointer' }}>Mark as Won</button>
            </div>
          </div>
        </div>
      )}

      {/* LOST MODAL */}
      {showLostModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', borderRadius: '10px', width: '400px', padding: '24px', textAlign: 'center' }}>
            <XCircle size={32} color="#e03636" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '16px', color: '#f8f8f8', marginBottom: '24px' }}>Mark this deal as Lost?</h3>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#7c7c7c', marginBottom: '6px' }}>LOST REASON</label>
                <select value={lostData.lostReason} onChange={e => setLostData({...lostData, lostReason: e.target.value})} style={{ width: '100%', background: '#232323', border: '1px solid #343434', borderRadius: '6px', padding: '8px 12px', color: '#f8f8f8', fontSize: '13px', outline: 'none' }}>
                  <option value="Price Too High">Price Too High</option>
                  <option value="Went with Competitor">Went with Competitor</option>
                  <option value="No Budget">No Budget</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Project on Hold">Project on Hold</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#7c7c7c', marginBottom: '6px' }}>NOTES</label>
                <textarea placeholder="Additional context..." value={lostData.notes} onChange={e => setLostData({...lostData, notes: e.target.value})} rows={2} style={{ width: '100%', background: '#232323', border: '1px solid #343434', borderRadius: '6px', padding: '8px 12px', color: '#f8f8f8', fontSize: '13px', outline: 'none', resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button onClick={() => setShowLostModal(false)} style={{ background: 'transparent', border: '1px solid #343434', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', color: '#afafaf', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleMarkLost} style={{ background: '#361515', border: '1px solid #4a1515', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', color: '#e03636', fontWeight: 500, cursor: 'pointer' }}>Mark as Lost</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
