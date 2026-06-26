import React, { useState } from 'react';
import { useEmailTemplates } from '../../../context/EmailTemplatesContext';
import AddTemplateModal from './AddTemplateModal';
import { LayoutList, ChevronDown, RefreshCw, SlidersHorizontal, ArrowUpDown, Columns, MoreHorizontal, Mail } from 'lucide-react';

export default function EmailTemplatesPage() {
  const { templates, addTemplate } = useEmailTemplates();
  const [showModal, setShowModal] = useState(false);

  const handleSave = (formData) => {
    addTemplate({
      ...formData,
      id: `TMPL-${String(templates.length + 1).padStart(4, '0')}`,
      createdBy: 'Admin User',
      createdOn: new Date().toLocaleDateString('en-IN'),
    });
  };

  const getCategoryStyle = (cat) => {
    switch (cat) {
      case 'Lead': return { bg: '#0e2037', color: '#5aaef2' };
      case 'Deal': return { bg: '#173b2c', color: '#28a745' };
      case 'Customer': return { bg: '#2d1a4a', color: '#9c45e3' };
      default: return { bg: '#232323', color: '#afafaf' };
    }
  };

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, ' ');
  };

  const extractVariables = (bodyStr) => {
    if (!bodyStr) return [];
    const matches = [...bodyStr.matchAll(/\{\{(\w+)\}\}/g)];
    const vars = matches.map(m => m[1]);
    return [...new Set(vars)];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f0f0f' }}>
      {/* PAGE HEADER */}
      <div style={{ height: '48px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#f8f8f8' }}>Email Templates</div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#111111', cursor: 'pointer' }}
        >
          + New Template
        </button>
      </div>

      {/* TOOLBAR */}
      <div style={{ height: '40px', background: '#0a0a0a', borderBottom: '1px solid #1c1c1c', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <LayoutList size={13} /> List View <ChevronDown size={11} color="#383838" />
          </button>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={14} color="currentColor" />
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

      {/* CONTENT */}
      {templates.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Mail size={48} color="#232323" strokeWidth={1} />
          <div style={{ fontSize: '14px', color: '#383838', marginTop: '12px', marginBottom: '16px' }}>No email templates yet</div>
          <button 
            onClick={() => setShowModal(true)}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#111111', cursor: 'pointer' }}
          >
            + Create your first template
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', padding: '20px' }}>
            {templates.map(tmpl => {
              const catStyle = getCategoryStyle(tmpl.category);
              const vars = extractVariables(tmpl.subject + ' ' + tmpl.body);

              return (
                <div 
                  key={tmpl.id}
                  style={{ background: '#171717', border: '1px solid #1c1c1c', borderRadius: '10px', padding: '16px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#388AE5'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#1c1c1c'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#f8f8f8' }}>{tmpl.name}</div>
                    <div style={{ background: catStyle.bg, color: catStyle.color, padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '500' }}>
                      {tmpl.category}
                    </div>
                  </div>

                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#7c7c7c', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Subject: {tmpl.subject}
                  </div>

                  <div style={{ marginTop: '8px', fontSize: '13px', color: '#424242', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {stripHtml(tmpl.body)}
                  </div>

                  {vars.length > 0 && (
                    <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {vars.map(v => (
                        <span key={v} style={{ background: '#232323', color: '#7c7c7c', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', fontFamily: 'monospace' }}>
                          {`{{${v}}}`}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#1c1c1c', color: '#afafaf', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '600' }}>
                        {tmpl.createdBy ? tmpl.createdBy.charAt(0) : 'A'}
                      </div>
                      <span style={{ fontSize: '11px', color: '#383838' }}>{tmpl.createdBy}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ background: 'transparent', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '3px 10px', fontSize: '11px', color: '#afafaf', cursor: 'pointer' }} onMouseEnter={e => {e.currentTarget.style.borderColor='#388AE5'; e.currentTarget.style.color='#5aaef2'}} onMouseLeave={e => {e.currentTarget.style.borderColor='#2b2b2b'; e.currentTarget.style.color='#afafaf'}}>
                        Use Template
                      </button>
                      <button style={{ background: 'transparent', border: 'none', color: '#383838', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#7c7c7c'} onMouseLeave={e => e.currentTarget.style.color = '#383838'}>
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AddTemplateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}
