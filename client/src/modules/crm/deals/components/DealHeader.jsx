import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Pencil, Check, Trash2, Trophy, XCircle, RefreshCw } from 'lucide-react';

export default function DealHeader({ deal, isEditing, onEdit, onSave, onDelete, onMarkWon, onMarkLost, updateOpportunity }) {
  const navigate = useNavigate();
  const [showStageDrop, setShowStageDrop] = useState(false);

  const stageColors = {
    'Qualification': '#7c7c7c',
    'Demo': '#5aaef2',
    'Proposal': '#e79913',
    'Negotiation': '#9c45e3',
    'Ready to Close': '#30a66d'
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
  };

  const currentStageColor = stageColors[deal?.stage] || '#7c7c7c';

  return (
    <div style={{
      height: '48px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c',
      padding: '0 20px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0
    }}>
      <span
        onClick={() => navigate('/crm/deals')}
        style={{ fontSize: '13px', color: '#7c7c7c', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.color = '#f8f8f8'}
        onMouseLeave={e => e.currentTarget.style.color = '#7c7c7c'}
      >
        Deals
      </span>
      <ChevronRight size={14} color="#383838" />
      <span style={{ fontSize: '13px', color: '#f8f8f8', fontWeight: 500, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {deal?.title}
      </span>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        
        {/* Assigned User Pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px', background: '#171717',
          border: '1px solid #2b2b2b', borderRadius: '16px', padding: '3px 10px 3px 4px'
        }}>
          <div style={{
            width: '22px', height: '22px', borderRadius: '50%', background: '#388AE5',
            fontSize: '9px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {getInitials(deal?.assignedTo)}
          </div>
          <span style={{ fontSize: '12px', color: '#afafaf' }}>{deal?.assignedTo || 'Unassigned'}</span>
        </div>

        {/* Stage Dropdown or Badge */}
        {deal?.status === 'Won' ? (
          <div style={{ background: '#173b2c', color: '#28a745', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 500 }}>
            Won
          </div>
        ) : deal?.status === 'Lost' ? (
          <div style={{ background: '#361515', color: '#e03636', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 500 }}>
            Lost
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowStageDrop(!showStageDrop)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', background: '#171717',
                border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px',
                cursor: 'pointer', fontSize: '12px'
              }}
            >
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: currentStageColor }} />
              <span style={{ color: '#afafaf' }}>{deal?.stage || 'Qualification'}</span>
              <ChevronDown size={11} color="#383838" />
            </div>

            {showStageDrop && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: '#1c1c1c',
                border: '1px solid #2b2b2b', borderRadius: '8px', padding: '4px', zIndex: 100, minWidth: '160px'
              }}>
                {Object.entries(stageColors).map(([stage, color]) => (
                  <div
                    key={stage}
                    onClick={() => {
                      updateOpportunity(deal.id, { stage });
                      setShowStageDrop(false);
                    }}
                    style={{
                      padding: '6px 12px', borderRadius: '5px', fontSize: '12.5px', color: '#afafaf',
                      display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#2b2b2b'; e.currentTarget.style.color = '#f8f8f8'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#afafaf'; }}
                  >
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color }} />
                    {stage}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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

        {/* Action Buttons */}
        {deal?.status === 'Won' || deal?.status === 'Lost' ? (
          <button
            onClick={() => updateOpportunity(deal.id, { status: 'Open', stage: 'Qualification' })}
            style={{
              background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)',
              borderRadius: '6px', padding: '4px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-gray-2)'; e.currentTarget.style.color = 'var(--text-color)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <RefreshCw size={12} /> Reopen
          </button>
        ) : (
          <>
            <button
              onClick={onMarkLost}
              style={{
                background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px',
                padding: '4px 12px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = '#fef2f2'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <XCircle size={12} /> Mark as Lost
            </button>
            <button
              onClick={onMarkWon}
              style={{
                background: '#ecfdf5', border: '1px solid #d1fae5', borderRadius: '6px',
                padding: '4px 12px', fontSize: '12px', fontWeight: 500, color: '#166534',
                display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d1fae5'; e.currentTarget.style.borderColor = '#a7f3d0'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.borderColor = '#d1fae5'; }}
            >
              <Trophy size={12} /> Mark as Won
            </button>
          </>
        )}
      </div>
    </div>
  );
}
