/**
 * OpportunitySidebar — client/src/modules/crm/opportunities/components/OpportunitySidebar.jsx
 * Left sidebar on the Opportunity Detail page.
 * Shows deal icon, title, party, status badge, amount, quick actions,
 * deal stage progress bar, opportunity details, property interest, and linked lead.
 * Props: opportunity, isEditing, onUpdate
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone, Mail, MessageCircle, Building2, MapPin, Globe,
  Calendar, User, Home, LayoutGrid, CalendarCheck, Star,
  IndianRupee, Handshake, Target,
} from 'lucide-react';
import { useLeads } from '../../../../context/LeadsContext';

/* ─── Status config ───────────────────────────────────────────── */
const STATUS_STYLES = {
  'Open':           { background: '#0e2037', color: '#5aaef2' },
  'Replied':        { background: '#371e06', color: '#e79913' },
  'Interested':     { background: '#0b2e1c', color: '#30a66d' },
  'Won':            { background: '#173b2c', color: '#28a745' },
  'Lost':           { background: '#361515', color: '#e03636' },
  'Do Not Contact': { background: '#232323', color: '#7c7c7c' },
};

const STATUS_LIST = Object.keys(STATUS_STYLES);

/* Progress % per status */
const STAGE_PROGRESS = {
  'Open':           { pct: 20, color: '#388AE5' },
  'Replied':        { pct: 20, color: '#388AE5' },
  'Interested':     { pct: 50, color: '#388AE5' },
  'Negotiation':    { pct: 75, color: '#388AE5' },
  'Won':            { pct: 100, color: '#28a745' },
  'Lost':           { pct: 100, color: '#e03636' },
};

const STAGE_LABELS = {
  'Open':        'Prospecting',
  'Replied':     'Qualification',
  'Interested':  'Proposal',
  'Negotiation': 'Negotiation',
  'Won':         'Won',
  'Lost':        'Lost',
};

/* Property / config options */
const PROPERTY_TYPES   = ['Flat', 'Villa', 'Plot', 'Commercial', 'Penthouse'];
const CONFIGURATIONS   = ['1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Penthouse', 'Plot'];
const PRIORITIES       = ['Low', 'Medium', 'High', 'Urgent'];
const SOURCES          = ['Walk-in', '99acres', 'MagicBricks', 'Housing.com', 'Instagram', 'Referral', 'Other'];
const OPP_FROM_OPTIONS = ['Lead', 'Customer', 'Prospect', 'Existing Client'];

const PRIORITY_COLORS = {
  Low:    '#7c7c7c',
  Medium: '#e79913',
  High:   '#e03636',
  Urgent: '#e03636',
};

/* ─── Indian number format ────────────────────────────────────── */
function formatINR(value) {
  if (!value && value !== 0) return '—';
  const num = Number(value);
  if (isNaN(num)) return value;
  return '₹ ' + num.toLocaleString('en-IN');
}

/* ─── useHover ────────────────────────────────────────────────── */
function useHover() {
  const [hov, setHov] = useState(false);
  return [hov, { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) }];
}

/* ─── Editable input ──────────────────────────────────────────── */
function EditInput({ value, onChange, type = 'text', placeholder, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        background: '#171717',
        border: `1px solid ${focused ? '#388AE5' : '#343434'}`,
        borderRadius: '5px',
        padding: '4px 8px',
        fontSize: '13px',
        color: '#f8f8f8',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif',
        outline: 'none',
        transition: 'border-color 0.15s',
        colorScheme: type === 'date' ? 'dark' : undefined,
      }}
      {...rest}
    />
  );
}

/* ─── Editable select ─────────────────────────────────────────── */
function EditSelect({ value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        background: '#171717',
        border: `1px solid ${focused ? '#388AE5' : '#343434'}`,
        borderRadius: '5px',
        padding: '4px 8px',
        fontSize: '13px',
        color: '#f8f8f8',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif',
        outline: 'none',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
    >
      <option value="" style={{ background: '#171717' }}>—</option>
      {options.map(opt => (
        <option key={opt} value={opt} style={{ background: '#171717' }}>{opt}</option>
      ))}
    </select>
  );
}

/* ─── Quick action icon button ────────────────────────────────── */
function QuickBtn({ icon, tooltip }) {
  const [hov, hoverProps] = useHover();
  return (
    <button
      {...hoverProps}
      title={tooltip}
      style={{
        width: '36px',
        height: '36px',
        background: hov ? '#232323' : '#171717',
        border: `1px solid ${hov ? '#388AE5' : '#2b2b2b'}`,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      {icon}
    </button>
  );
}

/* ─── Detail row ──────────────────────────────────────────────── */
function DetailRow({ icon, label, value, isEditing, field, onUpdate, editComponent, readOnly }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
      <div style={{ flexShrink: 0, marginTop: '2px', color: '#424242' }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '10px',
            color: '#424242',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '2px',
          }}
        >
          {label}
        </div>
        {(isEditing && !readOnly)
          ? (editComponent || (
              <EditInput
                value={value}
                onChange={val => onUpdate(field, val)}
              />
            ))
          : (
              <div style={{ fontSize: '13px', color: '#e2e2e2', wordBreak: 'break-word' }}>
                {value || '—'}
              </div>
            )
        }
      </div>
    </div>
  );
}

/* ─── Section title ───────────────────────────────────────────── */
function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: '10px',
        fontWeight: '600',
        color: '#424242',
        letterSpacing: '0.08em',
        marginBottom: '12px',
      }}
    >
      {children}
    </div>
  );
}

/* ─── Divider ─────────────────────────────────────────────────── */
function Divider() {
  return <div style={{ margin: '16px 0', borderTop: '1px solid #1c1c1c' }} />;
}

/* ═══════════════════════════════════════════════════════════════ */
/*  Component                                                     */
/* ═══════════════════════════════════════════════════════════════ */
export default function OpportunitySidebar({ opportunity, isEditing, onUpdate }) {
  const navigate = useNavigate();
  const { leads } = useLeads();
  if (!opportunity) return null;

  const linkedLead = leads.find(
    l => l.id === opportunity.linkedLeadId
  );

  const statusStyle = STATUS_STYLES[opportunity.status] || STATUS_STYLES['Open'];
  const stageInfo   = STAGE_PROGRESS[opportunity.status] || STAGE_PROGRESS['Open'];
  const stageLabel  = STAGE_LABELS[opportunity.status] || 'Prospecting';
  const priorityColor = PRIORITY_COLORS[opportunity.priority] || '#7c7c7c';

  /* Cycle status on click (only when editing) */
  const handleStatusClick = () => {
    if (!isEditing) return;
    const idx = STATUS_LIST.indexOf(opportunity.status);
    const next = STATUS_LIST[(idx + 1) % STATUS_LIST.length];
    onUpdate('status', next);
  };

  return (
    <div
      style={{
        background: '#0a0a0a',
        width: '340px',
        height: '100%',
        overflowY: 'auto',
        padding: '20px 16px',
        borderRight: '1px solid #1c1c1c',
        flexShrink: 0,
        fontFamily: 'Inter, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Header: Deal icon + Title + Party ──────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Deal icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: '#0e2037',
            border: '1px solid #1a3a5c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          <Handshake size={24} color="#5aaef2" />
        </div>

        {/* Title */}
        <div
          style={{
            marginTop: '10px',
            fontSize: '15px',
            fontWeight: '600',
            color: '#f8f8f8',
            textAlign: 'center',
          }}
        >
          {opportunity.title || '—'}
        </div>

        {/* Party */}
        {opportunity.party && (
          <div style={{ fontSize: '12px', color: '#7c7c7c', textAlign: 'center', marginTop: '3px' }}>
            {opportunity.party}
          </div>
        )}

        {/* Status badge */}
        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
          <span
            title={!isEditing ? "Click Edit to change status" : ""}
            onClick={handleStatusClick}
            style={{
              ...statusStyle,
              padding: '3px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '500',
              display: 'inline-block',
              cursor: isEditing ? 'pointer' : 'default',
              transition: 'transform 0.1s',
            }}
          >
            {opportunity.status || 'Open'}
          </span>
        </div>

        {/* Amount display */}
        <div style={{ marginTop: '14px', textAlign: 'center' }}>
          <div
            style={{
              fontSize: '10px',
              color: '#424242',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            DEAL VALUE
          </div>
          {isEditing ? (
            <EditInput
              type="number"
              value={opportunity.amount}
              onChange={val => onUpdate('amount', val)}
              placeholder="0"
              style={{ fontSize: '22px', fontWeight: '700', textAlign: 'center' }}
            />
          ) : (
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#f8f8f8' }}>
              {formatINR(opportunity.amount)}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick actions ──────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '14px' }}>
        <QuickBtn icon={<Phone size={15} color="#30a66d" />} tooltip="Call" />
        <QuickBtn icon={<Mail size={15} color="#5aaef2" />} tooltip="Email" />
        <QuickBtn icon={<MessageCircle size={15} color="#25D366" />} tooltip="WhatsApp" />
      </div>

      {/* ── Progress bar ───────────────────────────────────────── */}
      <div style={{ marginTop: '18px', marginBottom: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '10px',
              color: '#424242',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            DEAL STAGE
          </span>
          <span style={{ fontSize: '11px', color: '#afafaf' }}>{stageLabel}</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '4px',
            background: '#232323',
            borderRadius: '2px',
            marginTop: '6px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: '2px',
              background: stageInfo.color,
              width: `${stageInfo.pct}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      <Divider />

      {/* ── Opportunity Details ─────────────────────────────────── */}
      <SectionTitle>OPPORTUNITY DETAILS</SectionTitle>

      <DetailRow
        icon={<Target size={14} />}
        label="Opportunity From"
        value={opportunity.opportunityFrom}
        isEditing={isEditing}
        field="opportunityFrom"
        onUpdate={onUpdate}
        editComponent={
          <EditSelect
            value={opportunity.opportunityFrom}
            onChange={val => onUpdate('opportunityFrom', val)}
            options={OPP_FROM_OPTIONS}
          />
        }
      />
      <DetailRow
        icon={<Building2 size={14} />}
        label="Party"
        value={opportunity.party}
        isEditing={isEditing}
        field="party"
        onUpdate={onUpdate}
      />
      <DetailRow
        icon={<Calendar size={14} />}
        label="Expected Close Date"
        value={opportunity.expectedCloseDate}
        isEditing={isEditing}
        field="expectedCloseDate"
        onUpdate={onUpdate}
        editComponent={
          <EditInput
            type="date"
            value={opportunity.expectedCloseDate}
            onChange={val => onUpdate('expectedCloseDate', val)}
          />
        }
      />
      <DetailRow
        icon={<User size={14} />}
        label="Assigned To"
        value={opportunity.assignedTo || 'Unassigned'}
        isEditing={isEditing}
        field="assignedTo"
        onUpdate={onUpdate}
      />
      <DetailRow
        icon={<Globe size={14} />}
        label="Source"
        value={opportunity.source}
        isEditing={isEditing}
        field="source"
        onUpdate={onUpdate}
        editComponent={
          <EditSelect
            value={opportunity.source}
            onChange={val => onUpdate('source', val)}
            options={SOURCES}
          />
        }
      />
      <DetailRow
        icon={<CalendarCheck size={14} />}
        label="Created On"
        value={opportunity.createdOn}
        isEditing={isEditing}
        field="createdOn"
        onUpdate={onUpdate}
        readOnly
      />

      <Divider />

      {/* ── Property Interest ───────────────────────────────────── */}
      <SectionTitle>PROPERTY INTEREST</SectionTitle>

      <DetailRow
        icon={<Home size={14} />}
        label="Property Type"
        value={opportunity.propertyType}
        isEditing={isEditing}
        field="propertyType"
        onUpdate={onUpdate}
        editComponent={
          <EditSelect
            value={opportunity.propertyType}
            onChange={val => onUpdate('propertyType', val)}
            options={PROPERTY_TYPES}
          />
        }
      />
      <DetailRow
        icon={<MapPin size={14} />}
        label="Preferred Location"
        value={opportunity.preferredArea}
        isEditing={isEditing}
        field="preferredArea"
        onUpdate={onUpdate}
        editComponent={
          <EditInput
            value={opportunity.preferredArea}
            onChange={val => onUpdate('preferredArea', val)}
            placeholder="e.g. Gangapur Road"
          />
        }
      />
      <DetailRow
        icon={<LayoutGrid size={14} />}
        label="Configuration"
        value={opportunity.configuration}
        isEditing={isEditing}
        field="configuration"
        onUpdate={onUpdate}
        editComponent={
          <EditSelect
            value={opportunity.configuration}
            onChange={val => onUpdate('configuration', val)}
            options={CONFIGURATIONS}
          />
        }
      />
      <DetailRow
        icon={<IndianRupee size={14} />}
        label="Budget Range"
        value={opportunity.budgetRange}
        isEditing={isEditing}
        field="budgetRange"
        onUpdate={onUpdate}
        editComponent={
          <EditInput
            value={opportunity.budgetRange}
            onChange={val => onUpdate('budgetRange', val)}
            placeholder="e.g. 50L - 1Cr"
          />
        }
      />

      {/* Priority — badge in read mode */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
        <div style={{ flexShrink: 0, marginTop: '2px', color: '#424242' }}>
          <Star size={14} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '10px',
              color: '#424242',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '2px',
            }}
          >
            Priority
          </div>
          {isEditing ? (
            <EditSelect
              value={opportunity.priority}
              onChange={val => onUpdate('priority', val)}
              options={PRIORITIES}
            />
          ) : (
            <span
              style={{
                fontSize: '13px',
                color: priorityColor,
                fontWeight: opportunity.priority === 'Urgent' ? '700' : '500',
              }}
            >
              {opportunity.priority || '—'}
            </span>
          )}
        </div>
      </div>

      <Divider />

      {/* ── Linked Lead ─────────────────────────────────────────── */}
      <SectionTitle>LINKED LEAD</SectionTitle>

      {linkedLead ? (
        <div
          onClick={() => navigate(`/crm/leads/${linkedLead.id}`)}
          style={{
            background: '#171717',
            border: '1px solid #1c1c1c',
            borderRadius: '6px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#388AE5'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#1c1c1c'}
        >
          <User size={14} color="#5aaef2" />
          <div>
            <div style={{ fontSize: 11, color: '#5aaef2' }}>
              {linkedLead.id}
            </div>
            <div style={{ fontSize: 12, color: '#afafaf', marginTop: 2 }}>
              {linkedLead.firstName} {linkedLead.lastName}
            </div>
            <div style={{ fontSize: 11, color: '#7c7c7c', marginTop: 2 }}>
              {linkedLead.status}
            </div>
          </div>
        </div>
      ) : (
        <span style={{ color: '#383838', fontSize: 12 }}>
          No linked lead
        </span>
      )}
    </div>
  );
}
