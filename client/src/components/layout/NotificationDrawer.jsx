import React from 'react';
import { X, Bell } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 100,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Drawer */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '400px',
          background: 'var(--bg-color)',
          borderLeft: '1px solid var(--border-color)',
          zIndex: 101,
          boxShadow: '-4px 0 15px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Bell size={18} color="var(--heading-color)" />
             <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--heading-color)' }}>Notifications</h2>
             <span style={{ background: '#e03636', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px' }}>7 New</span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '4px' }}>
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
             <div key={i} style={{ padding: '16px', background: 'var(--surface-gray-1)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-color)', fontWeight: 600 }}>New Activity Logged</p>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#388AE5' }}></div>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-muted)' }}>You have been assigned a new task by Admin User. Please review the details.</p>
                <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{i} hours ago</span>
             </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
