/**
 * KanbanColumn — client/src/modules/crm/pipeline/components/KanbanColumn.jsx
 * A single stage column in the Kanban board. Wraps cards in a Droppable.
 * Props: stage, deals, onCardClick
 */
import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import KanbanCard from './KanbanCard';

/* ─── Indian format total ─────────────────────────────────────── */
function columnTotal(deals) {
  const sum = deals.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
  if (sum === 0) return null;
  if (sum >= 10000000) return `₹${(sum / 10000000).toFixed(1)}Cr`;
  if (sum >= 100000)   return `₹${(sum / 100000).toFixed(1)}L`;
  return `₹${sum.toLocaleString('en-IN')}`;
}

/* ─── Add Deal button ─────────────────────────────────────────── */
function AddDealBtn() {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        marginTop: '4px',
        width: '100%',
        padding: '6px',
        background: hov ? 'rgba(56,138,229,0.05)' : 'transparent',
        border: `1px dashed ${hov ? '#388AE5' : '#232323'}`,
        borderRadius: '6px',
        fontSize: '12px',
        color: hov ? '#5aaef2' : '#383838',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        fontFamily: 'Inter, sans-serif',
        transition: 'border-color 0.15s, color 0.15s, background 0.15s',
      }}
    >
      <Plus size={11} />
      Add Deal
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function KanbanColumn({ stage, deals, onCardClick }) {
  const total = columnTotal(deals);

  return (
    <div
      style={{
        width: '272px',
        minWidth: '272px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 160px)',
        borderRadius: '10px',
        overflow: 'hidden',
        background: stage.bgColor,
        border: '1px solid #1c1c1c',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ── Column header ──────────────────────────────────────── */}
      <div
        style={{
          background: stage.headerBg,
          padding: '10px 12px',
          borderBottom: '1px solid #1c1c1c',
          flexShrink: 0,
        }}
      >
        {/* Top row — stage label + count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Colored dot */}
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: stage.dotColor,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: stage.color,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {stage.label}
            </span>
          </div>

          {/* Count badge */}
          <span
            style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '1px 8px',
              fontSize: '11px',
              color: stage.color,
              fontWeight: '600',
            }}
          >
            {deals.length}
          </span>
        </div>

        {/* Column total value */}
        <div style={{ marginTop: '6px', fontSize: '11px', color: '#424242' }}>
          {deals.length > 0 ? total : 'No deals'}
        </div>
      </div>

      {/* ── Droppable cards area ────────────────────────────────── */}
      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px',
              minHeight: '80px',
              background: snapshot.isDraggingOver
                ? 'rgba(56, 138, 229, 0.05)'
                : 'transparent',
              transition: 'background 0.15s ease',
            }}
          >
            {deals.map((deal, index) => (
              <KanbanCard
                key={deal.id}
                deal={deal}
                index={index}
                onClick={() => onCardClick(deal)}
              />
            ))}
            {provided.placeholder}
            <AddDealBtn />
          </div>
        )}
      </Droppable>
    </div>
  );
}
