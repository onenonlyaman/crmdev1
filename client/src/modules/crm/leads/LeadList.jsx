import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../../context/LeadsContext';
import AddLeadModal from './AddLeadModal';
import {
  Plus, LayoutList, ChevronDown, MoreHorizontal, RefreshCw,
  SlidersHorizontal, ArrowUpDown, Columns, Users, Phone, Mail, MessageCircle
} from 'lucide-react';

export default function LeadList() {
  const { leads, addLead } = useLeads();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSave = (formData) => {
    addLead({
      ...formData,
      id: `LEAD-${String(leads.length + 1).padStart(4, '0')}`,
      createdOn: new Date().toLocaleDateString('en-IN'),
    });
  };

  const toggleAll = () => {
    if (selectedRows.length === leads.length && leads.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(leads.map(l => l.id));
    }
  };

  const toggleRow = (e, id) => {
    e.stopPropagation();
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rId => rId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const getAvatarStyle = (nameStr) => {
    if (!nameStr) return { bg: '#232323', color: '#afafaf', char: '?' };
    const char = nameStr.charAt(0).toUpperCase();
    if (/[A-E]/.test(char)) return { bg: '#0e2037', color: '#5aaef2', char };
    if (/[F-J]/.test(char)) return { bg: '#0b2e1c', color: '#30a66d', char };
    if (/[K-O]/.test(char)) return { bg: '#371e06', color: '#e79913', char };
    if (/[P-T]/.test(char)) return { bg: '#2d1a4a', color: '#9c45e3', char };
    if (/[U-Z]/.test(char)) return { bg: '#361515', color: '#e03636', char };
    return { bg: '#232323', color: '#afafaf', char };
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return { bg: '#232323', color: '#7c7c7c', dot: '#7c7c7c' };
      case 'Contacted': return { bg: '#0e2037', color: '#5aaef2', dot: '#5aaef2' };
      case 'Nurturing': return { bg: '#371e06', color: '#e79913', dot: '#e79913' };
      case 'Qualified': return { bg: '#173b2c', color: '#28a745', dot: '#28a745' };
      case 'Unqualified': return { bg: '#361515', color: '#e03636', dot: '#e03636' };
      case 'Junk': return { bg: '#1c1c1c', color: '#424242', dot: '#424242' };
      default: return { bg: '#232323', color: '#7c7c7c', dot: '#7c7c7c' };
    }
  };

  const tableGridTemplate = '40px 200px 180px 120px 120px 160px 180px 140px 140px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f0f0f' }}>
      {/* PAGE HEADER */}
      <div style={{ height: '48px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#f8f8f8' }}>Leads</div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#111111', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'background 0.1s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#e2e2e2'}
          onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
        >
          <Plus size={14} color="#111" /> Create
        </button>
      </div>

      {/* TOOLBAR */}
      <div style={{ height: '40px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <LayoutList size={13} /> List View <ChevronDown size={11} color="#383838" />
          </button>
          <button style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <MoreHorizontal size={13} color="#7c7c7c" />
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
          <button style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <MoreHorizontal size={13} color="#7c7c7c" />
          </button>
        </div>
      </div>

      {/* TABLE */}
      {leads.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Users size={48} color="#232323" strokeWidth={1} />
          <div style={{ fontSize: '14px', color: '#383838', marginTop: '12px', marginBottom: '16px' }}>No leads found</div>
          <button 
            onClick={() => setShowModal(true)}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#111111', cursor: 'pointer' }}
          >
            + Create your first Lead
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f' }}>
          {/* HEADER ROW */}
          <div style={{ height: '36px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', position: 'sticky', top: 0, zIndex: 10, display: 'grid', gridTemplateColumns: tableGridTemplate }}>
            <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
              <input 
                type="checkbox" 
                checked={selectedRows.length === leads.length && leads.length > 0} 
                onChange={toggleAll}
                style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #2b2b2b', background: 'transparent', cursor: 'pointer', accentColor: '#388AE5' }}
              />
            </div>
            {['Name', 'Organization', 'Status', 'Source', 'Job Title', 'Email', 'Mobile No', 'Assigned To'].map(col => (
              <div key={col} style={{ padding: '0 12px', fontSize: '11px', fontWeight: '500', color: '#424242', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#7c7c7c'} onMouseLeave={e => e.currentTarget.style.color = '#424242'}>
                {col}
              </div>
            ))}
          </div>

          {/* ROWS */}
          {leads.map(lead => {
            const isSelected = selectedRows.includes(lead.id);
            const isHovered = hoveredRow === lead.id;
            const nameAvatar = getAvatarStyle(lead.firstName || lead.lastName);
            const fullName = `${lead.salutation ? lead.salutation + ' ' : ''}${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Unnamed';
            const statusStyle = getStatusStyle(lead.status);
            const assignedToAvatar = getAvatarStyle(lead.leadOwner || 'A');
            
            return (
              <div 
                key={lead.id}
                onClick={() => navigate(`/crm/leads/${lead.id}`)}
                onMouseEnter={() => setHoveredRow(lead.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ display: 'grid', gridTemplateColumns: tableGridTemplate, height: '48px', borderBottom: '1px solid #1c1c1c', alignItems: 'center', cursor: 'pointer', background: isHovered || isSelected ? '#111111' : 'transparent', transition: 'background 0.1s', position: 'relative' }}
              >
                <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => toggleRow(e, lead.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #2b2b2b', cursor: 'pointer', accentColor: '#388AE5' }}
                  />
                </div>
                
                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, fontSize: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', background: nameAvatar.bg, color: nameAvatar.color }}>
                    {nameAvatar.char}
                  </div>
                  <div style={{ fontSize: '13px', color: '#f8f8f8', fontWeight: '400', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {fullName}
                  </div>
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#afafaf', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.organization || '—'}
                </div>

                <div style={{ padding: '0 12px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '500', background: statusStyle.bg, color: statusStyle.color }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusStyle.dot }}></div>
                    {lead.status || 'New'}
                  </div>
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#afafaf', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.leadSource || lead.source || '—'}
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#afafaf', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.jobTitle || '—'}
                </div>

                <div 
                  style={{ padding: '0 12px', fontSize: '13px', color: '#5aaef2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); if (lead.email) window.open(`mailto:${lead.email}`); }}
                >
                  {lead.email || '—'}
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#afafaf', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.mobileNo || lead.mobile || '—'}
                </div>

                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, fontSize: '9px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', background: assignedToAvatar.bg, color: assignedToAvatar.color }}>
                    {assignedToAvatar.char}
                  </div>
                  <div style={{ fontSize: '12px', color: '#afafaf', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.leadOwner || lead.assignedTo || 'Admin User'}
                  </div>
                </div>

                {/* ROW HOVER ACTIONS */}
                {isHovered && (
                  <div style={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '4px', background: '#111111', padding: '0 12px', height: '100%' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (lead.mobileNo || lead.mobile) window.open(`tel:${lead.mobileNo || lead.mobile}`); }}
                      style={{ background: '#1c1c1c', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#388AE5'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#2b2b2b'}
                    >
                      <Phone size={13} color="#30a66d" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (lead.email) window.open(`mailto:${lead.email}`); }}
                      style={{ background: '#1c1c1c', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#388AE5'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#2b2b2b'}
                    >
                      <Mail size={13} color="#5aaef2" />
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        const num = (lead.mobileNo || lead.mobile)?.replace(/\D/g,'');
                        if (num) window.open(`https://wa.me/${num}`, '_blank');
                      }}
                      style={{ background: '#1c1c1c', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#388AE5'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#2b2b2b'}
                    >
                      <MessageCircle size={13} color="#25D366" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddLeadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}
