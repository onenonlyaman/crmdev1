/**
 * CardDetailDrawer — client/src/modules/crm/pipeline/components/CardDetailDrawer.jsx
 * Slide-in drawer from the right showing deal details when a Kanban card is clicked.
 * Props: deal, isOpen, onClose, onUpdate
 */
import React, { useState } from 'react';
import {
  X, User, Home, MapPin, IndianRupee,
  Globe, Star, Phone, Mail, FileText, Calendar,
} from 'lucide-react';

/* ─── Stage config (same order as STAGES in SalesPipeline) ────── */
const STAGES = [
  { id: 'prospecting',   label: 'Prospecting',   color: '#7c7c7c', border: '#343434' },
  { id: 'qualification', label: 'Qualification',  color: '#5aaef2', border: '#1a3a5c' },
  { id: 'proposal',      label: 'Proposal',       color: '#e79913', border: '#4a3200' },
  { id: 'negotiation',   label: 'Negotiation',    color: '#9c45e3', border: '#3d2060' },
  { id: 'won',           label: 'Won',            color: '#28a745', border: '#1a4a2c' },
  { id: 'lost',          label: 'Lost',           color: '#e03636', border: '#4a1515' },
];

const STAGE_BG = {
  prospecting:   '#232323',
  qualification: '#0e2037',
  proposal:      '#371e06',
  negotiation:   '#2d1a4a',
  won:           '#173b2c',
  lost:          '#361515',
};

/* ─── Priority colors ─────────────────────────────────────────── */
const PRIORITY_COLORS = {
  Low:    '#7c7c7c',
  Medium: '#e79913',
  High:   '#e03636',
  Urgent: '#e03636',
};

/* ─── Indian format ───────────────────────────────────────────── */
function formatINR(value) {
  if (!value && value !== 0) return '—';
  return '₹ ' + Number(value).toLocaleString('en-IN');
}

/* ─── useHover ────────────────────────────────────────────────── */
function useHover() {
  const [hov, setHov] = useState(false);
  return [hov, { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) }];
}

/* ─── Detail row ──────────────────────────────────────────────── */
function DetailRow({ icon, label, value, valueStyle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
      <div style={{ flexShrink: 0, marginTop: '1px', color: '#424242' }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '10px', color: '#424242', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
          {label}
        </div>
        <div style={{ fontSize: '13px', color: '#e2e2e2', wordBreak: 'break-word', ...valueStyle }}>
          {value || '—'}
        </div>
      </div>
    </div>
  );
}

/* ─── Quick action button ─────────────────────────────────────── */
function QuickAction({ icon, label, onClick }) {
  const [hov, hoverProps] = useHover();
  return (
    <button
      {...hoverProps}
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: '80px',
        background: hov ? '#232323' : '#171717',
        border: `1px solid ${hov ? '#388AE5' : '#1c1c1c'}`,
        borderRadius: '6px',
        padding: '8px',
        fontSize: '11px',
        color: hov ? '#f8f8f8' : '#7c7c7c',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.15s, color 0.15s, border-color 0.15s',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function CardDetailDrawer({ deal, isOpen, onClose, onUpdate }) {
  if (!deal && !isOpen) return null;

  const priorityColor = deal ? (PRIORITY_COLORS[deal.priority] || '#7c7c7c') : '#7c7c7c';

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 900,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          height: '100vh',
          background: '#111111',
          borderLeft: '1px solid #1c1c1c',
          zIndex: 901,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s ease',
          overflow: 'hidden',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {deal && (
          <>
            {/* ── Header ───────────────────────────────────────── */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #1c1c1c',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f8f8f8',
                  flex: 1,
                  marginRight: '12px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {deal.title}
              </span>
              <button
                onClick={onClose}
                title="Close"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  color: '#6b6b6b',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.15s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f8f8f8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b6b6b')}
              >
                <X size={16} />
              </button>
            </div>

            {/* ── Body (scrollable) ─────────────────────────────── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {/* Amount */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px 0',
                  borderBottom: '1px solid #1c1c1c',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '10px', color: '#424242', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  DEAL VALUE
                </div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#f8f8f8' }}>
                  {formatINR(deal.amount)}
                </div>
              </div>

              {/* Stage selector */}
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#424242',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  MOVE TO STAGE
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {STAGES.map(stage => {
                    const isActive = deal.stage === stage.id;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => onUpdate(deal.id, { stage: stage.id })}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '16px',
                          fontSize: '11px',
                          fontWeight: '500',
                          border: `1px solid ${isActive ? stage.color : '#2b2b2b'}`,
                          background: isActive ? STAGE_BG[stage.id] : 'transparent',
                          color: isActive ? stage.color : '#5a5a5a',
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) {
                            e.currentTarget.style.borderColor = stage.color;
                            e.currentTarget.style.color = stage.color;
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) {
                            e.currentTarget.style.borderColor = '#2b2b2b';
                            e.currentTarget.style.color = '#5a5a5a';
                          }
                        }}
                      >
                        {stage.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Details */}
              <div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#424242',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                  }}
                >
                  DEAL DETAILS
                </div>

                <DetailRow icon={<User size={14} />}         label="Customer"    value={deal.customerName} />
                <DetailRow icon={<Home size={14} />}         label="Property"    value={deal.propertyType} />
                <DetailRow icon={<MapPin size={14} />}       label="Title / Area" value={deal.title} />
                <DetailRow icon={<IndianRupee size={14} />}  label="Amount"      value={formatINR(deal.amount)} />
                <DetailRow icon={<Globe size={14} />}        label="Source"      value={deal.source} />
                <DetailRow icon={<User size={14} />}         label="Assigned To" value={deal.assignedTo} />
                <DetailRow
                  icon={<Star size={14} />}
                  label="Priority"
                  value={deal.priority}
                  valueStyle={{ color: priorityColor, fontWeight: deal.priority === 'Urgent' ? '700' : '500' }}
                />
              </div>

              {/* Quick actions */}
              <div
                style={{
                  marginTop: '20px',
                  borderTop: '1px solid #1c1c1c',
                  paddingTop: '16px',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#424242',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}
                >
                  QUICK ACTIONS
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <QuickAction icon={<Phone size={15} />}    label="Call"      onClick={() => console.log('call')} />
                  <QuickAction icon={<Mail size={15} />}     label="Email"     onClick={() => console.log('email')} />
                  <QuickAction icon={<FileText size={15} />} label="Add Note"  onClick={() => console.log('note')} />
                  <QuickAction icon={<Calendar size={15} />} label="Schedule"  onClick={() => console.log('schedule')} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
