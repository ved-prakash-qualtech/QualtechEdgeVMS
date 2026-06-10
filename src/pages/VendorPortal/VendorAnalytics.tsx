import React, { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { BarChart2, TrendingUp, CheckCircle, Clock, CreditCard, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVendorDashboard, useVendorInvoices, useVendorPOs, useVendorPayments } from '../../hooks/useVendorPortal';
import s from './vendor.module.css';

const CHART_COLORS = ['#1d4ed8', '#16a34a', '#d97706', '#7c3aed', '#dc2626', '#0369a1'];

function monthLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 8, padding: '10px 14px', fontSize: 12, boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.name?.includes('₹')
            ? `₹${p.value.toLocaleString('en-IN')}`
            : p.value}
        </div>
      ))}
    </div>
  );
};

export const VendorAnalytics: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading: statsLoading } = useVendorDashboard();
  const { data: invoices = [] } = useVendorInvoices();
  const { data: pos = [] } = useVendorPOs();
  const { data: payments = [] } = useVendorPayments();

  // KPIs
  const totalInvoiced = invoices.reduce((sum, i) => sum + (i.amount ?? 0), 0);
  const totalPaid = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const paidCount = payments.filter(p => p.status === 'Completed').length;
  const pendingInvoices = invoices.filter(i => i.paymentStatus !== 'Paid').length;
  const acknowledgedPOs = pos.filter(p => p.status === 'Acknowledged' || p.status === 'Delivered').length;

  // Monthly invoice bar data
  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    invoices.forEach(inv => {
      if (!inv.submitDate) return;
      const key = monthLabel(inv.submitDate);
      map[key] = (map[key] ?? 0) + (inv.amount ?? 0);
    });
    return Object.entries(map).map(([month, amount]) => ({ month, '₹ Invoiced': amount }));
  }, [invoices]);

  // Payment cycle line data (days from invoice submit to payment)
  const cycleData = useMemo(() => {
    return payments
      .filter(p => p.status === 'Completed' && p.paymentDate)
      .map((p, i) => {
        const inv = invoices.find(inv => inv.invoiceId === p.invoiceId);
        if (!inv?.submitDate) return null;
        const days = Math.ceil((new Date(p.paymentDate).getTime() - new Date(inv.submitDate).getTime()) / (1000 * 60 * 60 * 24));
        return { name: `Inv ${i + 1}`, 'Days to Payment': Math.max(0, days) };
      })
      .filter(Boolean) as { name: string; 'Days to Payment': number }[];
  }, [invoices, payments]);

  // PO status pie data
  const poStatusData = useMemo(() => {
    const groups: Record<string, number> = {};
    pos.forEach(p => {
      const key = p.status.replace('Pending Acknowledgment', 'Pending Ack.').replace('Pending Acknowledgement', 'Pending Ack.');
      groups[key] = (groups[key] ?? 0) + 1;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [pos]);

  // Invoice stage pie data
  const invoiceStageData = useMemo(() => {
    const groups: Record<string, number> = {};
    invoices.forEach(inv => {
      const key = inv.verificationStage || 'Unknown';
      groups[key] = (groups[key] ?? 0) + 1;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [invoices]);

  if (statsLoading) {
    return (
      <div className={s.page}>
        <div className={s.kpiGrid}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={s.kpiCard}>
              <div className={s.skeleton} style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className={s.skeleton} style={{ height: 10, width: '60%' }} />
                <div className={s.skeleton} style={{ height: 22, width: '40%', marginTop: 6 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <div className={s.pageTitle}>{t('analytics.title')}</div>
          <div className={s.pageSubtitle}>{t('analytics.subtitle')}</div>
        </div>
      </div>

      {/* KPI row */}
      <div className={s.kpiGrid}>
        <div className={s.kpiCard}>
          <div className={s.kpiIcon} style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}><CreditCard size={22} /></div>
          <div className={s.kpiBody}>
            <div className={s.kpiLabel}>{t('analytics.totalInvoiced')}</div>
            <div className={s.kpiValue}>₹{totalInvoiced.toLocaleString('en-IN')}</div>
            <div className={s.kpiSub}>{invoices.length} invoices</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIcon} style={{ background: '#d1fae5', color: '#059669' }}><TrendingUp size={22} /></div>
          <div className={s.kpiBody}>
            <div className={s.kpiLabel}>{t('analytics.totalReceived')}</div>
            <div className={s.kpiValue} style={{ color: '#059669' }}>₹{totalPaid.toLocaleString('en-IN')}</div>
            <div className={s.kpiSub}>{paidCount} payments cleared</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIcon} style={{ background: '#fef3c7', color: '#d97706' }}><Clock size={22} /></div>
          <div className={s.kpiBody}>
            <div className={s.kpiLabel}>{t('analytics.pendingInvoices')}</div>
            <div className={s.kpiValue} style={{ color: '#d97706' }}>{pendingInvoices}</div>
            <div className={s.kpiSub}>Awaiting payment</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIcon} style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}><Package size={22} /></div>
          <div className={s.kpiBody}>
            <div className={s.kpiLabel}>{t('analytics.activePOs')}</div>
            <div className={s.kpiValue} style={{ color: 'var(--color-info)' }}>{acknowledgedPOs}</div>
            <div className={s.kpiSub}>In delivery / acknowledged</div>
          </div>
        </div>
      </div>

      {/* Charts row 1: Monthly Bar + Payment Cycle Line */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        <div className={s.card}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><BarChart2 size={15} /> {t('analytics.monthlyInvoiced')}</div>
          </div>
          {monthlyData.length === 0 ? (
            <div className={s.emptyState} style={{ padding: 24 }}><div className={s.emptyText}>No invoice data</div></div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="₹ Invoiced" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><TrendingUp size={15} /> {t('analytics.paymentCycle')}</div>
          </div>
          {cycleData.length === 0 ? (
            <div className={s.emptyState} style={{ padding: 24 }}><div className={s.emptyText}>No payment cycle data</div></div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={cycleData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} unit="d" />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Days to Payment" stroke="#16a34a" strokeWidth={2} dot={{ r: 4, fill: '#16a34a' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts row 2: PO Pie + Invoice Pie */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className={s.card}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><BarChart2 size={15} /> {t('analytics.poBreakdown')}</div>
          </div>
          {poStatusData.length === 0 ? (
            <div className={s.emptyState} style={{ padding: 24 }}><div className={s.emptyText}>No PO data</div></div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={poStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {poStatusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><CheckCircle size={15} /> {t('analytics.invoiceBreakdown')}</div>
          </div>
          {invoiceStageData.length === 0 ? (
            <div className={s.emptyState} style={{ padding: 24 }}><div className={s.emptyText}>No invoice data</div></div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={invoiceStageData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {invoiceStageData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
