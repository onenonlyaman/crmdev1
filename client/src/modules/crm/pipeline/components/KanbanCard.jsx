/**
 * KanbanCard — client/src/modules/crm/pipeline/components/KanbanCard.jsx
 * A single draggable deal card in the Kanban board.
 * Props: deal, index, onClick
 */
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { User } from 'lucide-react';

/* ─── Property type badge colors ──────────────────────────────── */
const PROPERTY_BADGE = {
  Flat:       { bg: '#0e2037', color: '#5aaef2' },
  Villa:      { bg: '#0b2e1c', color: '#30a66d' },
  Plot:       { bg: '#371e06', color: '#e79913' },
  Commercial: { bg: '#2d1a4a', color: '#9c45e3' },
  Penthouse:  { bg: '#361515', color: '#e03636' },
};

/* ─── Priority colors ─────────────────────────────────────────── */
const PRIORITY_COLORS = {
  Low:    '#424242',
  Medium: '#e79913',
  High:   '#e03636',
  Urgent: '#e03636',
};

/* ─── Amount shorthand ────────────────────────────────────────── */
export function formatAmount(amt) {
  if (!amt && amt !== 0) return '—';
  if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(1)}Cr`;
  if (amt >= 100000)   return `₹${(amt / 100000).toFixed(1)}L`;
  return `₹${Number(amt).toLocaleString('en-IN')}`;
}

/* ─── Days label ──────────────────────────────────────────────── */
function daysLabel(n) {
  if (n === 0) return 'Today';
  if (n === 1) return '1 day';
  return `${n} days`;
}

function daysColor(n) {
  if (n > 30) return '#e03636';
  if (n > 14) return '#e79913';
  return '#383838';
}

/* ═══════════════════════════════════════════════════════════════ */
export default function KanbanCard({ deal, index, onClick }) {
  const propBadge = PROPERTY_BADGE[deal.propertyType] || { bg: '#232323', color: '#7c7c7c' };
  const priorityColor = PRIORITY_COLORS[deal.priority] || '#424242';
  const isUrgent = deal.priority === 'Urgent';
  const agentInitials = (deal.assignedTo || '?').slice(0, 2).toUpperCase();

  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(deal)}
          style={{
            ...provided.draggableProps.style,
            marginBottom: '8px',
            background: snapshot.isDragging ? '#232323' : '#171717',
            border: snapshot.isDragging
              ? '1px solid #388AE5'
              : '1px solid #1c1c1c',
            borderRadius: '8px',
            padding: '12px',
            cursor: 'pointer',
            boxShadow: snapshot.isDragging
              ? '0 8px 24px rgba(0,0,0,0.6)'
              : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            userSelect: 'none',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Top row — property badge + priority */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {/* Property type badge */}
            <span
              style={{
                fontSize: '10px',
                padding: '2px 7px',
                borderRadius: '4px',
                fontWeight: '500',
                background: propBadge.bg,
                color: propBadge.color,
              }}
            >
              {deal.propertyType || 'Other'}
            </span>

            {/* Priority */}
            <span
              style={{
                fontSize: '10px',
                fontWeight: '600',
                color: priorityColor,
              }}
            >
              {isUrgent ? `🔴 ${deal.priority}` : deal.priority}
            </span>
          </div>

          {/* Deal title */}
          <div
            style={{
              marginTop: '8px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#f8f8f8',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {deal.title}
          </div>

          {/* Customer name */}
          <div
            style={{
              marginTop: '4px',
              fontSize: '11px',
              color: '#7c7c7c',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <User size={10} />
            {deal.customerName}
          </div>

          {/* Amount */}
          <div
            style={{
              marginTop: '8px',
              fontSize: '15px',
              fontWeight: '700',
              color: '#f8f8f8',
            }}
          >
            {formatAmount(deal.amount)}
          </div>

          {/* Bottom row — agent / source / days */}
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Agent avatar */}
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#232323',
                border: '1px solid #343434',
                fontSize: '9px',
                fontWeight: '600',
                color: '#afafaf',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {agentInitials}
            </div>

            {/* Source */}
            <span style={{ fontSize: '10px', color: '#383838' }}>
              {deal.source}
            </span>

            {/* Days in stage */}
            <span
              style={{
                fontSize: '10px',
                color: daysColor(deal.daysInStage),
              }}
            >
              {daysLabel(deal.daysInStage)}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
