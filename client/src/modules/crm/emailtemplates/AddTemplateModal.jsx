import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddTemplateModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Lead',
    subject: '',
    body: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    onSave(formData);
    onClose();
    setFormData({ name: '', category: 'Lead', subject: '', body: '' });
  };

  const inputStyle = {
    width: '100%',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '13px',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px'
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#ffffff', borderRadius: '12px', width: '640px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>New Email Template</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', maxHeight: '75vh' }}>
          <form id="add-tmpl-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Template Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Welcome Email" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                  <option>Lead</option>
                  <option>Deal</option>
                  <option>Customer</option>
                  <option>General</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Subject</label>
              <input name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. Welcome to Avenue Builders — {{lead_name}}" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Body</label>
              <textarea 
                name="body" 
                value={formData.body} 
                onChange={handleChange} 
                placeholder="Write your email body...&#10;Use {{variable_name}} for dynamic fields.&#10;e.g. {{lead_name}}, {{property_name}}, {{owner_name}}, {{visit_date}}" 
                rows="10" 
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }}
              ></textarea>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px' }}>
                Available variables: {'{{lead_name}}'}, {'{{customer_name}}'}, {'{{owner_name}}'}, {'{{property_name}}'}, {'{{visit_date}}'}, {'{{property_address}}'}
              </div>
            </div>

          </form>
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>
            Cancel
          </button>
          <button type="submit" form="add-tmpl-form" style={{ padding: '8px 16px', background: '#111827', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#ffffff', cursor: 'pointer' }}>
            Save Template
          </button>
        </div>

      </div>
    </div>
  );
}
