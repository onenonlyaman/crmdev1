import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganizations } from '../../../context/OrganizationsContext';
import AddOrganizationModal from './AddOrganizationModal';
import {
  Plus, LayoutList, ChevronDown, MoreHorizontal, RefreshCw,
  SlidersHorizontal, ArrowUpDown, Columns, Building2, Phone, Mail, Globe
} from 'lucide-react';

export default function OrganizationList() {
  const { organizations, addOrganization } = useOrganizations();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSave = (formData) => {
    addOrganization({
      ...formData,
      id: `ORG-${String(organizations.length + 1).padStart(4, '0')}`,
      linkedContacts: [],
      linkedDeals: [],
      createdOn: new Date().toLocaleDateString('en-IN'),
    });
  };

  const toggleAll = () => {
    if (selectedRows.length === organizations.length && organizations.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(organizations.map(o => o.id));
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

  const tableGridTemplate = '40px 250px 200px 150px 150px 120px 150px 120px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f0f0f' }}>
      {/* PAGE HEADER */}
      <div style={{ height: '48px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#f8f8f8' }}>Organizations</div>
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
      {organizations.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Building2 size={48} color="#232323" strokeWidth={1} />
          <div style={{ fontSize: '14px', color: '#383838', marginTop: '12px', marginBottom: '16px' }}>No organizations yet</div>
          <button 
            onClick={() => setShowModal(true)}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#111111', cursor: 'pointer' }}
          >
            + Create your first Organization
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f' }}>
          {/* HEADER ROW */}
          <div style={{ height: '36px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', position: 'sticky', top: 0, zIndex: 10, display: 'grid', gridTemplateColumns: tableGridTemplate }}>
            <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
              <input 
                type="checkbox" 
                checked={selectedRows.length === organizations.length && organizations.length > 0} 
                onChange={toggleAll}
                style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #2b2b2b', background: 'transparent', cursor: 'pointer', accentColor: '#388AE5' }}
              />
            </div>
            {['Name', 'Website', 'Industry', 'Territory', 'No of Employees', 'Phone', 'Created On'].map(col => (
              <div key={col} style={{ padding: '0 12px', fontSize: '11px', fontWeight: '500', color: '#424242', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#7c7c7c'} onMouseLeave={e => e.currentTarget.style.color = '#424242'}>
                {col}
              </div>
            ))}
          </div>

          {/* ROWS */}
          {organizations.map(org => {
            const isSelected = selectedRows.includes(org.id);
            const isHovered = hoveredRow === org.id;
            
            return (
              <div 
                key={org.id}
                onClick={() => navigate(`/crm/organizations/${org.id}`)}
                onMouseEnter={() => setHoveredRow(org.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ display: 'grid', gridTemplateColumns: tableGridTemplate, height: '48px', borderBottom: '1px solid #1c1c1c', alignItems: 'center', cursor: 'pointer', background: isHovered || isSelected ? '#111111' : 'transparent', transition: 'background 0.1s', position: 'relative' }}
              >
                <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => toggleRow(e, org.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #2b2b2b', cursor: 'pointer', accentColor: '#388AE5' }}
                  />
                </div>
                
                {/* Name */}
                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '5px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#171717', border: '1px solid #2b2b2b' }}>
                    <Building2 size={12} color="#7c7c7c" />
                  </div>
                  <div style={{ fontSize: '13px', color: '#f8f8f8', fontWeight: '400', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {org.name}
                  </div>
                </div>

                {/* Website */}
                <div 
                  style={{ padding: '0 12px', fontSize: '13px', color: '#5aaef2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); if (org.website) window.open(org.website, '_blank'); }}
                >
                  {org.website || '—'}
                </div>

                {/* Industry */}
                <div style={{ padding: '0 12px' }}>
                  {org.industry ? (
                    <span style={{ background: '#232323', color: '#afafaf', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', whiteSpace: 'nowrap' }}>
                      {org.industry}
                    </span>
                  ) : '—'}
                </div>

                {/* Territory */}
                <div style={{ padding: '0 12px', fontSize: '13px', color: '#afafaf', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {org.territory || '—'}
                </div>

                {/* No of Employees */}
                <div style={{ padding: '0 12px', fontSize: '13px', color: '#afafaf', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {org.noOfEmployees || '—'}
                </div>

                {/* Phone */}
                <div style={{ padding: '0 12px', fontSize: '13px', color: '#afafaf', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {org.phone || '—'}
                </div>

                {/* Created On */}
                <div style={{ padding: '0 12px', fontSize: '13px', color: '#afafaf', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {org.createdOn || '—'}
                </div>

                {/* ROW HOVER ACTIONS */}
                {isHovered && (
                  <div style={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '4px', background: '#111111', padding: '0 12px', height: '100%' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (org.phone) window.open(`tel:${org.phone}`); }}
                      style={{ background: '#1c1c1c', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#388AE5'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#2b2b2b'}
                    >
                      <Phone size={13} color="#30a66d" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (org.email) window.open(`mailto:${org.email}`); }}
                      style={{ background: '#1c1c1c', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#388AE5'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#2b2b2b'}
                    >
                      <Mail size={13} color="#5aaef2" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (org.website) window.open(org.website, '_blank'); }}
                      style={{ background: '#1c1c1c', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#388AE5'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#2b2b2b'}
                    >
                      <Globe size={13} color="#e79913" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddOrganizationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}
