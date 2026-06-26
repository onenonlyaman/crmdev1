import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLeads } from '../../../context/LeadsContext';
import { useOpportunities } from '../../../context/OpportunitiesContext';
import { Activity, Mail, Phone, CheckSquare, StickyNote, MessageCircle } from 'lucide-react';

import LeadHeader from './components/LeadHeader';
import LeadRightPanel from './components/LeadRightPanel';
import ConvertToDealModal from './components/modals/ConvertToDealModal';
import ActivityTab from './components/tabs/ActivityTab';
import EmailsTab from './components/tabs/EmailsTab';
import CallsTab from './components/tabs/CallsTab';
import TasksTab from './components/tabs/TasksTab';
import NotesTab from './components/tabs/NotesTab';
import WhatsAppTab from './components/tabs/WhatsAppTab';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, updateLead, deleteLead } = useLeads();
  const { opportunities, addOpportunity } = useOpportunities();

  const lead = leads.find(l => l.id === id);

  const [activeTab, setActiveTab] = useState('activity');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [activities, setActivities] = useState([]);
  const [showConvertModal, setShowConvertModal] = useState(false);

  useEffect(() => {
    if (lead) setEditData({ ...lead });
  }, [lead]);

  const addActivity = (type, content) => {
    setActivities(prev => [{
      id: Date.now(),
      type,
      content,
      timestamp: new Date().toLocaleString('en-IN'),
    }, ...prev]);
  };

  const handleSave = () => {
    updateLead(id, editData);
    setIsEditing(false);
    addActivity('status', 'Lead details updated');
  };

  const handleDelete = () => {
    if (window.confirm(`Delete ${lead.firstName} ${lead.lastName}?`)) {
      deleteLead(id);
      navigate('/crm/leads');
    }
  };

  const handleConvert = (options = {}) => {
    const existing = opportunities.find(o => o.linkedLeadId === lead.id);
    if (existing) {
      navigate(`/crm/deals/${existing.id}`);
      return;
    }
    const newDeal = {
      id: `OPP-${String(opportunities.length + 1).padStart(4, '0')}`,
      title: `${lead.propertyType || 'Property'} - ${lead.firstName} ${lead.lastName}`,
      opportunityFrom: 'Lead',
      party: options.selectedContact || `${lead.firstName} ${lead.lastName}`,
      organization: options.selectedOrg || lead.organization || '',
      status: 'Open',
      stage: 'Qualification',
      amount: 0,
      propertyType: lead.propertyType || '',
      preferredArea: lead.preferredArea || '',
      budgetRange: lead.budgetRange || '',
      source: lead.leadSource || '',
      assignedTo: lead.assignedTo || '',
      priority: lead.priority || 'Medium',
      linkedLeadId: lead.id,
      createdOn: new Date().toLocaleDateString('en-IN'),
    };
    addOpportunity(newDeal);
    updateLead(lead.id, { status: 'Converted' });
    addActivity('status', `Converted to Deal ${newDeal.id}`);
    navigate(`/crm/deals/${newDeal.id}`);
  };

  if (!lead) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0f0f0f', color: '#f8f8f8' }}>
        <p style={{ fontSize: '14px', marginBottom: '16px' }}>Lead not found</p>
        <button
          onClick={() => navigate('/crm/leads')}
          style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '6px 14px', color: '#afafaf', cursor: 'pointer' }}
        >
          &larr; Back to Leads
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
      <LeadHeader
        lead={lead}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onDelete={handleDelete}
        onConvert={() => setShowConvertModal(true)}
        updateLead={updateLead}
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
            {activeTab === 'activity' && <ActivityTab lead={lead} activities={activities} onAddActivity={addActivity} />}
            {activeTab === 'emails' && <EmailsTab lead={lead} activities={activities} onAddActivity={addActivity} />}
            {activeTab === 'calls' && <CallsTab lead={lead} activities={activities} onAddCall={addActivity} />}
            {activeTab === 'tasks' && <TasksTab lead={lead} />}
            {activeTab === 'notes' && <NotesTab lead={lead} activities={activities} onAddNote={addActivity} />}
            {activeTab === 'whatsapp' && <WhatsAppTab lead={lead} />}
          </div>
        </div>
        
        {/* RIGHT — Details Panel */}
        <LeadRightPanel
          lead={isEditing ? editData : lead}
          isEditing={isEditing}
          onUpdate={(field, val) => {
            if (isEditing) {
              setEditData(prev => ({...prev, [field]: val}));
            } else {
              updateLead(lead.id, { [field]: val });
            }
          }}
        />
        
      </div>
      
      <ConvertToDealModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        lead={lead}
        onConvert={(options) => {
          handleConvert(options);
        }}
      />
    </div>
  );
}
