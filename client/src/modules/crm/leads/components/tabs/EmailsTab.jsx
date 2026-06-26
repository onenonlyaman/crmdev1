import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Plus, MessageCircle, Bold, Italic, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, Image as ImageIcon, 
  Video, Link2, Quote, Code, Minus, Table, Paperclip, Heading2, X, ChevronDown
} from 'lucide-react';
import { useEmailTemplates } from '../../../../../context/EmailTemplatesContext';

export default function EmailsTab({ lead, activities, onAddActivity }) {
  const [showComposer, setShowComposer] = useState(false);
  const { templates } = useEmailTemplates();
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const editorRef = useRef(null);
  
  const crmId = lead?.id || 'CRM-LEAD';
  const defaultSubject = `${lead?.salutation ? lead.salutation + ' ' : ''}${lead?.firstName || ''} ${lead?.lastName || ''} (#${crmId})`.trim();
  
  const [toEmails, setToEmails] = useState([lead?.email].filter(Boolean));
  const [toInput, setToInput] = useState('');
  
  const [ccEmails, setCcEmails] = useState([]);
  const [ccInput, setCcInput] = useState('');
  const [showCc, setShowCc] = useState(false);

  const [bccEmails, setBccEmails] = useState([]);
  const [bccInput, setBccInput] = useState('');
  const [showBcc, setShowBcc] = useState(false);

  const [subjectValue, setSubjectValue] = useState(defaultSubject);
  const [bodyValue, setBodyValue] = useState('');

  // Sync state to contentEditable div
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== bodyValue) {
      editorRef.current.innerHTML = bodyValue;
    }
  }, [bodyValue]);

  const handleSelectTemplate = (tmpl) => {
    let parsedSubject = tmpl.subject;
    let parsedBody = tmpl.body;

    const replacements = {
      lead_name: `${lead?.firstName || ''} ${lead?.lastName || ''}`.trim() || 'Valued Customer',
      owner_name: lead?.assignedTo || 'Amit Kulkarni',
      property_name: lead?.propertyType || 'our premium property',
      visit_date: lead?.followUpDate || new Date(Date.now() + 86400000).toLocaleDateString('en-IN'),
      property_address: lead?.preferredArea || 'Gangapur Road Project Site',
      customer_name: `${lead?.firstName || ''} ${lead?.lastName || ''}`.trim() || 'Valued Customer'
    };

    Object.entries(replacements).forEach(([key, val]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      parsedSubject = parsedSubject.replace(regex, val);
      parsedBody = parsedBody.replace(regex, val);
    });

    setSubjectValue(parsedSubject);
    setBodyValue(parsedBody);
    setShowTemplateMenu(false);
  };

  const emails = activities?.filter(a => a.type === 'email') || [];

  const handleSend = () => {
    if (toEmails.length === 0) {
      alert('Please add at least one recipient');
      return;
    }
    
    onAddActivity('email', {
      subject: subjectValue,
      to: toEmails.join(', '),
      message: bodyValue, // use html body as message
    });
    
    setShowComposer(false);
    setToEmails([lead?.email].filter(Boolean));
    setSubjectValue(defaultSubject);
    setBodyValue('');
    setShowCc(false);
    setShowBcc(false);
    setCcEmails([]);
    setBccEmails([]);
  };

  const renderEmailChip = (email, onRemove) => (
    <div style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '5px', padding: '3px 8px', fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '5px' }}>
      {email}
      <button onClick={onRemove} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }} onMouseEnter={e => e.currentTarget.style.color = '#e03636'} onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
        <X size={13} />
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {!showComposer && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              onClick={() => setShowComposer(true)}
              style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <Plus size={12} /> New Email
            </button>
          </div>
        )}

        {emails.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
            <Mail size={36} color="#232323" strokeWidth={1} />
            <p style={{ fontSize: '13px', color: '#383838', marginTop: '12px' }}>No Email Communications</p>
            {!showComposer && (
              <button
                onClick={() => setShowComposer(true)}
                style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', color: '#afafaf', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginTop: '12px' }}
              >
                <Plus size={12} /> New Email
              </button>
            )}
          </div>
        ) : (
          <div>
            {emails.map((emailAct, i) => (
              <div key={i} style={{ background: '#171717', border: '1px solid #1c1c1c', borderRadius: '8px', padding: '12px 14px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#f8f8f8' }}>{emailAct.content?.subject || 'No Subject'}</span>
                  <span style={{ fontSize: '11px', color: '#383838' }}>{emailAct.timestamp}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#afafaf', marginBottom: '8px' }}>To: {emailAct.content?.to}</div>
                <div style={{ fontSize: '13px', color: '#7c7c7c', whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: emailAct.content?.message || '' }}></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom composer */}
      {showComposer && (
        <div style={{ position: 'relative', borderTop: '1px solid #e5e7eb', background: '#ffffff', flexShrink: 0 }}>
          {/* Top Row */}
          <div style={{ height: '44px', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px', borderBottom: '1px solid #f0f0f0' }}>
            <button style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '5px 12px', fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500, cursor: 'pointer' }}>
              <Mail size={13} color="#374151" /> Reply
            </button>
            <button style={{ background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '5px 12px', fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <MessageCircle size={13} /> Comment
            </button>
            {/* Templates Selector */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                style={{ 
                  background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '6px', 
                  padding: '5px 12px', fontSize: '13px', color: '#6b7280', display: 'flex', 
                  alignItems: 'center', gap: '6px', cursor: 'pointer' 
                }}
              >
                <Mail size={13} /> Template <ChevronDown size={11} />
              </button>
              
              {showTemplateMenu && (
                <div style={{ 
                  position: 'absolute', top: '100%', left: 0, background: '#ffffff', 
                  border: '1px solid #e5e7eb', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
                  padding: '4px', zIndex: 10, minWidth: '200px', marginTop: '4px' 
                }}>
                  {templates.filter(t => t.category === 'Lead').map(tmpl => (
                    <div 
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl)}
                      style={{ 
                        padding: '8px 12px', borderRadius: '4px', fontSize: '13px', 
                        color: '#374151', cursor: 'pointer' 
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f3f4f6'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      {tmpl.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setShowCc(true)} style={{ background: 'transparent', border: 'none', fontSize: '13px', color: '#9ca3af', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#374151'} onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>CC</button>
              <button onClick={() => setShowBcc(true)} style={{ background: 'transparent', border: 'none', fontSize: '13px', color: '#9ca3af', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#374151'} onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>BCC</button>
              <button onClick={() => setShowComposer(false)} style={{ background: 'transparent', border: 'none', fontSize: '13px', color: '#9ca3af', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#e03636'} onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>Discard</button>
            </div>
          </div>

          {/* Subject Row */}
          <div style={{ height: '44px', display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid #f0f0f0', gap: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.06em', flexShrink: 0 }}>SUBJECT:</div>
            <input 
              value={subjectValue}
              onChange={e => setSubjectValue(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#111111', fontFamily: 'Inter' }}
            />
          </div>

          {/* TO Row */}
          <div style={{ minHeight: '44px', display: 'flex', alignItems: 'center', padding: '6px 16px', borderBottom: '1px solid #f0f0f0', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.06em', flexShrink: 0 }}>TO:</div>
            {toEmails.map((em, idx) => (
              <React.Fragment key={idx}>{renderEmailChip(em, () => setToEmails(toEmails.filter((_, i) => i !== idx)))}</React.Fragment>
            ))}
            <input 
              value={toInput}
              onChange={e => setToInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && toInput.trim()) {
                  setToEmails([...toEmails, toInput.trim()]);
                  setToInput('');
                }
              }}
              placeholder="Add email..."
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '13px', color: '#111111', minWidth: '120px', flex: 1 }}
            />
          </div>

          {/* CC Row */}
          {showCc && (
            <div style={{ minHeight: '44px', display: 'flex', alignItems: 'center', padding: '6px 16px', borderBottom: '1px solid #f0f0f0', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.06em', flexShrink: 0 }}>CC:</div>
              {ccEmails.map((em, idx) => (
                <React.Fragment key={idx}>{renderEmailChip(em, () => setCcEmails(ccEmails.filter((_, i) => i !== idx)))}</React.Fragment>
              ))}
              <input 
                value={ccInput}
                onChange={e => setCcInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && ccInput.trim()) {
                    setCcEmails([...ccEmails, ccInput.trim()]);
                    setCcInput('');
                  }
                }}
                placeholder="Add email..."
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '13px', color: '#111111', minWidth: '120px', flex: 1 }}
              />
            </div>
          )}

          {/* BCC Row */}
          {showBcc && (
            <div style={{ minHeight: '44px', display: 'flex', alignItems: 'center', padding: '6px 16px', borderBottom: '1px solid #f0f0f0', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.06em', flexShrink: 0 }}>BCC:</div>
              {bccEmails.map((em, idx) => (
                <React.Fragment key={idx}>{renderEmailChip(em, () => setBccEmails(bccEmails.filter((_, i) => i !== idx)))}</React.Fragment>
              ))}
              <input 
                value={bccInput}
                onChange={e => setBccInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && bccInput.trim()) {
                    setBccEmails([...bccEmails, bccInput.trim()]);
                    setBccInput('');
                  }
                }}
                placeholder="Add email..."
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '13px', color: '#111111', minWidth: '120px', flex: 1 }}
              />
            </div>
          )}

          {/* Body Area */}
          <div style={{ minHeight: '120px', padding: '12px 16px' }}>
            <div style={{ height: '36px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '2px', padding: '0 8px', overflowX: 'auto' }}>
              {[
                { icon: Type }, { icon: Heading2 }, { icon: Bold }, { icon: Italic },
                { icon: List }, { icon: ListOrdered }, { icon: AlignLeft }, { icon: AlignCenter },
                { icon: AlignRight }, { icon: AlignJustify }, { icon: ImageIcon }, { icon: Video },
                { icon: Link2 }, { icon: Quote }, { icon: Code }, { icon: Minus },
                { icon: Table }, { icon: Paperclip }, { icon: Mail }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button key={idx} style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '12px', flexShrink: 0 }} onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Icon size={14} />
                  </button>
                )
              })}
            </div>
            
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={e => setBodyValue(e.currentTarget.innerHTML)}
              data-placeholder="Write your message..."
              style={{
                minHeight: '100px',
                padding: '12px 0',
                outline: 'none',
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6',
                fontFamily: 'Inter',
              }}
            />
            <style>{`
              [contentEditable]:empty:before {
                content: attr(data-placeholder);
                color: #9ca3af;
              }
            `}</style>
          </div>

          {/* Bottom Action Row */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button onClick={() => setShowComposer(false)} style={{ background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#6b7280', cursor: 'pointer' }}>
              Discard
            </button>
            <button onClick={handleSend} style={{ background: '#111111', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: 500, color: '#ffffff', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = '#000000'} onMouseLeave={e => e.currentTarget.style.background = '#111111'}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
