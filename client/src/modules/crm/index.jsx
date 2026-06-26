/**
 * CRM Dashboard — client/src/modules/crm/index.jsx
 * Mirrors Frappe CRM's dashboard layout with live context data.
 */
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import './crm.css';
import StatCard from './StatCard';
import ChartCard from './ChartCard';
import EmptyChart from './EmptyChart';
import { useLeads } from '../../context/LeadsContext';
import { useOpportunities } from '../../context/OpportunitiesContext';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const weeklyDates = [
  '21-03-2026', '28-03-2026', '04-04-2026', '11-04-2026',
  '18-04-2026', '25-04-2026', '02-05-2026', '09-05-2026',
  '16-05-2026', '23-05-2026', '30-05-2026', '06-06-2026',
  '13-06-2026', '20-06-2026',
];
const weeklyData = weeklyDates.map(date => ({ date, value: 0 }));

const monthlyDates = [
  'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025',
  'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026',
  'Apr 2026', 'May 2026', 'Jun 2026',
];
const monthlyData = monthlyDates.map(date => ({ date, value: 0 }));

// ─── Shared line chart config ─────────────────────────────────────────────────

function BosLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <CartesianGrid vertical={false} stroke="#232323" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 13, fill: '#7c7c7c', fontFamily: 'Inter, sans-serif' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 5]}
          ticks={[1, 2, 3, 4, 5]}
          tick={{ fontSize: 13, fill: '#7c7c7c', fontFamily: 'Inter, sans-serif' }}
          axisLine={false}
          tickLine={false}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#e83e8c"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Section 1: Stat Cards ────────────────────────────────────────────────────

function StatCardsRow() {
  const { leads } = useLeads();
  const { opportunities } = useOpportunities();

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const safeLeads = Array.isArray(leads) ? leads : [];
  const safeOpps = Array.isArray(opportunities) ? opportunities : [];

  const newLeadsThisMonth = safeLeads.filter(l => {
    if (!l.createdOn) return false;
    const d = new Date(l.createdOn.split('/').reverse().join('-'));
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const newOppsThisMonth = safeOpps.filter(o => {
    if (!o.createdOn) return false;
    const d = new Date(o.createdOn.split('/').reverse().join('-'));
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const wonOpps = safeOpps.filter(o => o.status === 'Won').length;
  const openOpps = safeOpps.filter(
    o => !['Won', 'Lost'].includes(o.status)
  ).length;

  const STATS = [
    { title: 'New Lead (Last 1 Month)', value: newLeadsThisMonth },
    { title: 'New Opportunity (Last 1 Month)', value: newOppsThisMonth },
    { title: 'Won Opportunity (Last 1 Month)', value: wonOpps },
    { title: 'Open Opportunity', value: openOpps },
  ];

  return (
    <div
      className="crm-stat-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '16px',
      }}
    >
      {STATS.map((s) => (
        <StatCard key={s.title} title={s.title} value={s.value} />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CrmDashboard() {
  return (
    <div style={{ padding: '24px', fontFamily: 'var(--font-family)', backgroundColor: 'var(--bg-color)' }}>
      {/* Section 1 — Stat cards */}
      <StatCardsRow />

      {/* Section 2 — Full-width line charts */}
      <ChartCard
        title="Incoming Leads"
        showPeriod
        periodValue="Last Quarter"
        showInterval
        intervalValue="Weekly"
      >
        <BosLineChart data={weeklyData} />
      </ChartCard>

      <ChartCard
        title="Opportunity Trends"
        showPeriod
        periodValue="Last Quarter"
        showInterval
        intervalValue="Weekly"
      >
        <BosLineChart data={weeklyData} />
      </ChartCard>

      <ChartCard
        title="Won Opportunities"
        showPeriod
        periodValue="Last Year"
        showInterval
        intervalValue="Monthly"
      >
        <BosLineChart data={monthlyData} />
      </ChartCard>

      {/* Section 3 — 2-column chart cards */}
      <div
        className="crm-two-col"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <ChartCard title="Territory Wise Opportunity Count" style={{ marginBottom: 0 }}>
          <EmptyChart height={160} />
        </ChartCard>
        <ChartCard title="Opportunities via Campaigns" style={{ marginBottom: 0 }}>
          <EmptyChart height={160} />
        </ChartCard>
      </div>

      {/* Section 4 — Full-width empty chart */}
      <ChartCard title="Territory Wise Sales">
        <EmptyChart height={220} />
      </ChartCard>

      {/* Section 5 — Half-width chart */}
      <div
        className="crm-half-col"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        <ChartCard title="Lead Source" style={{ marginBottom: 0 }}>
          <EmptyChart height={160} />
        </ChartCard>
        <div /> {/* right side intentionally empty */}
      </div>
    </div>
  );
}
