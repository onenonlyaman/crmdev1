/**
 * LeadSidebar — client/src/modules/crm/leads/components/LeadSidebar.jsx
 * Left sidebar on the Lead Detail page showing contact info, property interest, and notes.
 * Props: lead, isEditing, onUpdate, activities
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone, Mail, MessageCircle, Building2, Briefcase,
  MapPin, Globe, Calendar, User, Home, LayoutGrid,
  CalendarCheck, Star, IndianRupee, Handshake,
} from 'lucide-react';
import { useOpportunities } from '../../../../context/OpportunitiesContext';

/* ─── Status badge config ─────────────────────────────────────── */
const STATUS_STYLES = {
  'New':            { background: '#0e2037', color: '#5aaef2' },
  'Contacted':      { background: '#232323', color: '#afafaf' },
  'Replied':        { background: '#371e06', color: '#e79913' },
  'Interested':     { background: '#0b2e1c', color: '#30a66d' },
  'Converted':      { background: '#173b2c', color: '#28a745' },
  'Do Not Contact': { background: '#361515', color: '#e03636' },
  'Junk':           { background: '#232323', color: '#7c7c7c' },
};

const STATUS_LIST = Object.keys(STATUS_STYLES);

const PROPERTY_TYPES = ['Flat', 'Villa', 'Plot', 'Commercial', 'Penthouse'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const PRIORITY_COLORS = {
  Low:    '#7c7c7c',
  Medium: '#e79913',
  High:   '#e03636',
  Urgent: '#e03636',
};

/* ─── Avatar color map ────────────────────────────────────────── */
function avatarColors(firstName) {
  const letter = (firstName || 'A')[0].toUpperCase();
  const code = letter.charCodeAt(0);
  if (code <= 69) return { background: '#0e2037', color: '#5aaef2' };
  if (code <= 74) return { background: '#0b2e1c', color: '#30a66d' };
  if (code <= 79) return { background: '#371e06', color: '#e79913' };
  if (code <= 84) return { background: '#2d1a4a', color: '#9c45e3' };
  return { background: '#361515', color: '#e03636' };
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
function DetailRow({ icon, label, value, isEditing, field, onUpdate, editComponent }) {
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
        {isEditing
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
export default function LeadSidebar({ lead, isEditing, onUpdate, activities = [] }) {
  const navigate = useNavigate();
  const { opportunities } = useOpportunities();
  if (!lead) return null;

  const linkedOpp = opportunities.find(
    o => o.linkedLeadId === lead.id
  );

  const initials =
    ((lead.firstName || '')[0] || '').toUpperCase() +
    ((lead.lastName || '')[0] || '').toUpperCase();
  const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(' ') || '—';
  const avColors = avatarColors(lead.firstName);
  const statusStyle = STATUS_STYLES[lead.status] || STATUS_STYLES['Contacted'];

  /* Cycle status on click */
  const handleStatusClick = () => {
    if (!isEditing) return;
    const idx = STATUS_LIST.indexOf(lead.status);
    const next = STATUS_LIST[(idx + 1) % STATUS_LIST.length];
    onUpdate('status', next);
  };

  /* Last note */
  const lastNote = activities
    .filter(a => a.type === 'note')
    .map(a => (typeof a.content === 'string' ? a.content : ''))[0] || null;

  const priorityColor = PRIORITY_COLORS[lead.priority] || '#7c7c7c';

  return (
    <div
      style={{
        background: '#0a0a0a',
        width: '320px',
        height: '100%',
        overflowY: 'auto',
        padding: '20px 16px',
        borderRight: '1px solid #1c1c1c',
        flexShrink: 0,
        fontFamily: 'Inter, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Avatar + Name ──────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            ...avColors,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: '600',
          }}
        >
          {initials || '?'}
        </div>
        <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: '600', color: '#f8f8f8', textAlign: 'center' }}>
          {fullName}
        </div>
        {(lead.jobTitle || lead.organization) && (
          <div style={{ fontSize: '12px', color: '#7c7c7c', textAlign: 'center', marginTop: '3px' }}>
            {[lead.jobTitle, lead.organization].filter(Boolean).join(' · ')}
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
            {lead.status}
          </span>
        </div>
      </div>

      {/* ── Quick actions ──────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
        <QuickBtn icon={<Phone size={15} color="#30a66d" />} tooltip="Call" />
        <QuickBtn icon={<Mail size={15} color="#5aaef2" />} tooltip="Email" />
        <QuickBtn icon={<MessageCircle size={15} color="#25D366" />} tooltip="WhatsApp" />
      </div>

      <Divider />

      {/* ── Contact Details ────────────────────────────────────── */}
      <SectionTitle>CONTACT DETAILS</SectionTitle>

      <DetailRow icon={<Mail size={14} />}       label="Email"        value={lead.email}        isEditing={isEditing} field="email"        onUpdate={onUpdate} />
      <DetailRow icon={<Phone size={14} />}      label="Mobile"       value={lead.mobile}       isEditing={isEditing} field="mobile"       onUpdate={onUpdate} />
      <DetailRow icon={<Building2 size={14} />}  label="Organization" value={lead.organization} isEditing={isEditing} field="organization" onUpdate={onUpdate} />
      <DetailRow icon={<Briefcase size={14} />}  label="Job Title"    value={lead.jobTitle}     isEditing={isEditing} field="jobTitle"     onUpdate={onUpdate} />
      <DetailRow icon={<MapPin size={14} />}     label="Territory"    value={lead.territory}    isEditing={isEditing} field="territory"    onUpdate={onUpdate} />
      <DetailRow icon={<Globe size={14} />}      label="Lead Source"  value={lead.leadSource}   isEditing={isEditing} field="leadSource"   onUpdate={onUpdate} />
      <DetailRow icon={<Calendar size={14} />}   label="Created On"   value={lead.createdOn}    isEditing={false}     field="createdOn"    onUpdate={onUpdate} />
      <DetailRow icon={<User size={14} />}       label="Assigned To"  value={lead.assignedTo || 'Unassigned'} isEditing={isEditing} field="assignedTo" onUpdate={onUpdate} />

      <Divider />

      {/* ── Property Interest ──────────────────────────────────── */}
      <SectionTitle>PROPERTY INTEREST</SectionTitle>

      <DetailRow
        icon={<Home size={14} />}
        label="Property Type"
        value={lead.propertyType}
        isEditing={isEditing}
        field="propertyType"
        onUpdate={onUpdate}
        editComponent={
          <EditSelect value={lead.propertyType} onChange={val => onUpdate('propertyType', val)} options={PROPERTY_TYPES} />
        }
      />
      <DetailRow
        icon={<IndianRupee size={14} />}
        label="Budget Range"
        value={lead.budgetRange}
        isEditing={isEditing}
        field="budgetRange"
        onUpdate={onUpdate}
        editComponent={
          <EditInput value={lead.budgetRange} onChange={val => onUpdate('budgetRange', val)} placeholder="e.g. 50L - 1Cr" />
        }
      />
      <DetailRow
        icon={<LayoutGrid size={14} />}
        label="Preferred Area"
        value={lead.preferredArea}
        isEditing={isEditing}
        field="preferredArea"
        onUpdate={onUpdate}
        editComponent={
          <EditInput value={lead.preferredArea} onChange={val => onUpdate('preferredArea', val)} placeholder="e.g. Gangapur Road" />
        }
      />
      <DetailRow
        icon={<CalendarCheck size={14} />}
        label="Follow-up Date"
        value={lead.followUpDate}
        isEditing={isEditing}
        field="followUpDate"
        onUpdate={onUpdate}
        editComponent={
          <EditInput type="date" value={lead.followUpDate} onChange={val => onUpdate('followUpDate', val)} />
        }
      />
      <DetailRow
        icon={<Star size={14} />}
        label="Priority"
        value={lead.priority}
        isEditing={isEditing}
        field="priority"
        onUpdate={onUpdate}
        editComponent={
          <EditSelect value={lead.priority} onChange={val => onUpdate('priority', val)} options={PRIORITIES} />
        }
      />
      {/* Priority badge (read mode) */}
      {!isEditing && lead.priority && (
        <div style={{ marginTop: '-8px', marginLeft: '24px', marginBottom: '14px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: lead.priority === 'Urgent' ? '700' : '500',
              color: priorityColor,
            }}
          >
            {/* already shown above as value */}
          </span>
        </div>
      )}

      <Divider />

      {/* ── Notes preview ──────────────────────────────────────── */}
      <SectionTitle>NOTES</SectionTitle>
      {lastNote ? (
        <div
          style={{
            background: '#171717',
            border: '1px solid #1c1c1c',
            borderRadius: '6px',
            padding: '10px 12px',
            fontSize: '12px',
            color: '#afafaf',
            lineHeight: '1.6',
          }}
        >
          {lastNote}
        </div>
      ) : (
        <div style={{ color: '#383838', fontSize: '12px' }}>No notes yet</div>
      )}

      <Divider />

      {/* ── Linked Opportunity ─────────────────────────────────── */}
      <SectionTitle>LINKED OPPORTUNITY</SectionTitle>
      
      {linkedOpp ? (
        <div
          onClick={() => navigate(`/crm/opportunities/${linkedOpp.id}`)}
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
          <Handshake size={14} color="#5aaef2" />
          <div>
            <div style={{ fontSize: 11, color: '#5aaef2' }}>
              {linkedOpp.id}
            </div>
            <div style={{ fontSize: 12, color: '#afafaf', marginTop: 2 }}>
              {linkedOpp.title}
            </div>
            <div style={{ fontSize: 11, color: linkedOpp.status === 'Won' ? '#28a745' : '#e79913', marginTop: 2 }}>
              {linkedOpp.status}
            </div>
          </div>
        </div>
      ) : lead.status === 'Converted' ? (
        <span style={{ color: '#e79913', fontSize: 12 }}>
          Linked opportunity not found
        </span>
      ) : (
        <span style={{ color: '#383838', fontSize: 12 }}>
          Not yet converted
        </span>
      )}
    </div>
  );
}
