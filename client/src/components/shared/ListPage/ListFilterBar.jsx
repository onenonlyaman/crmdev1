/**
 * ListFilterBar — shared/ListPage/ListFilterBar.jsx
 * Config-driven filter chips bar with Filter toggle, Clear, and Sort buttons.
 * Props: config, openOperator, onIconClick, showFilterPanel, onToggleFilterPanel
 */
import React, { useState, useCallback } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import FilterChip from './FilterChip';

/* ─── useHover ────────────────────────────────────────────────── */
function useHover() {
  const [hov, setHov] = useState(false);
  return [hov, { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) }];
}

/* ─── Filter toggle button ────────────────────────────────────── */
function FilterBtn({ active, onClick }) {
  const [hov, hoverProps] = useHover();
  return (
    <div
      {...hoverProps}
      onClick={onClick}
      className="filter-bar-filter-btn"
      style={{
        height: '26px',
        background: active ? '#232323' : '#171717',
        border: `1px solid ${active || hov ? '#383838' : '#2b2b2b'}`,
        borderRadius: '5px',
        padding: '0 8px',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        color: active ? '#f8f8f8' : hov ? '#afafaf' : '#6b6b6b',
        transition: 'border-color 0.15s, color 0.15s, background 0.15s',
        flexShrink: 0,
      }}
    >
      <SlidersHorizontal size={11} />
      Filter
    </div>
  );
}

/* ─── Clear chip ──────────────────────────────────────────────── */
function ClearChip() {
  const [hov, hoverProps] = useHover();
  return (
    <div
      {...hoverProps}
      style={{
        height: '26px',
        background: '#171717',
        border: `1px solid ${hov ? '#383838' : '#2b2b2b'}`,
        borderRadius: '5px',
        width: '26px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: hov ? '#afafaf' : '#7c7c7c',
        transition: 'border-color 0.15s, color 0.15s',
      }}
    >
      <X size={11} />
    </div>
  );
}

/* ─── Created On sort chip ────────────────────────────────────── */
function SortChip() {
  const [hov, hoverProps] = useHover();
  return (
    <div
      {...hoverProps}
      style={{
        height: '26px',
        background: '#171717',
        border: `1px solid ${hov ? '#383838' : '#2b2b2b'}`,
        borderRadius: '5px',
        padding: '0 8px',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        color: hov ? '#afafaf' : '#6b6b6b',
        transition: 'border-color 0.15s, color 0.15s',
        marginLeft: 'auto',
        flexShrink: 0,
      }}
    >
      Created On
      <ChevronDown size={11} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function ListFilterBar({
  config,
  openOperator,
  onIconClick,
  showFilterPanel,
  onToggleFilterPanel,
}) {
  return (
    <div
      style={{
        height: '40px',
        minHeight: '40px',
        background: '#0a0a0a',
        borderBottom: '1px solid #1c1c1c',
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        flexShrink: 0,
      }}
    >
      {config.filterChips.map(chip => (
        <FilterChip
          key={chip.key}
          chipKey={chip.key}
          label={chip.label}
          fullLabel={chip.fullLabel}
          showApprox={chip.showApprox}
          showChevron={chip.showChevron}
          openOperator={openOperator}
          onIconClick={onIconClick}
          style={chip.style}
        />
      ))}

      <FilterBtn
        active={showFilterPanel}
        onClick={onToggleFilterPanel}
      />

      <ClearChip />
      <SortChip />
    </div>
  );
}
