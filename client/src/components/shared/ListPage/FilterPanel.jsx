/**
 * FilterPanel — shared/ListPage/FilterPanel.jsx
 * Config-driven floating filter panel.
 * Props: config, filters, setFilters, onClose, isOpen
 */
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const OPERATOR_OPTIONS = [
  'Equals', 'Like', 'Not Equals', 'Is Empty', 'Is Not Empty',
];

const EMPTY_ROW = (defaultField) => ({
  id: Date.now() + Math.random(),
  field: defaultField || 'ID',
  operator: 'Equals',
  value: '',
});

/* ─── shared input style ─────────────────────────────────────── */
const selectStyle = {
  background: '#232323',
  border: '1px solid #343434',
  borderRadius: '6px',
  padding: '6px 10px',
  fontSize: '12.5px',
  color: '#f8f8f8',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  cursor: 'pointer',
};

export default function FilterPanel({ config, filters, setFilters, onClose, isOpen }) {
  const panelRef = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        if (!e.target.closest('.filter-bar-filter-btn')) {
          onClose();
        }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const fields = config.filterFields || ['ID'];

  function addRow() {
    setFilters(prev => [...prev, EMPTY_ROW(fields[0])]);
  }

  function removeRow(id) {
    setFilters(prev =>
      prev.length === 1 ? [EMPTY_ROW(fields[0])] : prev.filter(r => r.id !== id)
    );
  }

  function updateRow(id, key, val) {
    setFilters(prev => prev.map(r => (r.id === id ? { ...r, [key]: val } : r)));
  }

  function clearFilters() {
    setFilters([EMPTY_ROW(fields[0])]);
  }

  function applyFilters() {
    console.log('Applied filters:', filters);
    onClose();
  }

  return (
    <div
      ref={panelRef}
      className="filter-panel"
      style={{
        position: 'absolute',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        background: '#1a1a1a',
        border: '1px solid #2b2b2b',
        borderRadius: '10px',
        padding: '16px',
        minWidth: '520px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Caret arrow */}
      <div
        style={{
          position: 'absolute',
          top: '-7px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderBottom: '7px solid #2b2b2b',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: '6px solid #1a1a1a',
        }}
      />

      {/* Filter rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filters.map(row => (
          <FilterRow
            key={row.id}
            row={row}
            fields={fields}
            onUpdate={(key, val) => updateRow(row.id, key, val)}
            onRemove={() => removeRow(row.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          borderTop: '1px solid #232323',
          paddingTop: '12px',
        }}
      >
        <AddRowBtn onClick={addRow} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <PanelBtn
            onClick={clearFilters}
            style={{
              background: 'transparent',
              border: '1px solid #343434',
              color: '#afafaf',
            }}
            hoverStyle={{ background: '#232323', color: '#f8f8f8' }}
          >
            Clear Filters
          </PanelBtn>
          <PanelBtn
            onClick={applyFilters}
            style={{
              background: '#f3f4f6',
              border: 'none',
              color: '#111111',
              fontWeight: '500',
            }}
            hoverStyle={{ background: '#e5e7eb' }}
          >
            Apply Filters
          </PanelBtn>
        </div>
      </div>
    </div>
  );
}

/* ─── Filter row ─────────────────────────────────────────────── */
function FilterRow({ row, fields, onUpdate, onRemove }) {
  const [removeHov, setRemoveHov] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <select
        value={row.field}
        onChange={e => onUpdate('field', e.target.value)}
        style={{ ...selectStyle, width: '160px' }}
      >
        {fields.map(opt => (
          <option key={opt} value={opt} style={{ background: '#232323' }}>
            {opt}
          </option>
        ))}
      </select>

      <select
        value={row.operator}
        onChange={e => onUpdate('operator', e.target.value)}
        style={{ ...selectStyle, width: '130px' }}
      >
        {OPERATOR_OPTIONS.map(opt => (
          <option key={opt} value={opt} style={{ background: '#232323' }}>
            {opt}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={row.value}
        onChange={e => onUpdate('value', e.target.value)}
        placeholder=""
        style={{ ...selectStyle, flex: 1, cursor: 'text' }}
      />

      <button
        onClick={onRemove}
        onMouseEnter={() => setRemoveHov(true)}
        onMouseLeave={() => setRemoveHov(false)}
        title="Remove filter"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: removeHov ? '#f8f8f8' : '#6b6b6b',
          display: 'flex',
          alignItems: 'center',
          padding: '4px',
          transition: 'color 0.15s',
          flexShrink: 0,
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}

/* ─── Add row button ─────────────────────────────────────────── */
function AddRowBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'transparent',
        border: 'none',
        color: hov ? '#f8f8f8' : '#7c7c7c',
        fontSize: '12.5px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'color 0.15s',
        padding: 0,
      }}
    >
      + Add a Filter
    </button>
  );
}

/* ─── Generic panel button ───────────────────────────────────── */
function PanelBtn({ children, onClick, style, hoverStyle }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: '6px',
        padding: '6px 14px',
        fontSize: '12.5px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.15s, color 0.15s',
        ...style,
        ...(hov ? hoverStyle : {}),
      }}
    >
      {children}
    </button>
  );
}
