import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function SidebarBrand({ isCollapsed, onToggleCollapse }) {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderBottom: '1px solid #1c1c1c',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '4px',
        flexShrink: 0,
        height: '52px',
        boxSizing: 'border-box',
      }}
    >
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            backgroundColor: '#171717',
            border: '1px solid #2b2b2b',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
            color: '#f8f8f8',
            flexShrink: 0,
          }}
        >
          B
        </div>

        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#f8f8f8', whiteSpace: 'nowrap' }}>
                BOS
              </span>
            </div>
          </div>
        )}
      </Link>

      {!isCollapsed && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleCollapse();
          }}
          aria-label="Collapse sidebar"
          style={{
            marginLeft: 'auto',
            color: '#424242',
            cursor: 'pointer',
            padding: '2px',
            borderRadius: '4px',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.1s',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#7c7c7c'}
          onMouseLeave={e => e.currentTarget.style.color = '#424242'}
        >
          <ChevronLeft size={14} />
        </button>
      )}
    </div>
  );
}

