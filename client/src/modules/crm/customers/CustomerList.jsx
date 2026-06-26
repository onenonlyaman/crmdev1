/**
 * CustomerList — client/src/modules/crm/customers/CustomerList.jsx
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListPage from '../../../components/shared/ListPage/ListPage';
import { useCustomers } from '../../../context/CustomersContext';

const config = {
  entity: 'Customer',
  entityPlural: 'Customers',
  routeBase: '/crm/customers',
  idPrefix: 'CUST',

  breadcrumbs: [
    { label: 'CRM', to: '/crm' },
    { label: 'Customer' },
  ],

  filterChips: [
    { key: 'id', label: 'ID', showApprox: true },
    { key: 'customerName', label: 'Customer Name', showApprox: true },
    { key: 'customerGroup', label: 'Customer Group', showChevron: true },
    { key: 'territory', label: 'Territory', showApprox: false },
  ],

  filterFields: [
    'ID', 'Customer Name', 'Customer Group', 'Territory',
  ],

  columns: [
    { key: 'id', label: 'ID' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'customerGroup', label: 'Customer Group' },
    { key: 'territory', label: 'Territory' },
  ],

  statusColors: {},

  emptyIcon: 'Users',
  emptyTitle: 'You haven\'t created a Customer yet',
  emptyButtonText: 'Create your first Customer',
  addButtonLabel: 'Add Customer',
};

export default function CustomerList() {
  const { customers, addCustomer } = useCustomers();
  const navigate = useNavigate();

  return (
    <ListPage
      config={config}
      items={customers}
      onAdd={(data) =>
        addCustomer({
          ...data,
          id: `CUST-${String(customers.length + 1).padStart(4, '0')}`,
        })
      }
      onRowClick={(item) => navigate(`/crm/customers/${item.id}`)}
    />
  );
}
