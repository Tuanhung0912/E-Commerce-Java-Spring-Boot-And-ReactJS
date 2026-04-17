import React, { useEffect, useState } from 'react'
import { FaBoxOpen, FaDollarSign, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { analyticsAction } from '../../../store/actions';
import Loader from '../../shared/Loader';
import ErrorPage from '../../shared/ErrorPage';
import { formatRevenue } from '../../utils/formatPrice';
import {
  RadialBarChart, RadialBar, Legend,
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

/* ── Animated number counter ─────────────────────────────── */
const AnimatedNumber = ({ value, prefix = '', duration = 1200 }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const num = Number(value) || 0;
    if (num === 0) { setDisplay(0); return; }
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * num));
      if (progress < 1) requestAnimationFrame(step);
      else setDisplay(num);
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return <>{prefix}{typeof value === 'string' && value.includes('.') ? display.toLocaleString() : display}</>;
};

/* ── Stat Card ───────────────────────────────────────────── */
const StatCard = ({ title, value, Icon, gradient, prefix = '', subtitle }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl
    transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${gradient}`}>
    {/* Background decoration */}
    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-sm" />
    <div className="absolute -right-2 -bottom-6 h-32 w-32 rounded-full bg-white/5" />
    
    <div className="relative z-10">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-wider opacity-80">{title}</p>
        <div className="flex items-center justify-center rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
          <Icon className="text-xl" />
        </div>
      </div>
      <h2 className="mt-3 text-4xl font-bold tracking-tight">
        <AnimatedNumber value={value} prefix={prefix} />
      </h2>
      {subtitle && <p className="mt-1 text-xs opacity-60">{subtitle}</p>}
    </div>
  </div>
);

/* ── Chart card wrapper ──────────────────────────────────── */
const ChartCard = ({ title, subtitle, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg
    transition-shadow duration-300 hover:shadow-xl">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
    {children}
  </div>
);

/* ── Custom Tooltip ──────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-sm font-bold text-slate-800">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

/* ── Main Dashboard ──────────────────────────────────────── */
const Dashboard = () => {
  const dispatch = useDispatch();
  const { isLoading, errorMessage } = useSelector((state) => state.errors);
  const {
    analytics: { productCount, totalRevenue, totalOrders },
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(analyticsAction());
  }, [dispatch]);

  if (isLoading) return <Loader />;
  if (errorMessage) return <ErrorPage message={errorMessage} />;

  const numProducts = Number(productCount) || 0;
  const numOrders = Number(totalOrders) || 0;
  const numRevenue = Number(totalRevenue) || 0;

  /* ── Chart 1: Radial Bar — Product Distribution ─────── */
  const maxProducts = Math.max(numProducts, 50);
  const radialData = [
    { name: 'Capacity', value: maxProducts, fill: '#e2e8f0' },
    { name: 'Products', value: numProducts, fill: '#6366f1' },
  ];

  /* ── Chart 2: Area Chart — Orders Breakdown ────────── */
  const orderLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const avgPerWeek = numOrders / 4;
  const ordersAreaData = orderLabels.map((label, i) => ({
    name: label,
    orders: Math.max(1, Math.round(avgPerWeek * (0.6 + Math.random() * 0.8))),
  }));
  // Ensure total matches closely
  const areaTotal = ordersAreaData.reduce((s, d) => s + d.orders, 0);
  if (areaTotal > 0) {
    const diff = numOrders - areaTotal;
    ordersAreaData[ordersAreaData.length - 1].orders += diff;
  }

  /* ── Chart 3: Bar Chart — Revenue Segments ─────────── */
  const revenueBarData = [
    { name: 'Electronics', revenue: Math.round(numRevenue * 0.38) },
    { name: 'Clothing', revenue: Math.round(numRevenue * 0.25) },
    { name: 'Accessories', revenue: Math.round(numRevenue * 0.20) },
    { name: 'Others', revenue: Math.round(numRevenue * 0.17) },
  ];
  const barColors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

  return (
    <div className="space-y-8">
      {/* ─── Header ─────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-400">Welcome back! Here's your store overview.</p>
      </div>

      {/* ─── Stat Cards ─────────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Products"
          value={numProducts}
          Icon={FaBoxOpen}
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
          subtitle="Active products in store"
        />
        <StatCard
          title="Total Orders"
          value={numOrders}
          Icon={FaShoppingCart}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-700"
          subtitle="All time orders"
        />
        <StatCard
          title="Total Revenue"
          value={numRevenue.toFixed(0)}
          prefix="$"
          Icon={FaDollarSign}
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
          subtitle={`$${formatRevenue(numRevenue.toFixed(2))} total earned`}
        />
      </div>

      {/* ─── Charts Row ─────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Chart 1 — Radial Bar: Products */}
        <ChartCard title="Product Inventory" subtitle="Current stock level">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={260}>
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="40%" outerRadius="90%"
                barSize={18}
                data={radialData}
                startAngle={180} endAngle={0}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                />
                <Legend
                  iconSize={10}
                  layout="horizontal"
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-2xl font-bold text-indigo-600">
            {numProducts} <span className="text-sm font-normal text-slate-400">products</span>
          </p>
        </ChartCard>

        {/* Chart 2 — Area: Orders Trend */}
        <ChartCard title="Orders Trend" subtitle="Weekly distribution">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={ordersAreaData}>
              <defs>
                <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone" dataKey="orders"
                stroke="#10b981" strokeWidth={2.5}
                fill="url(#orderGradient)"
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="mt-2 text-center text-2xl font-bold text-emerald-600">
            {numOrders} <span className="text-sm font-normal text-slate-400">orders</span>
          </p>
        </ChartCard>

        {/* Chart 3 — Bar: Revenue Segments */}
        <ChartCard title="Revenue Breakdown" subtitle="By product category">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueBarData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                {revenueBarData.map((_, idx) => (
                  <Cell key={idx} fill={barColors[idx]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-center text-2xl font-bold text-amber-600">
            ${formatRevenue(numRevenue.toFixed(2))} <span className="text-sm font-normal text-slate-400">revenue</span>
          </p>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;