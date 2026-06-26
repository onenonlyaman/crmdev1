/**
 * OpportunityTimeline — client/src/modules/crm/opportunities/components/OpportunityTimeline.jsx
 * Right column of the Opportunity Detail page.
 * Shows action buttons, summary cards, and an activity timeline.
 * Props: activities, onAddNote, onLogCall, onLogActivity, addActivity, opportunity
 */
import React from 'react';
import {
  StickyNote, Phone, Mail, CheckSquare,
  RefreshCw, TrendingUp, Clock,
} from 'lucide-react';

/* ─── useHover ────────────────────────────────────────────────── */
function useHover() {
  const [hov, setHov] = React.useState(false);
  return [hov, { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) }];
}

/* ─── Action button ───────────────────────────────────────────── */
function ActionBtn({ icon, label, onClick }) {
  const [hov, hoverProps] = useHover();
  return (
    <button
      {...hoverProps}
      onClick={onClick}
      style={{
        background: hov ? '#232323' : '#171717',
        border: `1px solid ${hov ? '#388AE5' : '#2b2b2b'}`,
        borderRadius: '6px',
        padding: '6px 14px',
        fontSize: '12.5px',
        color: hov ? '#f8f8f8' : '#afafaf',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
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

/* ─── Summary card ────────────────────────────────────────────── */
function SummaryCard({ icon, count, label }) {
  return (
    <div
      style={{
        background: '#171717',
        border: '1px solid #1c1c1c',
        borderRadius: '8px',
        padding: '12px 14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        {icon}
        <span style={{ fontSize: '11px', color: '#424242' }}>{label}</span>
      </div>
      <div style={{ fontSize: '22px', fontWeight: '700', color: '#f8f8f8' }}>{count}</div>
      <div style={{ fontSize: '11px', color: '#424242', marginTop: '3px' }}>{label}</div>
    </div>
  );
}

/* ─── Icon config per activity type ───────────────────────────── */
const ICON_CONFIG = {
  note:     { bg: '#0e2037', icon: <StickyNote size={14} color="#5aaef2" /> },
  call:     { bg: '#0b2e1c', icon: <Phone size={14} color="#30a66d" /> },
  email:    { bg: '#232323', icon: <Mail size={14} color="#afafaf" /> },
  activity: { bg: '#2d1a4a', icon: <CheckSquare size={14} color="#9c45e3" /> },
  status:   { bg: '#371e06', icon: <RefreshCw size={14} color="#e79913" /> },
};

const TYPE_LABELS = {
  note:     'Note Added',
  call:     'Call Logged',
  email:    'Email Sent',
  activity: 'Activity Logged',
  status:   'Status Change',
};

const OUTCOME_COLORS = {
  'Answered':     '#30a66d',
  'No Answer':    '#e79913',
  'Busy':         '#e03636',
  'Wrong Number': '#e03636',
};

/* ─── Timeline item ───────────────────────────────────────────── */
function TimelineItem({ activity, isLast }) {
  const cfg = ICON_CONFIG[activity.type] || ICON_CONFIG.note;
  const label = TYPE_LABELS[activity.type] || activity.type;

  let body;
  if (activity.type === 'call' && typeof activity.content === 'object') {
    const c = activity.content;
    body = (
      <>
        {c.notes && <div>{c.notes}</div>}
        {c.duration && (
          <div style={{ fontSize: '11px', color: '#424242', marginTop: '6px' }}>
            Duration: {c.duration}
          </div>
        )}
        {c.outcome && (
          <div
            style={{
              fontSize: '11px',
              color: OUTCOME_COLORS[c.outcome] || '#afafaf',
              marginTop: '4px',
              fontWeight: '500',
            }}
          >
            {c.outcome}
          </div>
        )}
      </>
    );
  } else if (activity.type === 'activity' && typeof activity.content === 'object') {
    const c = activity.content;
    body = (
      <>
        {c.activityType && (
          <div style={{ fontWeight: '500', color: '#9c45e3', marginBottom: '4px' }}>
            {c.activityType}
          </div>
        )}
        {c.notes && <div>{c.notes}</div>}
        <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
          {c.date && (
            <span style={{ fontSize: '11px', color: '#424242' }}>📅 {c.date}</span>
          )}
          {c.duration && (
            <span style={{ fontSize: '11px', color: '#424242' }}>⏱ {c.duration}</span>
          )}
        </div>
      </>
    );
  } else {
    body = (
      <div>{typeof activity.content === 'string' ? activity.content : JSON.stringify(activity.content)}</div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', position: 'relative' }}>
      {/* Left — icon column */}
      <div
        style={{
          width: '32px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: cfg.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {cfg.icon}
        </div>
        {!isLast && (
          <div
            style={{
              width: '1px',
              flex: 1,
              background: '#1c1c1c',
              marginTop: '4px',
              minHeight: '20px',
            }}
          />
        )}
      </div>

      {/* Right — content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#f8f8f8' }}>{label}</span>
          <span style={{ fontSize: '11px', color: '#424242' }}>{activity.timestamp}</span>
        </div>
        <div
          style={{
            marginTop: '6px',
            background: '#171717',
            border: '1px solid #1c1c1c',
            borderRadius: '8px',
            padding: '12px 14px',
            fontSize: '13px',
            color: '#afafaf',
            lineHeight: '1.6',
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
}

/* ─── Days open calculator ────────────────────────────────────── */
function calcDaysOpen(createdOn) {
  if (!createdOn) return '—';
  // Try to parse "DD/MM/YYYY" or any date string
  const parts = createdOn.split('/');
  let d;
  if (parts.length === 3) {
    d = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
  } else {
    d = new Date(createdOn);
  }
  if (isNaN(d)) return '—';
  const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : '—';
}

/* ═══════════════════════════════════════════════════════════════ */
/*  Component                                                     */
/* ═══════════════════════════════════════════════════════════════ */
export default function OpportunityTimeline({
  activities = [],
  onAddNote,
  onLogCall,
  onLogActivity,
  opportunity,
}) {
  const callCount = activities.filter(a => a.type === 'call').length;
  const noteCount = activities.filter(a => a.type === 'note').length;
  const daysOpen  = calcDaysOpen(opportunity?.createdOn);

  return (
    <div
      style={{
        background: '#0f0f0f',
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ── Action buttons row ─────────────────────────────────── */}
      <div style={{ padding: '16px 20px 0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <ActionBtn icon={<StickyNote size={13} />} label="Note"      onClick={onAddNote} />
        <ActionBtn icon={<Phone size={13} />}      label="Call Log"  onClick={onLogCall} />
        <ActionBtn icon={<Mail size={13} />}       label="Email"     onClick={() => console.log('email')} />
        <ActionBtn icon={<CheckSquare size={13} />} label="Activity" onClick={onLogActivity} />
      </div>

      {/* ── Summary cards row ──────────────────────────────────── */}
      <div
        style={{
          padding: '16px 20px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginTop: '12px',
        }}
      >
        <SummaryCard
          icon={<Phone size={14} color="#30a66d" />}
          count={callCount}
          label="Calls logged"
        />
        <SummaryCard
          icon={<StickyNote size={14} color="#5aaef2" />}
          count={noteCount}
          label="Notes added"
        />
        <SummaryCard
          icon={<Clock size={14} color="#e79913" />}
          count={daysOpen}
          label="Days open"
        />
      </div>

      {/* ── Timeline ───────────────────────────────────────────── */}
      <div style={{ padding: '20px', flex: 1 }}>
        {activities.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60%',
            }}
          >
            <TrendingUp size={40} color="#232323" strokeWidth={1} />
            <p style={{ color: '#383838', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>
              No activity yet. Add a note or log a call.
            </p>
          </div>
        ) : (
          activities.map((act, idx) => (
            <TimelineItem
              key={act.id}
              activity={act}
              isLast={idx === activities.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
