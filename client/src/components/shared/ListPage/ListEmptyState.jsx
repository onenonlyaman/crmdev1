/**
 * ListEmptyState — shared/ListPage/ListEmptyState.jsx
 * Config-driven empty state with dynamic lucide icon.
 * Props: config, onCreateClick
 */
import React, { useState } from 'react';
import * as Icons from 'lucide-react';

function useHover() {
  const [hov, setHov] = useState(false);
  return [hov, { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) }];
}

export default function ListEmptyState({ config, onCreateClick }) {
  const [hov, hoverProps] = useHover();
  const Icon = Icons[config.emptyIcon] || Icons.FileText;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        background: '#0f0f0f',
      }}
    >
      <Icon size={52} color="#2b2b2b" strokeWidth={1} />
      <p
        style={{
          fontSize: '14px',
          color: '#6b6b6b',
          margin: '16px 0 0',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {config.emptyTitle}
      </p>
      <button
        {...hoverProps}
        onClick={onCreateClick}
        style={{
          marginTop: '14px',
          background: hov ? '#232323' : '#1c1c1c',
          border: '1px solid #2b2b2b',
          borderRadius: '20px',
          padding: '8px 22px',
          fontSize: '13px',
          color: '#f8f8f8',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          transition: 'background 0.15s',
        }}
      >
        {config.emptyButtonText}
      </button>
    </div>
  );
}
