/**
 * FilterChip — shared/ListPage/FilterChip.jsx
 * Single filter chip with optional ≈ or ▾ icon, tooltip, and operator dropdown.
 * Props: chipKey, label, fullLabel, showApprox, showChevron, style,
 *        openOperator, onIconClick
 */
import React, { useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown } from 'lucide-react';
import OperatorDropdown from './OperatorDropdown';

/* ─── Portal tooltip ──────────────────────────────────────────── */
function PortalTooltip({ anchorRect, text }) {
  if (!anchorRect) return null;
  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: anchorRect.bottom + 6,
        left: anchorRect.left + anchorRect.width / 2,
        transform: 'translateX(-50%)',
        background: '#1c1c1c',
        border: '1px solid #343434',
        borderRadius: '6px',
        padding: '4px 10px',
        fontSize: '12px',
        color: '#f8f8f8',
        whiteSpace: 'nowrap',
        zIndex: 9998,
        pointerEvents: 'none',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {text}
    </div>,
    document.body
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function FilterChip({
  chipKey,
  label,
  fullLabel,
  showApprox,
  showChevron,
  openOperator,
  onIconClick,
  style,
}) {
  const [chipHov, setChipHov] = useState(false);
  const [iconHov, setIconHov] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [chipRect, setChipRect] = useState(null);
  const [iconRect, setIconRect] = useState(null);
  const chipRef = useRef(null);
  const iconRef = useRef(null);

  const hasIcon = showApprox || showChevron;
  const isOpen = openOperator === chipKey;
  const opType = showChevron ? 'select' : 'text';

  const updateChipRect = useCallback(() => {
    if (chipRef.current) setChipRect(chipRef.current.getBoundingClientRect());
  }, []);
  const updateIconRect = useCallback(() => {
    if (iconRef.current) setIconRect(iconRef.current.getBoundingClientRect());
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flex: 1 }}>
      {/* Chip body */}
      <div
        ref={chipRef}
        onMouseEnter={() => { setChipHov(true); setShowTip(true); updateChipRect(); }}
        onMouseLeave={() => { setChipHov(false); setShowTip(false); }}
        style={{
          height: '26px',
          background: '#171717',
          border: `1px solid ${chipHov ? '#383838' : '#2b2b2b'}`,
          borderRadius: '5px',
          padding: hasIcon ? '0 0 0 8px' : '0 8px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
          minWidth: 0,
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          transition: 'border-color 0.15s',
          color: chipHov ? '#afafaf' : '#6b6b6b',
          ...style,
        }}
      >
        <span
          style={{
            flex: 1,
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </span>

        {hasIcon && (
          <div
            ref={iconRef}
            onMouseEnter={() => { setIconHov(true); setShowTip(false); updateIconRect(); }}
            onMouseLeave={() => { setIconHov(false); }}
            onClick={e => {
              e.stopPropagation();
              updateIconRect();
              onIconClick(chipKey);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '0 8px',
              borderLeft: `1px solid ${chipHov ? '#383838' : '#2b2b2b'}`,
              borderRadius: '0 4px 4px 0',
              background: iconHov ? '#343434' : 'transparent',
              cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            {showApprox && (
              <span
                style={{
                  color: iconHov ? '#f8f8f8' : '#5a5a5a',
                  fontSize: '14px',
                  lineHeight: 1,
                  transition: 'color 0.15s',
                }}
              >
                ≈
              </span>
            )}
            {showChevron && (
              <ChevronDown
                size={11}
                color={iconHov ? '#f8f8f8' : '#6b6b6b'}
                style={{ transition: 'color 0.15s' }}
              />
            )}
          </div>
        )}
      </div>

      {/* Tooltip — via portal */}
      {showTip && !isOpen && chipRect && (
        <PortalTooltip anchorRect={chipRect} text={fullLabel || label} />
      )}

      {/* Operator dropdown — via portal */}
      {isOpen && iconRect && (
        <OperatorDropdown
          anchorRect={iconRect}
          type={opType}
          onSelect={() => {}}
          onClose={() => onIconClick(null)}
        />
      )}
    </div>
  );
}
