/**
 * MaintenanceList — client/src/modules/crm/maintenance/MaintenanceList.jsx
 * Maintenance request list page using the reusable ListPage system.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListPage from '../../../components/shared/ListPage/ListPage';
import { useMaintenance } from '../../../context/MaintenanceContext';
import AddMaintenanceModal from './AddMaintenanceModal';

const config = {
  entity: 'Maintenance',
  entityPlural: 'Maintenance',
  routeBase: '/crm/maintenance',
  idPrefix: 'MNT',

  breadcrumbs: [
    { label: 'CRM', to: '/crm' },
    { label: 'Maintenance' },
  ],

  filterChips: [
    { key: 'id',       label: 'ID',       showApprox: true  },
    { key: 'subject',  label: 'Subject',  showApprox: true  },
    { key: 'customer', label: 'Customer', showApprox: true  },
    { key: 'status',   label: 'Status',   showChevron: true },
    { key: 'priority', label: 'Priority', showChevron: true },
  ],

  filterFields: [
    'ID', 'Subject', 'Customer', 'Maintenance Type',
    'Status', 'Priority', 'Assigned To',
    'Scheduled Date', 'Created On',
  ],

  columns: [
    { key: 'id',              label: 'ID'          },
    { key: 'subject',         label: 'Subject'     },
    { key: 'customer',        label: 'Customer'    },
    { key: 'maintenanceType', label: 'Type'        },
    { key: 'status',          label: 'Status',   type: 'badge' },
    { key: 'priority',        label: 'Priority', type: 'badge' },
    { key: 'assignedTo',      label: 'Assigned To' },
    { key: 'scheduledDate',   label: 'Scheduled'   },
    { key: 'createdOn',       label: 'Created On'  },
  ],

  statusColors: {
    'Open':        { bg: '#0e2037', color: '#5aaef2' },
    'Scheduled':   { bg: '#371e06', color: '#e79913' },
    'In Progress': { bg: '#2d1a4a', color: '#9c45e3' },
    'Completed':   { bg: '#173b2c', color: '#28a745' },
    'Cancelled':   { bg: '#361515', color: '#e03636' },
    'Low':         { bg: '#232323', color: '#7c7c7c' },
    'Medium':      { bg: '#371e06', color: '#e79913' },
    'High':        { bg: '#361515', color: '#e03636' },
    'Urgent':      { bg: '#4a0a0a', color: '#ff4444' },
  },

  emptyIcon: 'Wrench',
  emptyTitle: 'No maintenance requests yet',
  emptyButtonText: 'Create first Maintenance Request',
  addButtonLabel: '+ Add Maintenance',
};

export default function MaintenanceList() {
  const { maintenanceItems, addMaintenance } = useMaintenance();
  const navigate = useNavigate();

  return (
    <ListPage
      config={config}
      items={maintenanceItems}
      onAdd={(data) =>
        addMaintenance({
          ...data,
          id: `MNT-${String(maintenanceItems.length + 1).padStart(4, '0')}`,
          createdOn: new Date().toLocaleDateString('en-IN'),
        })
      }
      onRowClick={(item) => navigate(`/crm/maintenance/${item.id}`)}
      AddModal={AddMaintenanceModal}
    />
  );
}
