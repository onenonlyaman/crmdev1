/**
 * CustomerSidebar — client/src/modules/crm/customers/components/CustomerSidebar.jsx
 * Left sidebar on the Customer Detail page.
 * Shows avatar, name, group, status, deal value, quick actions,
 * contact details, business details, property purchases, and linked opportunities.
 * Props: customer, isEditing, onUpdate
 */
import React, { useState } from 'react';
import {
  Phone, Mail, MessageCircle, MapPin, User,
  Briefcase, Calendar, Home, IndianRupee,
  FileText, CreditCard, Handshake,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOpportunities } from '../../../../context/OpportunitiesContext';

/* ─── Status config ───────────────────────────────────────────── */
const STATUS_STYLES = {
  'Active':   { background: '#173b2c', color: '#28a745' },
  'Inactive': { background: '#361515', color: '#e03636' },
  'Lead':     { background: '#0e2037', color: '#5aaef2' },
};
const STATUS_LIST = Object.keys(STATUS_STYLES);

const CUSTOMER_GROUPS = ['Individual', 'Company', 'Builder', 'Investor', 'Government'];

/* ─── Avatar color map ────────────────────────────────────────── */
function avatarColors(name) {
  const letter = (name || 'A')[0].toUpperCase();
  const code = letter.charCodeAt(0);
  if (code <= 69) return { background: '#0e2037', color: '#5aaef2' };
  if (code <= 74) return { background: '#0b2e1c', color: '#30a66d' };
  if (code <= 79) return { background: '#371e06', color: '#e79913' };
  if (code <= 84) return { background: '#2d1a4a', color: '#9c45e3' };
  return { background: '#361515', color: '#e03636' };
}

/* ─── Indian number format ────────────────────────────────────── */
function formatINR(value) {
  if (!value && value !== 0) return '₹0';
  const num = Number(value);
  if (isNaN(num)) return '₹0';
  return '₹ ' + num.toLocaleString('en-IN');
}

/* ─── useHover ────────────────────────────────────────────────── */
function useHover() {
  const [hov, setHov] = useState(false);
  return [hov, { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) }];
}

/* ─── Editable input ──────────────────────────────────────────── */
function EditInput({ value, onChange, type = 'text', placeholder }) {
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
        width: '36px', height: '36px',
        background: hov ? '#232323' : '#171717',
        border: `1px solid ${hov ? '#388AE5' : '#2b2b2b'}`,
        borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
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
        <div style={{ fontSize: '10px', color: '#424242', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
          {label}
        </div>
        {(isEditing && !readOnly)
          ? (editComponent || <EditInput value={value} onChange={val => onUpdate(field, val)} />)
          : <div style={{ fontSize: '13px', color: '#e2e2e2', wordBreak: 'break-word' }}>{value || '—'}</div>
        }
      </div>
    </div>
  );
}

/* ─── Section title ───────────────────────────────────────────── */
function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: '10px', fontWeight: '600', color: '#424242', letterSpacing: '0.08em', marginBottom: '12px' }}>
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
export default function CustomerSidebar({ customer, isEditing, onUpdate }) {
  const navigate = useNavigate();
  const { opportunities } = useOpportunities();
  if (!customer) return null;

  const linkedOpp = opportunities.find(
    o => o.id === customer.linkedOpportunityId
  );

  const name = customer.customerName || '';
  const initials = name.slice(0, 2).toUpperCase() || '??';
  const avColors = avatarColors(name);
  const statusStyle = STATUS_STYLES[customer.status] || STATUS_STYLES['Active'];

  const handleStatusClick = () => {
    if (!isEditing) return;
    const idx = STATUS_LIST.indexOf(customer.status);
    const next = STATUS_LIST[(idx + 1) % STATUS_LIST.length];
    onUpdate('status', next);
  };

  const hasPurchases = customer.totalDeals && Number(customer.totalDeals) > 0;

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
      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Avatar */}
        <div
          style={{
            width: '60px', height: '60px', borderRadius: '50%',
            ...avColors,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', fontWeight: '600',
          }}
        >
          {initials}
        </div>

        {/* Name */}
        <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: '600', color: '#f8f8f8', textAlign: 'center' }}>
          {name || '—'}
        </div>

        {/* Customer group badge */}
        {customer.customerGroup && (
          <div
            style={{
              fontSize: '11px', color: '#afafaf',
              background: '#232323', borderRadius: '10px',
              padding: '2px 10px', marginTop: '6px',
            }}
          >
            {customer.customerGroup}
          </div>
        )}

        {/* Status badge */}
        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
          <span
            onClick={handleStatusClick}
            style={{
              ...statusStyle,
              padding: '3px 12px', borderRadius: '12px',
              fontSize: '11px', fontWeight: '500',
              display: 'inline-block',
              cursor: isEditing ? 'pointer' : 'default',
              transition: 'transform 0.1s',
            }}
          >
            {customer.status || 'Active'}
          </span>
        </div>

        {/* Total deal value */}
        <div style={{ marginTop: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#424242', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
            TOTAL DEAL VALUE
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#f8f8f8' }}>
            {formatINR(customer.totalValue)}
          </div>
        </div>
      </div>

      {/* ── Quick actions ───────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
        <QuickBtn icon={<Phone size={15} color="#30a66d" />} tooltip="Call" />
        <QuickBtn icon={<Mail size={15} color="#5aaef2" />} tooltip="Email" />
        <QuickBtn icon={<MessageCircle size={15} color="#25D366" />} tooltip="WhatsApp" />
      </div>

      <Divider />

      {/* ── Contact Details ─────────────────────────────────────── */}
      <SectionTitle>CONTACT DETAILS</SectionTitle>

      <DetailRow icon={<Mail size={14} />}     label="Email"          value={customer.email}         isEditing={isEditing} field="email"         onUpdate={onUpdate} />
      <DetailRow icon={<Phone size={14} />}    label="Mobile"         value={customer.mobile}        isEditing={isEditing} field="mobile"        onUpdate={onUpdate} />
      <DetailRow icon={<MapPin size={14} />}   label="Territory"      value={customer.territory}     isEditing={isEditing} field="territory"     onUpdate={onUpdate} />
      <DetailRow icon={<User size={14} />}     label="Contact Person" value={customer.contactPerson} isEditing={isEditing} field="contactPerson" onUpdate={onUpdate} />
      <DetailRow
        icon={<Briefcase size={14} />}
        label="Customer Group"
        value={customer.customerGroup}
        isEditing={isEditing}
        field="customerGroup"
        onUpdate={onUpdate}
        editComponent={
          <EditSelect value={customer.customerGroup} onChange={val => onUpdate('customerGroup', val)} options={CUSTOMER_GROUPS} />
        }
      />

      <Divider />

      {/* ── Business Details ────────────────────────────────────── */}
      <SectionTitle>BUSINESS DETAILS</SectionTitle>

      <DetailRow
        icon={<FileText size={14} />}
        label="GSTIN"
        value={customer.gstin}
        isEditing={isEditing}
        field="gstin"
        onUpdate={onUpdate}
        editComponent={<EditInput value={customer.gstin} onChange={val => onUpdate('gstin', val)} placeholder="22AAAAA0000A1Z5" />}
      />
      <DetailRow
        icon={<CreditCard size={14} />}
        label="PAN Number"
        value={customer.panNumber}
        isEditing={isEditing}
        field="panNumber"
        onUpdate={onUpdate}
        editComponent={<EditInput value={customer.panNumber} onChange={val => onUpdate('panNumber', val)} placeholder="ABCDE1234F" />}
      />
      <DetailRow icon={<User size={14} />}     label="Assigned To" value={customer.assignedTo || 'Unassigned'} isEditing={isEditing} field="assignedTo" onUpdate={onUpdate} />
      <DetailRow icon={<Calendar size={14} />} label="Created On"  value={customer.createdOn} isEditing={isEditing} field="createdOn" onUpdate={onUpdate} readOnly />

      <Divider />

      {/* ── Property Purchases ──────────────────────────────────── */}
      <SectionTitle>PROPERTY PURCHASES</SectionTitle>

      {hasPurchases ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
            <div style={{ flexShrink: 0, marginTop: '2px', color: '#424242' }}><Home size={14} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '10px', color: '#424242', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Properties Bought
              </div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#f8f8f8' }}>
                {customer.totalDeals || 0}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
            <div style={{ flexShrink: 0, marginTop: '2px', color: '#424242' }}><IndianRupee size={14} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '10px', color: '#424242', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Total Value
              </div>
              <div style={{ fontSize: '13px', color: '#e2e2e2' }}>
                {formatINR(customer.totalValue)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ color: '#383838', fontSize: '12px' }}>No property purchases yet</div>
      )}

      <Divider />

      {/* ── Linked Opportunities ────────────────────────────────── */}
      <SectionTitle>LINKED OPPORTUNITIES</SectionTitle>
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
            <div style={{ fontSize: 11, color: '#28a745', marginTop: 2 }}>
              ₹{linkedOpp.amount?.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      ) : (
        <span style={{ color: '#383838', fontSize: 12 }}>
          No linked opportunities
        </span>
      )}
    </div>
  );
}
