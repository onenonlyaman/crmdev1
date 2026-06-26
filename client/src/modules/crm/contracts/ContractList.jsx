/**
 * ContractList — client/src/modules/crm/contracts/ContractList.jsx
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListPage from '../../../components/shared/ListPage/ListPage';
import { useContracts } from '../../../context/ContractsContext';

const config = {
  entity: 'Contract',
  entityPlural: 'Contracts',
  routeBase: '/crm/contracts',
  idPrefix: 'CONT',

  breadcrumbs: [
    { label: 'CRM', to: '/crm' },
    { label: 'Contract' },
  ],

  filterChips: [
    { key: 'id', label: 'ID', showApprox: true },
    { key: 'partyName', label: 'Party Name', showApprox: true },
    { key: 'status', label: 'Status', showChevron: true },
    { key: 'fulfilmentStatus', label: 'Fulfilment Status', showChevron: true },
  ],

  filterFields: [
    'ID', 'Party Name', 'Status', 'Fulfilment Status', 'Document Name',
  ],

  columns: [
    { key: 'id', label: 'ID' },
    { key: 'partyName', label: 'Party Name' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'fulfilmentStatus', label: 'Fulfilment Status', type: 'badge' },
    { key: 'documentName', label: 'Document Name' },
  ],

  statusColors: {
    'Draft': { bg: '#232323', color: '#afafaf' },
    'Active': { bg: '#0b2e1c', color: '#30a66d' },
    'Expired': { bg: '#361515', color: '#e03636' },
    'Fulfilled': { bg: '#173b2c', color: '#28a745' },
    'Pending': { bg: '#371e06', color: '#e79913' },
  },

  emptyIcon: 'FileSignature',
  emptyTitle: 'You haven\'t created a Contract yet',
  emptyButtonText: 'Create your first Contract',
  addButtonLabel: 'Add Contract',
};

export default function ContractList() {
  const { contracts, addContract } = useContracts();
  const navigate = useNavigate();

  return (
    <ListPage
      config={config}
      items={contracts}
      onAdd={(data) =>
        addContract({
          ...data,
          id: `CONT-${String(contracts.length + 1).padStart(4, '0')}`,
        })
      }
      onRowClick={(item) => navigate(`/crm/contracts/${item.id}`)}
    />
  );
}
