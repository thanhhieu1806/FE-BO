import React, { useState, useEffect } from 'react';
import StatCard from './components/StatCard/StatCard';
import TransactionTrendChart from './components/TransactionTrendChart/TransactionTrendChart';
import DonutChart from './components/DonutChart/DonutChart';
import RecentTransactions from './components/RecentTransactions/RecentTransactions';
import dashboardService from '../../services/dashboard/dashboardService';
import {
  CompanyIcon,
  AdminIcon,
  DeviceIcon,
  RefreshIcon,
  ExportIcon,
} from '../../assets/icons';
import { brand, palette, text } from '../../design-tokens';

const cardClass =
  'box-border rounded-lg border border-border-primary bg-surface-primary p-4 sm:p-5';

const DASH = '—';
const DASH_COLOR = '#bfc7d1';


/* ── Get date range label from period ── */
const getPeriodLabel = (period) => {
  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

  if (period === 'Today') {
    const now = today;
    return `(${fmt(now)} 00:00 - ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')})`;
  }
  if (period === 'This week') {
    const day = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const start = new Date(today); start.setDate(today.getDate() - day); start.setHours(0, 0, 0, 0);
    return `(${fmt(start)} - ${fmt(today)})`;
  }
  // This month
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  return `(${fmt(start)} - ${fmt(today)})`;
};

/* ── Get params from period ── */
const getParamsFromPeriod = (period) => {
  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const fmtParam = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (period === 'Today') {
    const s = fmtParam(today);
    return { dateFrom: s, dateTo: s };
  }
  if (period === 'This week') {
    const day = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const start = new Date(today); start.setDate(today.getDate() - day);
    return { dateFrom: fmtParam(start), dateTo: fmtParam(today) };
  }
  // This month
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  return { dateFrom: fmtParam(start), dateTo: fmtParam(today) };
};

const Dashboard = () => {
  const [period, setPeriod] = useState('Today');
  const [attPeriod, setAttPeriod] = useState('Today');
  const [visPeriod, setVisPeriod] = useState('Today');
  const [summary, setSummary] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [visitorData, setVisitorData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  /* Fetch trend + summary when period changes */
  useEffect(() => {
    const params = getParamsFromPeriod(period);
    const fetchMain = async () => {
      try {
        const [sum, trend, txns] = await Promise.all([
          dashboardService.getSummary(params),
          dashboardService.getTrend(params),
          dashboardService.getRecentTransactions(params),
        ]);
        setSummary(sum);
        setTrendData(trend);
        setRecentTransactions(txns ?? []);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      }
    };
    fetchMain();
  }, [period, refreshKey]);

  /* Fetch attendance when attPeriod changes */
  useEffect(() => {
    const params = getParamsFromPeriod(attPeriod);
    dashboardService.getAttendance(params)
      .then(setAttendanceData)
      .catch(() => { });
  }, [attPeriod, refreshKey]);

  /* Fetch visitor when visPeriod changes */
  useEffect(() => {
    const params = getParamsFromPeriod(visPeriod);
    dashboardService.getVisitor(params)
      .then(setVisitorData)
      .catch(() => { });
  }, [visPeriod, refreshKey]);

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  const companies = summary?.businesses ?? { active: DASH, cancelled: DASH };
  const users = summary?.users ?? { active: DASH, cancelled: DASH };
  const devices = summary?.devices ?? { active: DASH, cancelled: DASH };

  return (
    <div className="box-border flex w-full flex-col gap-3 p-3 sm:p-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold leading-none text-text-primary">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="box-border flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-border-primary bg-surface-primary px-3 text-[13px] font-medium text-text-primary transition-colors hover:bg-surface-tertiary"
            title="Refresh data"
          >
            <RefreshIcon size={14} color="#6B7280" />
            Refresh
          </button>
          <button
            type="button"
            className="box-border flex h-9 shrink-0 items-center gap-1.5 rounded-md border-0 bg-brand-primary px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-secondary"
          >
            <ExportIcon size={14} color="#FCFCFC" />
            Export
          </button>
        </div>
      </div>

      {/* ── Stat Cards: 3 cột (Company, Users, Devices) ── */}
      <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={<CompanyIcon size={16} />}
          iconColor={brand.primary}
          title="Company"
          stats={[
            { label: 'Active', value: companies.active, valueColor: companies.active === DASH ? DASH_COLOR : text.success },
            { label: 'Cancelled', value: companies.cancelled, valueColor: companies.cancelled === DASH ? DASH_COLOR : text.error },
          ]}
        />
        <StatCard
          icon={<AdminIcon size={16} />}
          iconColor={palette.green[500]}
          title="Users"
          stats={[
            { label: 'Active', value: users.active, valueColor: users.active === DASH ? DASH_COLOR : text.success },
            { label: 'Cancelled', value: users.cancelled, valueColor: companies.cancelled === DASH ? DASH_COLOR : text.error },
          ]}
        />
        <StatCard
          icon={<DeviceIcon size={16} />}
          iconColor={palette.violet[500]}
          title="Devices"
          stats={[
            { label: 'Active', value: devices.active, valueColor: devices.active === DASH ? DASH_COLOR : text.success },
            { label: 'Cancelled', value: devices.cancelled, valueColor: devices.cancelled === DASH ? DASH_COLOR : text.error },
          ]}
        />
      </div>

      {/* ── Charts Row: left 1fr, right 380px — cả 2 cột stretch bằng nhau ── */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-[1fr_380px] xl:items-stretch">

        {/* Transaction Trend Chart */}
        <div className={`${cardClass} flex flex-col`}>
          <TransactionTrendChart
            data={trendData}
            period={period}
            onPeriodChange={setPeriod}
            periodLabel={getPeriodLabel(period)}
          />
        </div>

        {/* Right column: Attendance + Visitor — stretch full height, chia đều */}
        <div className="flex flex-col gap-2 xl:h-full">

          {/* Attendance */}
          <div className={`${cardClass} flex flex-col flex-1`}>
            <DonutChart
              title="Attendance"
              period={attPeriod}
              onPeriodChange={setAttPeriod}
              total={attendanceData?.total ?? 0}
              segments={attendanceData?.segments ?? []}
              emptyVariant="attendance"
            />
          </div>

          {/* Visitor */}
          <div className={`${cardClass} flex flex-col flex-1`}>
            <DonutChart
              title="Visitor"
              period={visPeriod}
              onPeriodChange={setVisPeriod}
              total={visitorData?.total ?? 0}
              segments={visitorData?.segments ?? []}
              emptyVariant="visitor"
            />
          </div>
        </div>
      </div>

      {/* ── Latest 10 Transactions ── */}
      <div className={cardClass}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold leading-[30px] text-text-primary">Latest 10 Transactions</h2>
          <button
            type="button"
            className="border-0 bg-transparent p-0 text-[13px] font-medium text-brand-primary transition-opacity hover:underline"
          >
            View all
          </button>
        </div>
        <RecentTransactions transactions={recentTransactions} />
      </div>

    </div>
  );
};

export default Dashboard;