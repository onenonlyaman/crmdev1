/**
 * EmptyChart.jsx
 * "No Data" placeholder used inside chart cards with empty datasets.
 */
import React from 'react';

export default function EmptyChart({ height = 160 }) {
  return (
    <div
      style={{
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ fontSize: '15px', color: '#383838', userSelect: 'none' }}>
        No Data
      </span>
    </div>
  );
}
