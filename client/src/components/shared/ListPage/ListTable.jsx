/**
 * ListTable — shared/ListPage/ListTable.jsx
 * Config-driven data table with status badges and currency formatting.
 * Props: config, items, onRowClick
 */
import React, { useState } from 'react';

/* ─── useHover ────────────────────────────────────────────────── */
function useHover() {
  const [hov, setHov] = useState(false);
  return [hov, { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) }];
}

/* ─── Currency formatter ──────────────────────────────────────── */
const currencyFmt = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/* ─── Status Badge ────────────────────────────────────────────── */
function StatusBadge({ value, statusColors }) {
  const s = statusColors[value] || { bg: '#232323', color: '#afafaf' };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: '2px 8px',
        borderRadius: '10px',
        fontSize: '11px',
        fontWeight: '500',
        display: 'inline-block',
      }}
    >
      {value}
    </span>
  );
}

/* ─── Table Row ───────────────────────────────────────────────── */
function TableRow({ item, columns, config, onRowClick }) {
  const [hov, hoverProps] = useHover();
  return (
    <tr
      {...hoverProps}
      onClick={() => onRowClick(item)}
      style={{
        background: hov ? '#171717' : '#0a0a0a',
        borderBottom: '1px solid #1c1c1c',
        cursor: 'pointer',
        transition: 'background 0.1s',
      }}
    >
      {columns.map(col => {
        const cellValue = col.render ? col.render(item) : (item[col.key] ?? '');

        if (col.type === 'badge') {
          return (
            <td key={col.key} style={{ padding: '10px 14px' }}>
              <StatusBadge value={cellValue} statusColors={config.statusColors || {}} />
            </td>
          );
        }

        if (col.key === 'amount' && cellValue) {
          return (
            <td key={col.key} style={{ padding: '10px 14px', color: '#e2e2e2' }}>
              {currencyFmt.format(cellValue)}
            </td>
          );
        }

        return (
          <td key={col.key} style={{ padding: '10px 14px', color: '#e2e2e2' }}>
            {cellValue || '—'}
          </td>
        );
      })}
    </tr>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function ListTable({ config, items, onRowClick }) {
  const columns = config.columns || [];

  return (
    <div style={{ overflowX: 'auto', flex: 1, background: '#0f0f0f' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '12.5px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <thead>
          <tr style={{ background: '#0f0f0f', borderBottom: '1px solid #232323' }}>
            {columns.map(col => (
              <th
                key={col.key}
                style={{
                  padding: '10px 14px',
                  color: '#7c7c7c',
                  fontWeight: '500',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <TableRow
              key={item.id}
              item={item}
              columns={columns}
              config={config}
              onRowClick={onRowClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
