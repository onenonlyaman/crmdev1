/**
 * OperatorDropdown — shared/ListPage/OperatorDropdown.jsx
 * Portal-rendered operator dropdown (Equals, Like, etc.).
 * Props: anchorRect, type, onSelect, onClose
 */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const OPERATORS = {
  text:   ['Equals', 'Like'],
  select: ['Equals', 'Not Equals', 'Is Empty', 'Is Not Empty'],
  date:   ['Equals', 'Before', 'After', 'Between', 'Is Empty'],
};

function useHover() {
  const [hov, setHov] = useState(false);
  return [hov, { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) }];
}

function Option({ label, onSelect }) {
  const [hov, hoverProps] = useHover();
  return (
    <div
      {...hoverProps}
      onMouseDown={e => { e.preventDefault(); e.stopPropagation(); onSelect(); }}
      style={{
        padding: '6px 14px',
        fontSize: '12.5px',
        color: hov ? '#f8f8f8' : '#afafaf',
        background: hov ? '#2b2b2b' : 'transparent',
        cursor: 'pointer',
        transition: 'background 0.1s, color 0.1s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  );
}

export default function OperatorDropdown({ anchorRect, type = 'text', onSelect, onClose }) {
  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.operator-dropdown')) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  if (!anchorRect) return null;

  const operators = OPERATORS[type] || OPERATORS.text;

  return ReactDOM.createPortal(
    <div
      className="operator-dropdown"
      style={{
        position: 'fixed',
        top: anchorRect.bottom + 4,
        left: anchorRect.left,
        background: '#1c1c1c',
        border: '1px solid #343434',
        borderRadius: '6px',
        padding: '4px 0',
        zIndex: 9999,
        minWidth: '130px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {operators.map(op => (
        <Option key={op} label={op} onSelect={() => { onSelect(op); onClose(); }} />
      ))}
    </div>,
    document.body
  );
}
