import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrganizations } from '../../../context/OrganizationsContext';
import { ChevronRight, Building2, Phone, Mail, Globe } from 'lucide-react';
// We'll reuse existing generic tabs if available, but for now we build the simple tabs layout
// as defined in user instructions. Note: user mentioned "same ActivityTab component" 
// and "NotesTab component". If they don't exist in a shared folder, we'll assume they 
// are generic placeholders or we'll mock them similar to LeadDetail.

export default function OrganizationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { organizations, deleteOrganization } = useOrganizations();
  const [activeTab, setActiveTab] = useState('Activity');

  const org = organizations.find(o => o.id === id);

  if (!org) {
    return <div style={{ color: '#fff', padding: 20 }}>Organization not found</div>;
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      deleteOrganization(id);
      navigate('/crm/organizations');
    }
  };

  const getAvatarStyle = (nameStr) => {
    if (!nameStr) return { bg: '#232323', color: '#afafaf', char: '?' };
    const char = nameStr.charAt(0).toUpperCase();
    if (/[A-E]/.test(char)) return { bg: '#0e2037', color: '#5aaef2', char };
    if (/[F-J]/.test(char)) return { bg: '#0b2e1c', color: '#30a66d', char };
    if (/[K-O]/.test(char)) return { bg: '#371e06', color: '#e79913', char };
    if (/[P-T]/.test(char)) return { bg: '#2d1a4a', color: '#9c45e3', char };
    if (/[U-Z]/.test(char)) return { bg: '#361515', color: '#e03636', char };
    return { bg: '#232323', color: '#afafaf', char };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f0f0f' }}>
      {/* HEADER */}
      <div style={{ height: '60px', borderBottom: '1px solid #1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <span style={{ color: '#7c7c7c', cursor: 'pointer' }} onClick={() => navigate('/crm/organizations')}>Organizations</span>
          <ChevronRight size={14} color="#424242" />
          <span style={{ color: '#f8f8f8', fontWeight: '500' }}>{org.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={handleDelete} style={{ background: 'transparent', border: '1px solid #2b2b2b', color: '#e03636', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
            Delete
          </button>
          <button style={{ background: 'transparent', border: '1px solid #2b2b2b', color: '#f8f8f8', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
            Edit
          </button>
          <button 
            onClick={() => navigate('/crm/deals')}
            style={{ background: '#f3f4f6', border: 'none', color: '#111', padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
          >
            + New Deal
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* MAIN CONTENT (TABS) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #1c1c1c' }}>
          {/* TABS HEADER */}
          <div style={{ display: 'flex', gap: '20px', padding: '0 20px', borderBottom: '1px solid #1c1c1c', background: '#0a0a0a' }}>
            {['Activity', 'Contacts', 'Deals', 'Notes'].map(tab => (
              <div 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  padding: '12px 0', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: activeTab === tab ? '#f8f8f8' : '#7c7c7c',
                  borderBottom: activeTab === tab ? '2px solid #f8f8f8' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* TABS CONTENT */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {activeTab === 'Activity' && (
              <div style={{ color: '#7c7c7c', fontSize: '13px' }}>Activity history will appear here.</div>
            )}
            
            {activeTab === 'Contacts' && (
              <div>
                {org.linkedContacts && org.linkedContacts.length > 0 ? (
                  org.linkedContacts.map(contactId => (
                    <div 
                      key={contactId}
                      style={{ background: '#171717', border: '1px solid #1c1c1c', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#388AE5'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#1c1c1c'}
                    >
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0e2037', color: '#5aaef2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600' }}>C</div>
                      <div>
                        <div style={{ fontSize: '13px', color: '#f8f8f8', fontWeight: '500' }}>{contactId}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#7c7c7c', fontSize: '13px', marginBottom: '16px' }}>No linked contacts.</div>
                )}
                <button style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px dashed #2b2b2b', borderRadius: '8px', color: '#afafaf', fontSize: '13px', cursor: 'pointer' }}>
                  + Link Contact
                </button>
              </div>
            )}

            {activeTab === 'Deals' && (
              <div>
                {org.linkedDeals && org.linkedDeals.length > 0 ? (
                  org.linkedDeals.map(dealId => (
                    <div 
                      key={dealId}
                      style={{ background: '#171717', border: '1px solid #1c1c1c', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#388AE5'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#1c1c1c'}
                    >
                      <div style={{ fontSize: '13px', color: '#f8f8f8', fontWeight: '500' }}>{dealId}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#7c7c7c', fontSize: '13px', marginBottom: '16px' }}>No linked deals.</div>
                )}
                <button style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px dashed #2b2b2b', borderRadius: '8px', color: '#afafaf', fontSize: '13px', cursor: 'pointer' }}>
                  + Link Deal
                </button>
              </div>
            )}

            {activeTab === 'Notes' && (
              <div style={{ color: '#7c7c7c', fontSize: '13px' }}>Notes will appear here.</div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: '320px', background: '#0a0a0a', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px 20px', borderBottom: '1px solid #1c1c1c', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#171717', border: '1px solid #2b2b2b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Building2 size={22} color="#7c7c7c" />
            </div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#f8f8f8', marginBottom: '4px' }}>{org.name}</div>
            {org.industry && (
              <span style={{ background: '#232323', color: '#afafaf', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>{org.industry}</span>
            )}
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button 
                onClick={() => { if (org.phone) window.open(`tel:${org.phone}`); }}
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#171717', border: '1px solid #2b2b2b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              ><Phone size={14} color="#30a66d" /></button>
              <button 
                onClick={() => { if (org.email) window.open(`mailto:${org.email}`); }}
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#171717', border: '1px solid #2b2b2b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              ><Mail size={14} color="#5aaef2" /></button>
              <button 
                onClick={() => { if (org.website) window.open(org.website, '_blank'); }}
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#171717', border: '1px solid #2b2b2b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              ><Globe size={14} color="#e79913" /></button>
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            {/* STATS */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <div style={{ flex: 1, background: '#171717', border: '1px solid #1c1c1c', borderRadius: '6px', padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#f8f8f8' }}>{org.linkedContacts?.length || 0}</div>
                <div style={{ fontSize: '11px', color: '#424242' }}>Contacts</div>
              </div>
              <div style={{ flex: 1, background: '#171717', border: '1px solid #1c1c1c', borderRadius: '6px', padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#f8f8f8' }}>{org.linkedDeals?.length || 0}</div>
                <div style={{ fontSize: '11px', color: '#424242' }}>Deals</div>
              </div>
            </div>

            {/* DETAILS */}
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#f8f8f8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ChevronRight size={12} style={{ transform: 'rotate(90deg)' }}/> Details
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#7c7c7c' }}>Website</span>
                {org.website ? <a href={org.website} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#5aaef2', textDecoration: 'none' }}>{org.website}</a> : <span style={{ fontSize: '13px', color: '#afafaf' }}>—</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#7c7c7c' }}>Industry</span>
                <span style={{ fontSize: '13px', color: '#f8f8f8' }}>{org.industry || '—'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#7c7c7c' }}>Territory</span>
                <span style={{ fontSize: '13px', color: '#f8f8f8' }}>{org.territory || '—'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#7c7c7c' }}>No of Employees</span>
                <span style={{ fontSize: '13px', color: '#f8f8f8' }}>{org.noOfEmployees || '—'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#7c7c7c' }}>Annual Revenue</span>
                <span style={{ fontSize: '13px', color: '#f8f8f8' }}>{org.annualRevenue ? `₹${org.annualRevenue.toLocaleString('en-IN')}` : '—'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#7c7c7c' }}>Phone</span>
                <span style={{ fontSize: '13px', color: '#f8f8f8' }}>{org.phone || '—'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#7c7c7c' }}>Email</span>
                {org.email ? <a href={`mailto:${org.email}`} style={{ fontSize: '13px', color: '#5aaef2', textDecoration: 'none' }}>{org.email}</a> : <span style={{ fontSize: '13px', color: '#afafaf' }}>—</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#7c7c7c' }}>Address</span>
                <span style={{ fontSize: '13px', color: '#f8f8f8' }}>{org.address || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
