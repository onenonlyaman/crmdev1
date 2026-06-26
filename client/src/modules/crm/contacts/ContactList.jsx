/**
 * ContactList — client/src/modules/crm/contacts/ContactList.jsx
 * Contact list page using the reusable ListPage system.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListPage from '../../../components/shared/ListPage/ListPage';
import { useContacts } from '../../../context/ContactsContext';
import AddContactModal from './AddContactModal';

const config = {
  entity: 'Contact',
  entityPlural: 'Contacts',
  routeBase: '/crm/contacts',
  idPrefix: 'CON',

  breadcrumbs: [
    { label: 'CRM', to: '/crm' },
    { label: 'Contact' },
  ],

  filterChips: [
    { key: 'id',        label: 'ID',         showApprox: true  },
    { key: 'firstName', label: 'First Name',  showApprox: true  },
    { key: 'lastName',  label: 'Last Name',   showApprox: true  },
    { key: 'company',   label: 'Company',     showApprox: true  },
    { key: 'status',    label: 'Status',      showChevron: true },
  ],

  filterFields: [
    'ID', 'First Name', 'Last Name', 'Email',
    'Mobile', 'Job Title', 'Company',
    'Status', 'Source', 'Created On',
  ],

  columns: [
    { key: 'id',        label: 'ID' },
    {
      key: 'firstName',
      label: 'Name',
      render: (row) => `${row.firstName || ''} ${row.lastName || ''}`.trim(),
    },
    { key: 'jobTitle',  label: 'Job Title' },
    { key: 'company',   label: 'Company'   },
    { key: 'email',     label: 'Email'     },
    { key: 'mobile',    label: 'Mobile'    },
    { key: 'status',    label: 'Status',   type: 'badge' },
    { key: 'createdOn', label: 'Created On' },
  ],

  statusColors: {
    'Active':   { bg: '#173b2c', color: '#28a745' },
    'Inactive': { bg: '#361515', color: '#e03636' },
    'Lead':     { bg: '#0e2037', color: '#5aaef2' },
  },

  emptyIcon: 'Users',
  emptyTitle: "You haven't created a Contact yet",
  emptyButtonText: 'Create your first Contact',
  addButtonLabel: '+ Add Contact',
};

export default function ContactList() {
  const { contacts, addContact } = useContacts();
  const navigate = useNavigate();

  return (
    <ListPage
      config={config}
      items={contacts}
      onAdd={(data) =>
        addContact({
          ...data,
          id: `CON-${String(contacts.length + 1).padStart(4, '0')}`,
          createdOn: new Date().toLocaleDateString('en-IN'),
        })
      }
      onRowClick={(item) => navigate(`/crm/contacts/${item.id}`)}
      AddModal={AddContactModal}
    />
  );
}
