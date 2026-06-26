import React, { useState } from 'react';
import { Phone, Plus } from 'lucide-react';
import NewCallModal from '../modals/NewCallModal';

export default function CallsTab({ lead, activities, onAddCall }) {
  const [showModal, setShowModal] = useState(false);
  const calls = activities?.filter(a => a.type === 'call') || [];

  const getOutcomeStyle = (outcome) => {
    switch (outcome) {
      case 'Completed': return { bg: '#173b2c', color: '#28a745' };
      case 'No Answer': return { bg: '#371e06', color: '#e79913' };
      case 'Busy': return { bg: '#232323', color: '#7c7c7c' };
      case 'Cancelled': return { bg: '#361515', color: '#e03636' };
      default: return { bg: '#232323', color: '#7c7c7c' };
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <Plus size={12} /> Log Call
        </button>
      </div>

      {calls.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
          <Phone size={36} color="#232323" strokeWidth={1} />
          <p style={{ fontSize: '13px', color: '#383838', marginTop: '12px' }}>No call logs yet</p>
        </div>
      ) : (
        <div>
          {calls.map((call, i) => {
            const outStyle = getOutcomeStyle(call.content?.outcome);
            return (
              <div key={i} style={{ background: '#171717', border: '1px solid #1c1c1c', borderRadius: '8px', padding: '12px 14px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: '#30a66d' }}>
                    <Phone size={13} /> Call
                  </div>
                  <span style={{ fontSize: '11px', color: '#383838' }}>{call.timestamp}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ background: outStyle.bg, color: outStyle.color, padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 500 }}>
                    {call.content?.outcome}
                  </span>
                  {call.content?.duration && (
                    <span style={{ fontSize: '12px', color: '#7c7c7c' }}>{call.content.duration}</span>
                  )}
                </div>
                {call.content?.notes && (
                  <div style={{ fontSize: '12.5px', color: '#afafaf', marginTop: '6px', lineHeight: 1.5 }}>
                    {call.content.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <NewCallModal
          lead={lead}
          onClose={() => setShowModal(false)}
          onSave={(content) => {
            onAddCall('call', content);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
