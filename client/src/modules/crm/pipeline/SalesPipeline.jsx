/**
 * SalesPipeline — client/src/modules/crm/pipeline/SalesPipeline.jsx
 * Kanban-style drag-and-drop sales pipeline board.
 * Uses @hello-pangea/dnd for drag-and-drop.
 */
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Columns, SlidersHorizontal, Plus } from 'lucide-react';
import { useOpportunities } from '../../../context/OpportunitiesContext';
import { TopbarContext } from '../../../context/TopbarContext';
import KanbanColumn from './components/KanbanColumn';
import CardDetailDrawer from './components/CardDetailDrawer';

/* ─── useHover ────────────────────────────────────────────────── */
function useHover() {
  const [hov, setHov] = useState(false);
  return [hov, { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) }];
}

/* ─── Topbar buttons ──────────────────────────────────────────── */
function TopbarBtn({ icon, label, onClick }) {
  const [hov, hoverProps] = useHover();
  return (
    <button
      {...hoverProps}
      onClick={onClick}
      style={{
        background: hov ? '#2b2b2b' : '#232323',
        border: '1px solid #343434',
        borderRadius: '6px',
        padding: '4px 10px',
        fontSize: '12px',
        color: '#afafaf',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.15s',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function AddDealTopBtn({ onClick }) {
  const [hov, hoverProps] = useHover();
  return (
    <button
      {...hoverProps}
      onClick={onClick}
      style={{
        background: hov ? '#e5e7eb' : '#f3f4f6',
        border: 'none',
        borderRadius: '6px',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: '500',
        color: '#111111',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.15s',
      }}
    >
      <Plus size={13} />
      + Add Deal
    </button>
  );
}

/* ─── Stage definitions ───────────────────────────────────────── */
const STAGES = [
  {
    id: 'prospecting',
    label: 'Prospecting',
    color: '#7c7c7c',
    bgColor: '#1a1a1a',
    headerBg: '#232323',
    dotColor: '#7c7c7c',
  },
  {
    id: 'qualification',
    label: 'Qualification',
    color: '#5aaef2',
    bgColor: '#0d1a2a',
    headerBg: '#0e2037',
    dotColor: '#5aaef2',
  },
  {
    id: 'proposal',
    label: 'Proposal',
    color: '#e79913',
    bgColor: '#1a1200',
    headerBg: '#371e06',
    dotColor: '#e79913',
  },
  {
    id: 'negotiation',
    label: 'Negotiation',
    color: '#9c45e3',
    bgColor: '#1a0a2a',
    headerBg: '#2d1a4a',
    dotColor: '#9c45e3',
  },
  {
    id: 'won',
    label: 'Won',
    color: '#28a745',
    bgColor: '#0a1a0e',
    headerBg: '#173b2c',
    dotColor: '#28a745',
  },
  {
    id: 'lost',
    label: 'Lost',
    color: '#e03636',
    bgColor: '#1a0a0a',
    headerBg: '#361515',
    dotColor: '#e03636',
  },
];

/* ─── Mock deals (demo data) ──────────────────────────────────── */
const MOCK_DEALS = [
  {
    id: 'DEAL-0001',
    title: '3BHK at Gangapur Road',
    customerName: 'Rajesh Sharma',
    amount: 8500000,
    stage: 'prospecting',
    priority: 'High',
    assignedTo: 'Amit',
    daysInStage: 3,
    propertyType: 'Flat',
    source: 'MagicBricks',
    avatar: 'RS',
    avatarBg: '#0e2037',
    avatarColor: '#5aaef2',
  },
  {
    id: 'DEAL-0002',
    title: 'Villa at Nashik Road',
    customerName: 'Priya Mehta',
    amount: 15000000,
    stage: 'qualification',
    priority: 'Urgent',
    assignedTo: 'Sneha',
    daysInStage: 7,
    propertyType: 'Villa',
    source: 'Referral',
    avatar: 'PM',
    avatarBg: '#0b2e1c',
    avatarColor: '#30a66d',
  },
  {
    id: 'DEAL-0003',
    title: '2BHK at College Road',
    customerName: 'Suresh Patil',
    amount: 5500000,
    stage: 'qualification',
    priority: 'Medium',
    assignedTo: 'Rahul',
    daysInStage: 12,
    propertyType: 'Flat',
    source: '99acres',
    avatar: 'SP',
    avatarBg: '#371e06',
    avatarColor: '#e79913',
  },
  {
    id: 'DEAL-0004',
    title: 'Commercial Plot Satpur',
    customerName: 'Vikram Industries',
    amount: 25000000,
    stage: 'proposal',
    priority: 'High',
    assignedTo: 'Amit',
    daysInStage: 5,
    propertyType: 'Commercial',
    source: 'Walk-in',
    avatar: 'VI',
    avatarBg: '#2d1a4a',
    avatarColor: '#9c45e3',
  },
  {
    id: 'DEAL-0005',
    title: 'Penthouse at Trimbak Road',
    customerName: 'Anita Desai',
    amount: 32000000,
    stage: 'negotiation',
    priority: 'Urgent',
    assignedTo: 'Sneha',
    daysInStage: 18,
    propertyType: 'Penthouse',
    source: 'Referral',
    avatar: 'AD',
    avatarBg: '#361515',
    avatarColor: '#e03636',
  },
  {
    id: 'DEAL-0006',
    title: '2BHK Dwarka',
    customerName: 'Mohan Kulkarni',
    amount: 4800000,
    stage: 'won',
    priority: 'Low',
    assignedTo: 'Rahul',
    daysInStage: 0,
    propertyType: 'Flat',
    source: 'Instagram',
    avatar: 'MK',
    avatarBg: '#173b2c',
    avatarColor: '#28a745',
  },
  {
    id: 'DEAL-0007',
    title: 'Plot at Ozar',
    customerName: 'Deepak Joshi',
    amount: 3200000,
    stage: 'lost',
    priority: 'Low',
    assignedTo: 'Amit',
    daysInStage: 0,
    propertyType: 'Plot',
    source: 'Facebook',
    avatar: 'DJ',
    avatarBg: '#232323',
    avatarColor: '#7c7c7c',
  },
];

/* ─── Amount format ───────────────────────────────────────────── */
function formatAmount(amt) {
  if (!amt && amt !== 0) return '—';
  if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(1)}Cr`;
  if (amt >= 100000)   return `₹${(amt / 100000).toFixed(1)}L`;
  return `₹${Number(amt).toLocaleString('en-IN')}`;
}

/* ─── Summary pill ────────────────────────────────────────────── */
function SummaryPill({ label, value, valueColor }) {
  return (
    <div
      style={{
        background: '#171717',
        border: '1px solid #1c1c1c',
        borderRadius: '6px',
        padding: '4px 12px',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <span style={{ color: '#5a5a5a' }}>{label}:</span>
      <span style={{ color: valueColor || '#afafaf', fontWeight: '600' }}>{value}</span>
    </div>
  );
}

const mapStatusToStage = (status) => {
  const map = {
    'Open':          'prospecting',
    'Replied':       'qualification',
    'Interested':    'proposal',
    'Negotiation':   'negotiation',
    'Won':           'won',
    'Lost':          'lost',
  };
  return map[status] || 'prospecting';
};

const calculateDays = (createdOn) => {
  try {
    const parts = createdOn.split('/');
    const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    const diff = Date.now() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

/* ═══════════════════════════════════════════════════════════════ */
/*  Component                                                     */
/* ═══════════════════════════════════════════════════════════════ */
export default function SalesPipeline() {
  const { opportunities, updateOpportunity } = useOpportunities();
  const [selectedDeal, setSelectedDeal] = useState(null);
  const { setRightActions } = useContext(TopbarContext);

  const mappedDeals = opportunities.map(opp => ({
    id: opp.id,
    title: opp.title,
    customerName: opp.party,
    amount: opp.amount || 0,
    stage: mapStatusToStage(opp.status),
    priority: opp.priority || 'Medium',
    assignedTo: opp.assignedTo || '—',
    daysInStage: calculateDays(opp.createdOn),
    propertyType: opp.propertyType || 'Flat',
    source: opp.source || '—',
    avatar: opp.party
      ? opp.party.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
      : 'NA',
    avatarBg: '#0e2037',
    avatarColor: '#5aaef2',
  }));

  const kanbanDeals = opportunities.length > 0 ? mappedDeals : MOCK_DEALS;

  /* ── Summary stats ─────────────────────────────────────────── */
  const totalDeals    = kanbanDeals.filter(d => d.stage !== 'lost').length;
  const pipelineValue = kanbanDeals
    .filter(d => !['won', 'lost'].includes(d.stage))
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const wonValue      = kanbanDeals
    .filter(d => d.stage === 'won')
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  /* ── Drag end handler ──────────────────────────────────────── */
  const handleDragEnd = useCallback((result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const newStage = destination.droppableId;
    
    const stageToStatus = {
      'prospecting':  'Open',
      'qualification':'Replied',
      'proposal':     'Interested',
      'negotiation':  'Negotiation',
      'won':          'Won',
      'lost':         'Lost',
    };

    updateOpportunity(draggableId, {
      status: stageToStatus[newStage]
    });
  }, [updateOpportunity]);

  /* ── Update deal (from drawer) ─────────────────────────────── */
  const handleUpdateDeal = useCallback((id, updates) => {
    const oppUpdates = { ...updates };
    if (updates.stage) {
      const stageToStatus = {
        'prospecting':  'Open',
        'qualification':'Replied',
        'proposal':     'Interested',
        'negotiation':  'Negotiation',
        'won':          'Won',
        'lost':         'Lost',
      };
      oppUpdates.status = stageToStatus[updates.stage];
      delete oppUpdates.stage;
    }
    updateOpportunity(id, oppUpdates);
    setSelectedDeal(prev => (prev?.id === id ? { ...prev, ...updates } : prev));
  }, [updateOpportunity]);

  /* ── Inject topbar actions ─────────────────────────────────── */
  useEffect(() => {
    setRightActions(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TopbarBtn icon={<Columns size={13} />} label="Kanban View" />
        <TopbarBtn icon={<SlidersHorizontal size={13} />} label="Filter" />
        <AddDealTopBtn onClick={() => console.log('add deal')} />
      </div>
    );
    return () => setRightActions(null);
  }, [setRightActions]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#0a0a0a',
        overflow: 'hidden',
      }}
    >
      {/* ── Summary bar ──────────────────────────────────────── */}
      <div
        style={{
          height: '48px',
          background: '#0f0f0f',
          borderBottom: '1px solid #1c1c1c',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#f8f8f8',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Sales Pipeline
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SummaryPill label="Total Deals"     value={totalDeals}              valueColor="#afafaf" />
          <SummaryPill label="Pipeline Value"  value={formatAmount(pipelineValue)} valueColor="#5aaef2" />
          <SummaryPill label="Won Value"       value={formatAmount(wonValue)}   valueColor="#28a745" />
        </div>
      </div>

      {/* ── Kanban board ─────────────────────────────────────── */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          style={{
            flex: 1,
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '16px 20px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}
        >
          {STAGES.map(stage => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              deals={kanbanDeals.filter(d => d.stage === stage.id)}
              onCardClick={setSelectedDeal}
            />
          ))}
        </div>
      </DragDropContext>

      {/* ── Detail Drawer ─────────────────────────────────────── */}
      <CardDetailDrawer
        deal={selectedDeal}
        isOpen={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
        onUpdate={handleUpdateDeal}
      />
    </div>
  );
}
