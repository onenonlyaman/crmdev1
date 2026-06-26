/**
 * ListPage — shared/ListPage/ListPage.jsx
 * Master reusable list page component for BOS CRM.
 * Config-driven: every module list (Lead, Opportunity, Customer, etc.)
 * passes a config object — zero changes needed inside this component.
 *
 *  HOW TO ADD A NEW MODULE LIST PAGE:
 *
 *  1. Create /modules/crm/[module]/[Module]List.jsx
 *  2. Define a config object (copy from OpportunityList)
 *  3. Create a [Module]Context.jsx (copy from OpportunitiesContext)
 *  4. Create Add[Module]Modal.jsx (copy from AddOpportunityModal)
 *  5. Add route in App.jsx
 *  6. Add to sidebar config
 *
 *  Zero changes needed in ListPage, ListFilterBar,
 *  FilterChip, ListTable, or ListEmptyState.
 *
 * Props:
 *   config     — config object (see OpportunityList for shape)
 *   items      — array of records from context
 *   onAdd      — callback when save is clicked in modal
 *   onRowClick — callback when a table row is clicked
 *   AddModal   — the Add modal component (passed as a prop)
 */
import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  LayoutList, Bookmark, RefreshCw, MoreHorizontal,
  Plus, ChevronsUpDown,
} from 'lucide-react';
import { TopbarContext } from '../../../context/TopbarContext';
import ListFilterBar from './ListFilterBar';
import FilterPanel from './FilterPanel';
import ListTable from './ListTable';
import ListEmptyState from './ListEmptyState';

/* ─── useHover ────────────────────────────────────────────────── */
function useHover() {
  const [hov, setHov] = useState(false);
  return [hov, { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) }];
}

/* ─── Topbar action buttons ───────────────────────────────────── */
function TopbarBtn({ children, style, ...props }) {
  const [hov, hoverProps] = useHover();
  return (
    <button
      {...props}
      {...hoverProps}
      style={{
        background: hov ? '#2b2b2b' : '#1c1c1c',
        border: '1px solid #2b2b2b',
        borderRadius: '6px',
        padding: '4px 10px',
        height: '28px',
        fontSize: '12px',
        color: hov ? '#f8f8f8' : '#afafaf',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.15s, color 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function AddBtn({ label, onClick }) {
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
        height: '28px',
        fontSize: '12px',
        fontWeight: '500',
        color: '#111111',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.15s',
      }}
    >
      <Plus size={13} color="#111111" />
      {label}
    </button>
  );
}

function TopbarActions({ config, onAdd }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <TopbarBtn>
        <LayoutList size={13} />
        List View
        <ChevronsUpDown size={11} color="#424242" />
      </TopbarBtn>
      <TopbarBtn>
        <Bookmark size={13} />
        Saved Filters
        <ChevronsUpDown size={11} color="#424242" />
      </TopbarBtn>
      <TopbarBtn style={{ padding: '4px 7px' }}>
        <RefreshCw size={13} color="#7c7c7c" />
      </TopbarBtn>
      <TopbarBtn style={{ padding: '4px 7px' }}>
        <MoreHorizontal size={13} color="#7c7c7c" />
      </TopbarBtn>
      <AddBtn label={config.addButtonLabel} onClick={onAdd} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  ListPage Component                                            */
/* ═══════════════════════════════════════════════════════════════ */
export default function ListPage({ config, items, onAdd, onRowClick, AddModal }) {
  const { setRightActions } = useContext(TopbarContext);
  const [showModal, setShowModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [openOperator, setOpenOperator] = useState(null);
  const [filters, setFilters] = useState([
    { id: Date.now(), field: (config.filterFields || ['ID'])[0], operator: 'Equals', value: '' },
  ]);

  /* Close operator dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.operator-dropdown')) {
        setOpenOperator(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleIconClick = useCallback((key) => {
    setOpenOperator(prev => (prev === key ? null : key));
  }, []);

  /* Inject topbar actions */
  useEffect(() => {
    setRightActions(
      <TopbarActions config={config} onAdd={() => setShowModal(true)} />
    );
    return () => setRightActions(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Re-inject when showModal changes so the Add button stays wired */
  useEffect(() => {
    setRightActions(
      <TopbarActions config={config} onAdd={() => setShowModal(true)} />
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#0f0f0f',
        position: 'relative',
      }}
    >
      {/* ── FILTER BAR ──────────────────────────────────────────── */}
      <ListFilterBar
        config={config}
        openOperator={openOperator}
        onIconClick={handleIconClick}
        showFilterPanel={showFilterPanel}
        onToggleFilterPanel={() => setShowFilterPanel(prev => !prev)}
      />

      {/* ── FILTER PANEL ────────────────────────────────────────── */}
      <FilterPanel
        config={config}
        filters={filters}
        setFilters={setFilters}
        onClose={() => setShowFilterPanel(false)}
        isOpen={showFilterPanel}
      />

      {/* ── CONTENT ─────────────────────────────────────────────── */}
      {items.length === 0 ? (
        <ListEmptyState
          config={config}
          onCreateClick={() => setShowModal(true)}
        />
      ) : (
        <ListTable
          config={config}
          items={items}
          onRowClick={onRowClick}
        />
      )}

      {/* ── ADD MODAL ───────────────────────────────────────────── */}
      {AddModal && (
        <AddModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            onAdd(data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
