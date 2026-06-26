import React, { useState } from 'react';
import { Activity, User, Phone, Mail, CheckSquare, StickyNote, MessageCircle } from 'lucide-react';

export default function ActivityTab({ lead, activities, onAddActivity }) {
  const [comment, setComment] = useState('');

  const getIcon = (type) => {
    switch (type) {
      case 'comment': return <MessageCircle size={14} color="#fff" />;
      case 'status': return <Activity size={14} color="#fff" />;
      case 'email': return <Mail size={14} color="#fff" />;
      case 'call': return <Phone size={14} color="#fff" />;
      case 'task': return <CheckSquare size={14} color="#fff" />;
      case 'note': return <StickyNote size={14} color="#fff" />;
      default: return <User size={14} color="#fff" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'comment': return '#388AE5';
      case 'status': return '#e79913';
      case 'email': return '#5aaef2';
      case 'call': return '#30a66d';
      case 'task': return '#e03636';
      case 'note': return '#7c7c7c';
      default: return '#383838';
    }
  };

  return (
    <div>
      <div style={{
        background: '#171717', border: '1px solid #2b2b2b', borderRadius: '8px',
        padding: '12px 14px', marginBottom: '20px'
      }}>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Add a comment..."
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            fontSize: '13px', color: '#f8f8f8', fontFamily: 'Inter, sans-serif',
            resize: 'none', minHeight: '60px'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', gap: '8px' }}>
          {comment && (
            <button onClick={() => setComment('')} style={{ background: 'transparent', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '4px 12px', fontSize: '12px', color: '#7c7c7c', cursor: 'pointer' }}>Cancel</button>
          )}
          <button
            onClick={() => {
              if (comment.trim()) {
                onAddActivity('comment', comment);
                setComment('');
              }
            }}
            style={{ background: '#388AE5', border: 'none', borderRadius: '5px', padding: '4px 12px', fontSize: '12px', color: '#fff', cursor: 'pointer' }}
          >
            Comment
          </button>
        </div>
      </div>

      {activities.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
          <Activity size={36} color="#232323" strokeWidth={1} />
          <p style={{ color: '#383838', fontSize: '13px', marginTop: '12px' }}>No activity yet</p>
        </div>
      ) : (
        <div>
          {activities.map((act, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: getIconBg(act.type), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {getIcon(act.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#afafaf', textTransform: 'capitalize' }}>{act.type}</span>
                  <span style={{ fontSize: '11px', color: '#383838', marginLeft: 'auto' }}>{act.timestamp}</span>
                </div>
                <div style={{
                  marginTop: '4px', fontSize: '13px', color: '#7c7c7c', lineHeight: 1.6,
                  ...(act.type === 'comment' ? { background: '#171717', border: '1px solid #1c1c1c', borderRadius: '6px', padding: '10px 12px' } : {})
                }}>
                  {typeof act.content === 'object' ? JSON.stringify(act.content) : act.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
