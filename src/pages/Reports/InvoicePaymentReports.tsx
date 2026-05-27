import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, DollarSign, Landmark, Percent, Download } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  LineChart, 
  Line 
} from 'recharts';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import styles from './InvoicePaymentReports.module.css';

const mockAging = [
  { bucket: 'Not Due', amount: 3.5 },
  { bucket: '1-30 Days', amount: 1.2 },
  { bucket: '31-45 Days', amount: 0.8 },
  { bucket: 'Over 45 Days', amount: 0.1 },
];

const mockAPCycle = [
  { month: 'Dec', days: 12.4 },
  { month: 'Jan', monthAverage: 11.2 },
  { month: 'Feb', monthAverage: 9.8 },
  { month: 'Mar', monthAverage: 8.5 },
  { month: 'Apr', monthAverage: 8.9 },
  { month: 'May', monthAverage: 7.4 },
];

const taxLedger = [
  { id: 'INV-2026-9908', vendor: 'ABC Infotech Pvt Ltd', value: 1475000, tds: 147500, gst: 225000, status: 'Reconciled' },
  { id: 'INV-2026-9907', vendor: 'Secure Facilities Ltd', value: 531000, tds: 53100, gst: 81000, status: 'Reconciled' },
  { id: 'INV-2026-9906', vendor: 'Fincons Consulting', value: 189000, tds: 18900, gst: 28800, status: 'Processing' },
  { id: 'INV-2026-9905', vendor: 'Global Security Ltd', value: 241000, tds: 24100, gst: 36700, status: 'Failed' },
];

export const InvoicePaymentReports: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/reports/dashboard')}>
            <ChevronLeft size={16} /> Back to MIS
          </button>
          <h1 className={styles.title}>Invoice & Payment Treasury Ledger</h1>
          <p className={styles.subtitle}>Audit accounts payable cycle, tax deductions (TDS), GST input credit matching, and cash allocations</p>
        </div>
        <Button variant="outline" icon={<Download size={16} />}>Export AP MIS</Button>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Outstanding Liability</span>
            <DollarSign size={16} className={styles.icon} />
          </div>
          <div className={styles.kpiValue}>₹5.6 Cr</div>
          <div className={styles.trendGreen}>Authorized payables</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>TDS Deductions</span>
            <Percent size={16} className={styles.icon} />
          </div>
          <div className={styles.kpiValue}>₹24.3 L</div>
          <div className={styles.trendGreen}>Ready for return filing</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>GST Input Tax Credit</span>
            <Landmark size={16} className={styles.icon} />
          </div>
          <div className={styles.kpiValue}>₹38.5 L</div>
          <div className={styles.trendGreen}>98% matched in GSTR-2B</div>
        </Card>
      </div>

      <div className={styles.chartGrid}>
        {/* Invoice Aging Bucket */}
        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Accounts Payable Aging Bucket (₹ Cr)</h3>
          <div style={{ height: '260px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAging} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="bucket" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AP Cycle Efficiency */}
        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>AP Turnaround SLA Trend (Days)</h3>
          <div style={{ height: '260px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockAPCycle} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="monthAverage" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tax matching logs */}
      <Card className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>Tax Deductions and Input Credit Matches</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Vendor</th>
                <th>Gross Value</th>
                <th>TDS Deducted (₹)</th>
                <th>GST Component (₹)</th>
                <th>Reconciliation Status</th>
              </tr>
            </thead>
            <tbody>
              {taxLedger.map(row => (
                <tr key={row.id}>
                  <td className={styles.invoiceId}>{row.id}</td>
                  <td className={styles.vendorName}>{row.vendor}</td>
                  <td>₹{row.value.toLocaleString('en-IN')}</td>
                  <td style={{ fontWeight: 600 }}>₹{row.tds.toLocaleString('en-IN')}</td>
                  <td style={{ color: 'var(--color-primary)', fontWeight: 600 }}>₹{row.gst.toLocaleString('en-IN')}</td>
                  <td>
                    <span 
                      className={
                        row.status === 'Reconciled' ? styles.statusGreen : 
                        row.status === 'Processing' ? styles.statusOrange : styles.statusRed
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
