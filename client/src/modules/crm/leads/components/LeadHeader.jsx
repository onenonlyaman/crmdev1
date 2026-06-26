import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Pencil, Check, Trash2, ArrowRightCircle } from 'lucide-react';

export default function LeadHeader({ lead, isEditing, onEdit, onSave, onDelete, onConvert, updateLead }) {
  const navigate = useNavigate();
  const [showStatusDrop, setShowStatusDrop] = useState(false);

  const statusColors = {
    'New': '#7c7c7c',
    'Contacted': '#5aaef2',
    'Nurturing': '#e79913',
    'Qualified': '#28a745',
    'Unqualified': '#e03636',
    'Junk': '#424242'
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
  };

  const currentStatusColor = statusColors[lead?.status] || '#7c7c7c';

  return (
    <div style={{
      height: '48px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c',
      padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0
    }}>
      <span
        onClick={() => navigate('/crm/leads')}
        style={{ fontSize: '13px', color: '#7c7c7c', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.color = '#f8f8f8'}
        onMouseLeave={e => e.currentTarget.style.color = '#7c7c7c'}
      >
        Leads
      </span>
      <ChevronRight size={14} color="#383838" />
      <span style={{ fontSize: '13px', color: '#f8f8f8', fontWeight: 500 }}>
        {lead?.firstName} {lead?.lastName}
      </span>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        
        {/* Assigned User Pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px', background: '#171717',
          border: '1px solid #2b2b2b', borderRadius: '16px', padding: '3px 10px 3px 4px', cursor: 'pointer'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#388AE5'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#2b2b2b'}>
          <div style={{
            width: '22px', height: '22px', borderRadius: '50%', background: '#388AE5',
            fontSize: '9px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {getInitials(lead?.assignedTo)}
          </div>
          <span style={{ fontSize: '12px', color: '#afafaf' }}>{lead?.assignedTo || 'Unassigned'}</span>
        </div>

        {/* Status Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowStatusDrop(!showStatusDrop)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', background: '#171717',
              border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px',
              cursor: 'pointer', fontSize: '12px'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#388AE5'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2b2b2b'}
          >
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: currentStatusColor }} />
            <span style={{ color: '#afafaf' }}>{lead?.status || 'New'}</span>
            <ChevronDown size={11} color="#383838" />
          </div>

          {showStatusDrop && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: '#1c1c1c',
              border: '1px solid #2b2b2b', borderRadius: '8px', padding: '4px', zIndex: 100, minWidth: '160px'
            }}>
              {Object.entries(statusColors).map(([status, color]) => (
                <div
                  key={status}
                  onClick={() => {
                    updateLead(lead.id, { status });
                    setShowStatusDrop(false);
                  }}
                  style={{
                    padding: '6px 12px', borderRadius: '5px', fontSize: '12.5px', color: '#afafaf',
                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#2b2b2b'; e.currentTarget.style.color = '#f8f8f8'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#afafaf'; }}
                >
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color }} />
                  {status}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit / Save */}
        {!isEditing ? (
          <button
            onClick={onEdit}
            style={{
              background: 'transparent', border: '1px solid #2b2b2b', borderRadius: '6px',
              padding: '4px 12px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#171717'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Pencil size={12} /> Edit
          </button>
        ) : (
          <button
            onClick={onSave}
            style={{
              background: '#388AE5', border: 'none', borderRadius: '6px',
              padding: '4px 12px', fontSize: '12px', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
            }}
          >
            <Check size={12} /> Save
          </button>
        )}

        {/* Delete */}
        <button
          onClick={onDelete}
          style={{
            background: 'transparent', border: '1px solid #2b2b2b', borderRadius: '6px',
            padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#e03636'; e.currentTarget.style.background = '#1a0808'; e.currentTarget.querySelector('svg').style.color = '#e03636'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2b2b2b'; e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('svg').style.color = '#6b6b6b'; }}
        >
          <Trash2 size={13} color="#6b6b6b" style={{ transition: 'color 0.15s' }} />
        </button>

        {/* Convert */}
        {lead?.status === 'Converted' ? (
          <button
            onClick={onConvert}
            style={{
              background: 'transparent', border: '1px solid #173b2c', borderRadius: '6px',
              padding: '5px 14px', fontSize: '13px', fontWeight: 500, color: '#28a745',
              cursor: 'pointer'
            }}
          >
            View Deal &rarr;
          </button>
        ) : (
          <button
            onClick={onConvert}
            style={{
              background: '#f3f4f6', border: 'none', borderRadius: '6px',
              padding: '5px 14px', fontSize: '13px', fontWeight: 500, color: '#111111',
              display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e2e2e2'}
            onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
          >
            <ArrowRightCircle size={13} /> Convert to Deal
          </button>
        )}

      </div>
    </div>
  );
}
