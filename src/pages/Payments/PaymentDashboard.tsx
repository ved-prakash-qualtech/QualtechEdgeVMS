import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Calendar, 
  ShieldAlert, 
  Download, 
  Percent, 
  RefreshCcw,
  Zap,
  Building,
  CheckSquare
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import styles from './PaymentDashboard.module.css';

// Mock Data
const paymentStatusData = [
  { name: 'Reconciled', value: 520, color: '#16a34a' },
  { name: 'Approved', value: 140, color: '#3b82f6' },
  { name: 'Processed', value: 290, color: '#1d4ed8' },
  { name: 'Pending', value: 85, color: '#f59e0b' },
  { name: 'Failed', value: 12, color: '#dc2626' },
  { name: 'Reversed', value: 8, color: '#7c3aed' },
];

const monthlyPaymentTrend = [
  { month: 'Dec', volume: 4.8 },
  { month: 'Jan', volume: 5.6 },
  { month: 'Feb', volume: 6.2 },
  { month: 'Mar', volume: 8.5 },
  { month: 'Apr', volume: 9.1 },
  { month: 'May', volume: 11.4 },
];

const vendorPayouts = [
  { name: 'ABC Infotech', payout: 75.2 },
  { name: 'Secure Facilities', payout: 38.6 },
  { name: 'Global Security', payout: 24.1 },
  { name: 'Fincons Consulting', payout: 18.9 },
  { name: 'Data Soft', payout: 14.2 },
];

const agingBuckets = [
  { range: 'Due Today', amount: 1.5 },
  { range: '1-7 Days', amount: 3.8 },
  { range: '8-15 Days', amount: 2.1 },
  { range: 'Overdue', amount: 0.6 },
];

const steps = [
  'Invoice Selection',
  'Payment Validation',
  'Scheduling',
  'Approval Workflow',
  'Bank Processing',
  'Execution',
  'Remittance',
  'Reconciliation',
  'Compliance & Tax',
  'Closure & Analytics'
];

export const PaymentDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Treasury & Payments</h1>
          <p className={styles.subtitle}>Automate payment execution, treasury scheduling, and bank reconciliation</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.dateFilter}>
            <span>12 May 2026 - 18 May 2026</span>
          </div>
          <Button icon={<CreditCard size={16} />} onClick={() => navigate('/payments/processing')}>Release Payouts</Button>
        </div>
      </header>

      {/* 10-Step horizontal stepper */}
      <Card className={styles.stepperCard}>
        <h3 className={styles.sectionTitle}>Payments Lifecycle</h3>
        <div className={styles.stepperScroll}>
          <div className={styles.stepperContainer}>
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <div className={styles.stepItem}>
                  <div className={`${styles.stepCircle} ${index === 0 ? styles.stepCircleActive : ''}`}>
                    {index + 1}
                  </div>
                  <span className={styles.stepLabel}>{step}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight size={14} className={styles.stepArrow} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Payments</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}><CreditCard size={18} /></div>
          </div>
          <div className={styles.kpiValue}>1,055</div>
          <div className={styles.kpiFooterGreen}>↑ 12.4% vs last month</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Pending Payouts</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}><Clock size={18} /></div>
          </div>
          <div className={styles.kpiValue}>85</div>
          <div className={styles.kpiFooter}>Requires Authorization</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Completed Payments</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}><CheckCircle2 size={18} /></div>
          </div>
          <div className={styles.kpiValue}>810</div>
          <div className={styles.kpiFooterGreen}>Successfully Settled</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Failed Payments</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}><XCircle size={18} /></div>
          </div>
          <div className={styles.kpiValue}>12</div>
          <div className={styles.kpiFooterRed}>Beneficiary account issues</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>MSME Due</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}><ShieldAlert size={18} /></div>
          </div>
          <div className={styles.kpiValue}>6</div>
          <div className={styles.kpiFooterRed}>Nearing 45-day threshold</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>TDS Deducted</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}><Percent size={18} /></div>
          </div>
          <div className={styles.kpiValue}>₹14.2 L</div>
          <div className={styles.kpiFooter}>Pending return filing</div>
        </Card>
      </div>

      <div className={styles.chartGrid}>
        {/* Payment Status Donut */}
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>Payment Status Distribution</h3>
          <div className={styles.pieWrapper}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {paymentStatusData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.pieCenter}>
              <span>1,055</span>
              <p>Total Payouts</p>
            </div>
          </div>
          <div className={styles.legendGrid}>
            {paymentStatusData.map(item => (
              <div key={item.name} className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: item.color }}></span>
                <span className={styles.legendName}>{item.name}</span>
                <span className={styles.legendVal}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly Payment Trend */}
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>Monthly Payment Trend (₹ Cr)</h3>
          <div style={{ height: '240px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyPaymentTrend} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="volume" stroke="#1d4ed8" strokeWidth={3} dot={{ r: 4, fill: '#1d4ed8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Vendors Payout */}
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>Top Vendors by Payout (₹ L)</h3>
          <div style={{ height: '240px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorPayouts} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip />
                <Bar dataKey="payout" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Aging */}
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>Payment Payout Aging (₹ Cr)</h3>
          <div style={{ height: '240px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingBuckets} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip />
                <Bar dataKey="amount" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className={styles.bottomGrid}>
        {/* Quick Actions */}
        <Card className={styles.quickCard}>
          <h3 className={styles.sectionTitle}>Quick Actions</h3>
          <div className={styles.actionRow}>
            <button className={styles.actionBtn} onClick={() => navigate('/payments/processing')}>
              <div className={styles.iconBox}><CreditCard size={18} /></div>
              <span>Release Payments</span>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.iconBox}><Calendar size={18} /></div>
              <span>Schedule Payments</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/payments/approvals')}>
              <div className={styles.iconBox}><CheckSquare size={18} /></div>
              <span>Approve Payouts</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/payments/list')}>
              <div className={styles.iconBox}><Building size={18} /></div>
              <span>Bank Reconciliation</span>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.iconBox}><RefreshCcw size={18} /></div>
              <span>Retry Failures</span>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.iconBox}><Download size={18} /></div>
              <span>Export Treasury Log</span>
            </button>
          </div>
        </Card>

        {/* AI Treasury Insights */}
        <Card className={styles.aiCard}>
          <h3 className={styles.sectionTitle}>AI Treasury Insights</h3>
          <div className={styles.aiList}>
            <div className={styles.aiItem}>
              <ShieldAlert size={16} className={styles.aiIconRed} />
              <div>
                <p className={styles.aiText}><strong>MSME Payment compliance warning</strong>: 2 payments to MSME vendors are within 4 days of the 45-day statutory limit.</p>
                <button className={styles.aiLink}>Expedite Payments</button>
              </div>
            </div>
            <div className={styles.aiItem}>
              <AlertTriangle size={16} className={styles.aiIconOrange} />
              <div>
                <p className={styles.aiText}><strong>Transaction failure risk</strong>: Bank verification returned invalid IFSC format for Fincons Consulting ledger details.</p>
                <button className={styles.aiLink}>Update Bank Credentials</button>
              </div>
            </div>
            <div className={styles.aiItem}>
              <Zap size={16} className={styles.aiIconBlue} />
              <div>
                <p className={styles.aiText}><strong>Cash discount incentive</strong>: Pay Secure Facilities Ltd by tomorrow to secure a 1.5% prompt settlement rebate (₹7,965).</p>
                <button className={styles.aiLink}>Release Early Payment</button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
