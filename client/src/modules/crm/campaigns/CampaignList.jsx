/**
 * CampaignList — client/src/modules/crm/campaigns/CampaignList.jsx
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListPage from '../../../components/shared/ListPage/ListPage';
import { useCampaigns } from '../../../context/CampaignsContext';

const config = {
  entity: 'Campaign',
  entityPlural: 'Campaigns',
  routeBase: '/crm/campaigns',
  idPrefix: 'CAMP',

  breadcrumbs: [
    { label: 'CRM', to: '/crm' },
    { label: 'Campaign' },
  ],

  filterChips: [
    { key: 'id', label: 'ID', showApprox: true },
  ],

  filterFields: [
    'ID',
  ],

  columns: [
    { key: 'id', label: 'ID' },
  ],

  statusColors: {},

  emptyIcon: 'Megaphone',
  emptyTitle: 'You haven\'t created a Campaign yet',
  emptyButtonText: 'Create your first Campaign',
  addButtonLabel: 'Add Campaign',
};

export default function CampaignList() {
  const { campaigns, addCampaign } = useCampaigns();
  const navigate = useNavigate();

  return (
    <ListPage
      config={config}
      items={campaigns}
      onAdd={(data) =>
        addCampaign({
          ...data,
          id: `CAMP-${String(campaigns.length + 1).padStart(4, '0')}`,
        })
      }
      onRowClick={(item) => navigate(`/crm/campaigns/${item.id}`)}
    />
  );
}
