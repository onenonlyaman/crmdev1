/**
 * CommunicationList — client/src/modules/crm/communications/CommunicationList.jsx
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListPage from '../../../components/shared/ListPage/ListPage';
import { useCommunications } from '../../../context/CommunicationsContext';

const config = {
  entity: 'Communication',
  entityPlural: 'Communications',
  routeBase: '/crm/communications',
  idPrefix: 'COMM',

  breadcrumbs: [
    { label: 'CRM', to: '/crm' },
    { label: 'Communication' },
  ],

  filterChips: [
    { key: 'id', label: 'ID', showApprox: true },
    { key: 'subject', label: 'Subject', showApprox: true },
    { key: 'type', label: 'Type', showChevron: true },
    { key: 'status', label: 'Status', showChevron: true },
  ],

  filterFields: [
    'ID', 'Subject', 'Type', 'Communication Medium', 'Status', 'Sent or Received',
  ],

  columns: [
    { key: 'id', label: 'ID' },
    { key: 'subject', label: 'Subject' },
    { key: 'type', label: 'Type' },
    { key: 'communicationMedium', label: 'Communication Medium' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'sentOrReceived', label: 'Sent or Received', type: 'badge' },
  ],

  statusColors: {
    'Open': { bg: '#0e2037', color: '#5aaef2' },
    'Closed': { bg: '#232323', color: '#afafaf' },
    'Sent': { bg: '#0b2e1c', color: '#30a66d' },
    'Received': { bg: '#371e06', color: '#e79913' },
    'Failed': { bg: '#361515', color: '#e03636' },
  },

  emptyIcon: 'MessageSquare',
  emptyTitle: 'You haven\'t created a Communication yet',
  emptyButtonText: 'Create your first Communication',
  addButtonLabel: 'Add Communication',
};

export default function CommunicationList() {
  const { communications, addCommunication } = useCommunications();
  const navigate = useNavigate();

  return (
    <ListPage
      config={config}
      items={communications}
      onAdd={(data) =>
        addCommunication({
          ...data,
          id: `COMM-${String(communications.length + 1).padStart(4, '0')}`,
        })
      }
      onRowClick={(item) => navigate(`/crm/communications/${item.id}`)}
    />
  );
}
