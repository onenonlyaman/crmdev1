/**
 * ActivityTimeline — client/src/modules/crm/leads/components/ActivityTimeline.jsx
 * Right column of the Lead Detail page. Shows action buttons and an activity timeline.
 * Props: activities, onAddNote, onLogCall, addActivity
 */
import React from 'react';
import {
  StickyNote, Phone, Mail, CheckSquare,
  MessageSquare, RefreshCw,
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

/* ─── Icon config per activity type ───────────────────────────── */
const ICON_CONFIG = {
  note:   { bg: '#0e2037', icon: <StickyNote size={14} color="#5aaef2" /> },
  call:   { bg: '#0b2e1c', icon: <Phone size={14} color="#30a66d" /> },
  email:  { bg: '#232323', icon: <Mail size={14} color="#afafaf" /> },
  status: { bg: '#371e06', icon: <RefreshCw size={14} color="#e79913" /> },
};

const TYPE_LABELS = {
  note:   'Note Added',
  call:   'Call Logged',
  email:  'Email Sent',
  status: 'Status Change',
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

  /* Render content card body */
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
  } else {
    body = <div>{typeof activity.content === 'string' ? activity.content : JSON.stringify(activity.content)}</div>;
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
        {/* Icon circle */}
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
        {/* Connecting line */}
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
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#f8f8f8' }}>{label}</span>
          <span style={{ fontSize: '11px', color: '#424242' }}>{activity.timestamp}</span>
        </div>

        {/* Content card */}
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

/* ═══════════════════════════════════════════════════════════════ */
/*  Component                                                     */
/* ═══════════════════════════════════════════════════════════════ */
export default function ActivityTimeline({ activities = [], onAddNote, onLogCall }) {
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
      <div style={{ padding: '16px 20px 0', display: 'flex', gap: '8px' }}>
        <ActionBtn icon={<StickyNote size={13} />} label="Note"     onClick={onAddNote} />
        <ActionBtn icon={<Phone size={13} />}      label="Call Log" onClick={onLogCall} />
        <ActionBtn icon={<Mail size={13} />}       label="Email"    onClick={() => console.log('email')} />
        <ActionBtn icon={<CheckSquare size={13} />} label="Activity" onClick={() => console.log('activity')} />
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
            <MessageSquare size={40} color="#232323" strokeWidth={1} />
            <p style={{ color: '#383838', fontSize: '13px', marginTop: '12px' }}>
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
