import React, { useState } from 'react';
import { useCallLogs } from '../../../context/CallLogsContext';
import { PhoneIncoming, PhoneOutgoing, LayoutList, ChevronDown, RefreshCw, SlidersHorizontal, ArrowUpDown, Columns, Users, Handshake, Building2, PhoneCall, X } from 'lucide-react';

export default function CallLogsPage() {
  const { callLogs, addCallLog } = useCallLogs();
  const [filterTab, setFilterTab] = useState('All');
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    callType: 'Outbound',
    toFrom: '',
    duration: '',
    outcome: 'Completed',
    linkedType: 'Lead',
    linkedRecord: '',
    notes: ''
  });

  const filteredLogs = callLogs.filter(log => {
    if (filterTab === 'Inbound') return log.callType === 'inbound';
    if (filterTab === 'Outbound') return log.callType === 'outbound';
    if (filterTab === 'Missed') return log.outcome === 'No Answer' || log.outcome === 'Busy';
    return true;
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.toFrom) return;
    
    addCallLog({
      id: `CALL-${String(callLogs.length + 1).padStart(4, '0')}`,
      to: formData.callType === 'Outbound' ? formData.toFrom : 'Admin User',
      from: formData.callType === 'Inbound' ? formData.toFrom : 'Admin User',
      duration: formData.duration || '0 mins',
      status: formData.outcome,
      outcome: formData.outcome,
      notes: formData.notes,
      recordingUrl: '',
      linkedTo: formData.linkedRecord || 'Unknown',
      linkedId: 'UNKNOWN-000',
      linkedType: formData.linkedType.toLowerCase(),
      callType: formData.callType.toLowerCase(),
      createdBy: 'Admin User',
      createdOn: new Date().toLocaleDateString('en-IN'),
    });
    
    setShowModal(false);
    setFormData({ callType: 'Outbound', toFrom: '', duration: '', outcome: 'Completed', linkedType: 'Lead', linkedRecord: '', notes: '' });
  };

  const getOutcomeStyle = (outcome) => {
    switch (outcome) {
      case 'Completed': return { bg: '#173b2c', color: '#28a745' };
      case 'No Answer': return { bg: '#371e06', color: '#e79913' };
      case 'Busy': return { bg: '#232323', color: '#7c7c7c' };
      case 'Cancelled': return { bg: '#361515', color: '#e03636' };
      case 'Wrong Number': return { bg: '#232323', color: '#383838' };
      default: return { bg: '#232323', color: '#7c7c7c' };
    }
  };

  const getLinkedIcon = (type) => {
    switch (type) {
      case 'lead': return <Users size={10} />;
      case 'deal': return <Handshake size={10} />;
      case 'org': return <Building2 size={10} />;
      default: return <Users size={10} />;
    }
  };

  const tableGridTemplate = '40px 100px 180px 100px 120px 150px minmax(200px, 1fr) 120px 100px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f0f0f' }}>
      {/* PAGE HEADER */}
      <div style={{ height: '48px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#f8f8f8' }}>Call Logs</div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#111111', cursor: 'pointer' }}
        >
          + Log a Call
        </button>
      </div>

      {/* TOOLBAR */}
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', flexShrink: 0 }}>
        <div style={{ height: '40px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <LayoutList size={13} /> List View <ChevronDown size={11} color="#383838" />
            </button>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={14} />
            </button>
            <button style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <SlidersHorizontal size={13} /> Filter
            </button>
            <button style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <ArrowUpDown size={13} /> Sort
            </button>
            <button style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <Columns size={13} /> Columns
            </button>
          </div>
        </div>

        {/* FILTER TABS */}
        <div style={{ padding: '0 20px 10px', display: 'flex', gap: '10px' }}>
          {['All', 'Inbound', 'Outbound', 'Missed'].map(tab => {
            const isActive = filterTab === tab;
            return (
              <div 
                key={tab}
                onClick={() => setFilterTab(tab)}
                style={{ 
                  padding: '4px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer',
                  background: isActive ? '#232323' : 'transparent',
                  color: isActive ? '#f8f8f8' : '#6b6b6b'
                }}
              >
                {tab}
              </div>
            );
          })}
        </div>
      </div>

      {/* TABLE */}
      {filteredLogs.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <PhoneCall size={48} color="#232323" strokeWidth={1} />
          <div style={{ fontSize: '14px', color: '#383838', marginTop: '12px' }}>No call logs found</div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f' }}>
          {/* HEADER ROW */}
          <div style={{ height: '36px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', position: 'sticky', top: 0, zIndex: 10, display: 'grid', gridTemplateColumns: tableGridTemplate }}>
            <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
            {['Type', 'To/From', 'Duration', 'Outcome', 'Linked To', 'Notes', 'Created By', 'Date'].map((col, idx) => (
              <div key={idx} style={{ padding: '0 12px', fontSize: '11px', fontWeight: '500', color: '#424242', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                {col}
              </div>
            ))}
          </div>

          {/* ROWS */}
          {filteredLogs.map(log => {
            const outcomeStyle = getOutcomeStyle(log.outcome);
            const toFromStr = log.callType === 'inbound' ? log.from : log.to;

            return (
              <div 
                key={log.id}
                style={{ display: 'grid', gridTemplateColumns: tableGridTemplate, minHeight: '48px', borderBottom: '1px solid #1c1c1c', alignItems: 'center', background: 'transparent', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#111111'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
                  <input type="checkbox" style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #2b2b2b', cursor: 'pointer', accentColor: '#388AE5' }} />
                </div>
                
                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {log.callType === 'inbound' ? (
                    <><PhoneIncoming size={14} color="#30a66d" /><span style={{ fontSize: '13px', color: '#30a66d' }}>Inbound</span></>
                  ) : (
                    <><PhoneOutgoing size={14} color="#5aaef2" /><span style={{ fontSize: '13px', color: '#5aaef2' }}>Outbound</span></>
                  )}
                </div>

                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, fontSize: '9px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1c1c1c', color: '#afafaf' }}>
                    {toFromStr ? toFromStr.charAt(0) : '?'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#f8f8f8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {toFromStr}
                  </div>
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#afafaf' }}>
                  {log.duration === '0 mins' ? '—' : log.duration}
                </div>

                <div style={{ padding: '0 12px' }}>
                  <span style={{ background: outcomeStyle.bg, color: outcomeStyle.color, padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '500' }}>
                    {log.outcome}
                  </span>
                </div>

                <div style={{ padding: '0 12px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#0e2037', color: '#5aaef2', borderRadius: '10px', padding: '2px 8px', fontSize: '11px' }}>
                    {getLinkedIcon(log.linkedType)}
                    {log.linkedTo}
                  </div>
                </div>

                <div style={{ padding: '0 12px', fontSize: '12px', color: '#6b6b6b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.notes}
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#afafaf', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.createdBy}
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#afafaf' }}>
                  {log.createdOn}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD MODAL (LIGHT THEME) */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '500px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>Log a Call</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <form id="add-call-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Call Type</label>
                    <select value={formData.callType} onChange={e => setFormData({...formData, callType: e.target.value})} style={{ width: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#111827', outline: 'none' }}>
                      <option>Inbound</option>
                      <option>Outbound</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>To/From</label>
                    <input type="text" value={formData.toFrom} onChange={e => setFormData({...formData, toFrom: e.target.value})} placeholder="Contact name" required style={{ width: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#111827', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Duration</label>
                    <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 5 mins" style={{ width: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#111827', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Outcome</label>
                    <select value={formData.outcome} onChange={e => setFormData({...formData, outcome: e.target.value})} style={{ width: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#111827', outline: 'none' }}>
                      <option>Completed</option>
                      <option>No Answer</option>
                      <option>Busy</option>
                      <option>Cancelled</option>
                      <option>Wrong Number</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Link Type</label>
                    <select value={formData.linkedType} onChange={e => setFormData({...formData, linkedType: e.target.value})} style={{ width: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#111827', outline: 'none' }}>
                      <option>Lead</option>
                      <option>Deal</option>
                      <option>Organization</option>
                      <option>Customer</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Record</label>
                    <input type="text" value={formData.linkedRecord} onChange={e => setFormData({...formData, linkedRecord: e.target.value})} placeholder="Name or ID" style={{ width: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#111827', outline: 'none' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Notes</label>
                  <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="What was discussed..." rows="3" style={{ width: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#111827', outline: 'none', resize: 'vertical' }}></textarea>
                </div>

              </form>
            </div>

            <div style={{ padding: '16px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" form="add-call-form" style={{ padding: '8px 16px', background: '#111827', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#ffffff', cursor: 'pointer' }}>
                Log Call
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
