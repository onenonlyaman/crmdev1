/**
 * OpportunityList — client/src/modules/crm/opportunities/OpportunityList.jsx
 * Opportunity list page built entirely on the reusable ListPage system.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListPage from '../../../components/shared/ListPage/ListPage';
import { useOpportunities } from '../../../context/OpportunitiesContext';
import AddOpportunityModal from './AddOpportunityModal';

const config = {
  entity: 'Opportunity',
  entityPlural: 'Opportunities',
  routeBase: '/crm/opportunities',
  idPrefix: 'OPP',

  breadcrumbs: [
    { label: 'CRM', to: '/crm' },
    { label: 'Opportunity' },
  ],

  filterChips: [
    { key: 'id',              label: 'ID',               showApprox: true  },
    { key: 'opportunityFrom', label: 'Opportunity From', showApprox: false },
    { key: 'party',           label: 'Party',            showApprox: false },
    { key: 'status',          label: 'Status',           showChevron: true },
    { key: 'title',           label: 'Title',            showApprox: true  },
  ],

  filterFields: [
    'ID', 'Opportunity From', 'Party',
    'Status', 'Title', 'Amount', 'Created On',
  ],

  columns: [
    { key: 'id',              label: 'ID'               },
    { key: 'opportunityFrom', label: 'Opportunity From' },
    { key: 'party',           label: 'Party'            },
    { key: 'status',          label: 'Status', type: 'badge' },
    { key: 'title',           label: 'Title'            },
    { key: 'amount',          label: 'Amount'           },
    { key: 'createdOn',       label: 'Created On'       },
  ],

  statusColors: {
    'Open':           { bg: '#0e2037', color: '#5aaef2'  },
    'Replied':        { bg: '#371e06', color: '#e79913'  },
    'Interested':     { bg: '#0b2e1c', color: '#30a66d'  },
    'Won':            { bg: '#173b2c', color: '#28a745'  },
    'Lost':           { bg: '#361515', color: '#e03636'  },
    'Do Not Contact': { bg: '#232323', color: '#7c7c7c'  },
  },

  emptyIcon: 'FileText',
  emptyTitle: 'Potential Sales Deal',
  emptyButtonText: 'Create your first Opportunity',
  addButtonLabel: 'Add Opportunity',
};

export default function OpportunityList() {
  const { opportunities, addOpportunity } = useOpportunities();
  const navigate = useNavigate();

  return (
    <ListPage
      config={config}
      items={opportunities}
      onAdd={(data) =>
        addOpportunity({
          ...data,
          id: `OPP-${String(opportunities.length + 1).padStart(4, '0')}`,
          createdOn: new Date().toLocaleDateString('en-IN'),
        })
      }
      onRowClick={(item) => navigate(`/crm/opportunities/${item.id}`)}
      AddModal={AddOpportunityModal}
    />
  );
}
