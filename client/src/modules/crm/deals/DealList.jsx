import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpportunities } from '../../../context/OpportunitiesContext';
import AddDealModal from './AddDealModal';
import {
  Plus, LayoutList, ChevronDown, MoreHorizontal, RefreshCw,
  SlidersHorizontal, ArrowUpDown, Columns, Handshake, Phone, Mail, MessageCircle
} from 'lucide-react';

export default function DealList() {
  const { opportunities, addOpportunity } = useOpportunities();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSave = (formData) => {
    addOpportunity({
      ...formData,
      id: `OPP-${String(opportunities.length + 1).padStart(4, '0')}`,
      createdOn: new Date().toLocaleDateString('en-IN'),
      stage: 'Qualification',
    });
  };

  const toggleAll = () => {
    if (selectedRows.length === opportunities.length && opportunities.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(opportunities.map(o => o.id));
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Open': return { bg: '#0e2037', color: '#5aaef2', dot: '#5aaef2' };
      case 'Won': return { bg: '#173b2c', color: '#28a745', dot: '#28a745' };
      case 'Lost': return { bg: '#361515', color: '#e03636', dot: '#e03636' };
      case 'Replied': return { bg: '#371e06', color: '#e79913', dot: '#e79913' };
      default: return { bg: '#232323', color: '#7c7c7c', dot: '#7c7c7c' };
    }
  };

  const getStageStyle = (stage) => {
    switch (stage) {
      case 'Qualification': return { bg: '#232323', color: '#7c7c7c' };
      case 'Demo': return { bg: '#0e2037', color: '#5aaef2' };
      case 'Proposal': return { bg: '#371e06', color: '#e79913' };
      case 'Negotiation': return { bg: '#2d1a4a', color: '#9c45e3' };
      case 'Ready to Close': return { bg: '#0b2e1c', color: '#30a66d' };
      default: return { bg: '#232323', color: '#7c7c7c' };
    }
  };

  const tableGridTemplate = '40px 240px 180px 140px 140px 140px 140px 140px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f0f0f' }}>
      {/* PAGE HEADER */}
      <div style={{ height: '48px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#f8f8f8' }}>Deals</div>
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
      {opportunities.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Handshake size={48} color="#232323" strokeWidth={1} />
          <div style={{ fontSize: '14px', color: '#383838', marginTop: '12px', marginBottom: '16px' }}>No deals found</div>
          <button 
            onClick={() => setShowModal(true)}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#111111', cursor: 'pointer' }}
          >
            + Create your first Deal
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f' }}>
          {/* HEADER ROW */}
          <div style={{ height: '36px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', position: 'sticky', top: 0, zIndex: 10, display: 'grid', gridTemplateColumns: tableGridTemplate }}>
            <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
              <input 
                type="checkbox" 
                checked={selectedRows.length === opportunities.length && opportunities.length > 0} 
                onChange={toggleAll}
                style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #2b2b2b', background: 'transparent', cursor: 'pointer', accentColor: '#388AE5' }}
              />
            </div>
            {['Title', 'Party', 'Deal From', 'Stage', 'Status', 'Amount', 'Created On'].map(col => (
              <div key={col} style={{ padding: '0 12px', fontSize: '11px', fontWeight: '500', color: '#424242', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#7c7c7c'} onMouseLeave={e => e.currentTarget.style.color = '#424242'}>
                {col}
              </div>
            ))}
          </div>

          {/* ROWS */}
          {opportunities.map(deal => {
            const isSelected = selectedRows.includes(deal.id);
            const isHovered = hoveredRow === deal.id;
            const statusStyle = getStatusStyle(deal.status);
            const stageStyle = getStageStyle(deal.stage);
            
            return (
              <div 
                key={deal.id}
                onClick={() => navigate(`/crm/deals/${deal.id}`)}
                onMouseEnter={() => setHoveredRow(deal.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ display: 'grid', gridTemplateColumns: tableGridTemplate, height: '48px', borderBottom: '1px solid #1c1c1c', alignItems: 'center', cursor: 'pointer', background: isHovered || isSelected ? '#111111' : 'transparent', transition: 'background 0.1s', position: 'relative' }}
              >
                <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => toggleRow(e, deal.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #2b2b2b', cursor: 'pointer', accentColor: '#388AE5' }}
                  />
                </div>
                
                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e2037', border: '1px solid #1a3a5c' }}>
                    <Handshake size={12} color="#5aaef2" />
                  </div>
                  <div style={{ fontSize: '13px', color: '#f8f8f8', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {deal.title || 'Untitled Deal'}
                  </div>
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#afafaf', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {deal.party || '—'}
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#afafaf', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {deal.opportunityFrom || '—'}
                </div>

                <div style={{ padding: '0 12px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', background: stageStyle.bg, color: stageStyle.color }}>
                    {deal.stage || 'Qualification'}
                  </div>
                </div>

                <div style={{ padding: '0 12px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '500', background: statusStyle.bg, color: statusStyle.color }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusStyle.dot }}></div>
                    {deal.status || 'Open'}
                  </div>
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#f8f8f8', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {deal.amount ? `₹${Number(deal.amount).toLocaleString('en-IN')}` : '—'}
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#7c7c7c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {deal.createdOn || '—'}
                </div>

                {/* ROW HOVER ACTIONS */}
                {isHovered && (
                  <div style={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '4px', background: '#111111', padding: '0 12px', height: '100%' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/crm/deals/${deal.id}`); }}
                      style={{ background: '#1c1c1c', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '4px 8px', fontSize: '11px', color: '#afafaf', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#388AE5'; e.currentTarget.style.color = '#388AE5'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#2b2b2b'; e.currentTarget.style.color = '#afafaf'; }}
                    >
                      View Deal
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddDealModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}
