import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import SidebarBrand from './SidebarBrand';
import SidebarNavItem from './SidebarNavItem';
import SidebarFooter from './SidebarFooter';
import { SIDEBAR_CONFIG } from './sidebar.config';

function SidebarSectionLabel({ label, isOpen, onToggle, isCollapsed }) {
  if (isCollapsed) return null;

  return (
    <div
      onClick={onToggle}
      style={{
        padding: '10px 16px 4px',
        fontSize: '11px',
        fontWeight: 500,
        color: '#383838',
        letterSpacing: '0.04em',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
      {label}
    </div>
  );
}

export default function Sidebar({ isCollapsed, setIsCollapsed, onOpenNotifications }) {
  const [crmOpen, setCrmOpen] = useState(true);
  const [publicViewsOpen, setPublicViewsOpen] = useState(true);
  const [pinnedViewsOpen, setPinnedViewsOpen] = useState(true);

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: isCollapsed ? '48px' : '220px',
        minWidth: isCollapsed ? '48px' : '220px',
        height: '100vh',
        background: '#0f0f0f',
        borderRight: '1px solid #1c1c1c',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
        transition: 'width 0.2s ease, min-width 0.2s ease',
        zIndex: 40,
      }}
    >
      <SidebarBrand
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(prev => !prev)}
      />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '4px 0',
        }}
      >
        {/* ─── CRM SIDEBAR (DEFAULT) ──────────────────────────────────────── */}
        <>
          {/* Notifications placed outside the CRM collapsible folder */}
          {SIDEBAR_CONFIG.main.filter(item => item.key === 'notifications').map(item => (
            <SidebarNavItem 
              key={item.key} 
              item={item} 
              isCollapsed={isCollapsed} 
              onClick={onOpenNotifications}
            />
          ))}

          <SidebarSectionLabel
            label="CRM"
            isOpen={crmOpen}
            onToggle={() => setCrmOpen(p => !p)}
            isCollapsed={isCollapsed}
          />
          <div
            style={{
              maxHeight: crmOpen ? '800px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.2s ease',
            }}
          >
            {SIDEBAR_CONFIG.main.filter(item => item.key !== 'notifications').map(item => (
              <SidebarNavItem 
                key={item.key} 
                item={item} 
                isCollapsed={isCollapsed} 
              />
            ))}
          </div>

          <SidebarSectionLabel
            label="Public Views"
            isOpen={publicViewsOpen}
            onToggle={() => setPublicViewsOpen(p => !p)}
            isCollapsed={isCollapsed}
          />
          <div
            style={{
              maxHeight: publicViewsOpen ? '500px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.2s ease',
            }}
          >
            {SIDEBAR_CONFIG.publicViews.map(item => (
              <SidebarNavItem key={item.key} item={item} isCollapsed={isCollapsed} />
            ))}
          </div>

          <SidebarSectionLabel
            label="Pinned Views"
            isOpen={pinnedViewsOpen}
            onToggle={() => setPinnedViewsOpen(p => !p)}
            isCollapsed={isCollapsed}
          />
          <div
            style={{
              maxHeight: pinnedViewsOpen ? '500px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.2s ease',
            }}
          >
            {SIDEBAR_CONFIG.pinnedViews.map(item => (
              <SidebarNavItem key={item.key} item={item} isCollapsed={isCollapsed} />
            ))}
          </div>
        </>
      </div>

      <SidebarFooter isCollapsed={isCollapsed} />
    </aside>
  );
}

