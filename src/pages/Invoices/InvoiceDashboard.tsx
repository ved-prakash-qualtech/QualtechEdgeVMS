import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Percent, 
  ArrowRight, 
  Upload, 
  ShieldAlert, 
  FileSpreadsheet, 
  CheckSquare, 
  RefreshCcw
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
import styles from './InvoiceDashboard.module.css';

// Mock Data
const invoiceStatusData = [
  { name: 'Paid', value: 488, color: '#16a34a' },
  { name: 'Approved', value: 245, color: '#3b82f6' },
  { name: 'Pending Match', value: 184, color: '#f59e0b' },
  { name: 'Draft', value: 92, color: '#64748b' },
  { name: 'Rejected', value: 45, color: '#dc2626' },
  { name: 'Exception', value: 38, color: '#7c3aed' },
];

const monthlyTrendData = [
  { month: 'Dec', value: 1.2 },
  { month: 'Jan', value: 2.5 },
  { month: 'Feb', value: 3.8 },
  { month: 'Mar', value: 4.2 },
  { month: 'Apr', value: 5.6 },
  { month: 'May', value: 7.8 },
];

const vendorSpendData = [
  { name: 'ABC Infotech', spend: 45.8 },
  { name: 'Secure Facilities', spend: 28.4 },
  { name: 'Global Security', spend: 18.2 },
  { name: 'Fincons Consulting', spend: 12.6 },
  { name: 'Data Soft', spend: 8.5 },
];

const agingData = [
  { range: '0-30 Days', amount: 3.2 },
  { range: '31-60 Days', amount: 1.8 },
  { range: '61-90 Days', amount: 0.9 },
  { range: '90+ Days', amount: 0.4 },
];

const steps = [
  'Invoice Upload',
  'OCR & AI Extraction',
  'Invoice Validation',
  '3-Way Matching',
  'GST & Tax Validation',
  'Approval Workflow',
  'Exception Handling',
  'Payment Processing',
  'Reconciliation',
  'Analytics & Closure'
];

export const InvoiceDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Invoice Management</h1>
          <p className={styles.subtitle}>Automate Accounts Payable processing and compliance</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.dateFilter}>
            <span>12 May 2026 - 18 May 2026</span>
          </div>
          <Button icon={<Upload size={16} />} onClick={() => navigate('/invoices/upload')}>Upload Invoice</Button>
        </div>
      </header>

      {/* 10-Step Invoice Flow Stepper */}
      <Card className={styles.stepperCard}>
        <h3 className={styles.sectionTitle}>AP Automation Lifecycle</h3>
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
            <span className={styles.kpiLabel}>Total Invoices</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}><FileText size={18} /></div>
          </div>
          <div className={styles.kpiValue}>1,092</div>
          <div className={styles.kpiFooterGreen}>↑ 8.2% vs last month</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Pending Validation</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}><Clock size={18} /></div>
          </div>
          <div className={styles.kpiValue}>184</div>
          <div className={styles.kpiFooter}>Requires 3-Way Match</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Approved Invoices</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}><CheckCircle2 size={18} /></div>
          </div>
          <div className={styles.kpiValue}>245</div>
          <div className={styles.kpiFooterGreen}>Ready for Disbursement</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Rejected Invoices</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}><XCircle size={18} /></div>
          </div>
          <div className={styles.kpiValue}>45</div>
          <div className={styles.kpiFooterRed}>Due to SLA discrepancies</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Duplicate Risk</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}><ShieldAlert size={18} /></div>
          </div>
          <div className={styles.kpiValue}>14</div>
          <div className={styles.kpiFooterRed}>Flagged by AI Engine</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>GST Exceptions</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#fef3c7', color: '#d97706' }}><AlertTriangle size={18} /></div>
          </div>
          <div className={styles.kpiValue}>28</div>
          <div className={styles.kpiFooter}>GSTR-2B mismatches</div>
        </Card>
      </div>

      <div className={styles.chartGrid}>
        {/* Invoice Status Donut */}
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>Invoice Status Distribution</h3>
          <div className={styles.pieWrapper}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {invoiceStatusData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.pieCenter}>
              <span>1,092</span>
              <p>Total</p>
            </div>
          </div>
          <div className={styles.legendGrid}>
            {invoiceStatusData.map(item => (
              <div key={item.name} className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: item.color }}></span>
                <span className={styles.legendName}>{item.name}</span>
                <span className={styles.legendVal}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly Invoice Trend */}
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>Monthly Invoice Spend Trend (₹ Cr)</h3>
          <div style={{ height: '240px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="value" stroke="#1d4ed8" strokeWidth={3} dot={{ r: 4, fill: '#1d4ed8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Vendor Spend */}
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>Vendor Spend Analysis (₹ L)</h3>
          <div style={{ height: '240px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorSpendData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip />
                <Bar dataKey="spend" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Aging Analysis */}
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>Invoice Aging Analysis (₹ Cr)</h3>
          <div style={{ height: '240px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
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
            <button className={styles.actionBtn} onClick={() => navigate('/invoices/upload')}>
              <div className={styles.iconBox}><Upload size={18} /></div>
              <span>Upload Invoice</span>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.iconBox}><FileSpreadsheet size={18} /></div>
              <span>Bulk Upload</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/invoices/list')}>
              <div className={styles.iconBox}><CheckSquare size={18} /></div>
              <span>3-Way Match</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/invoices/approvals')}>
              <div className={styles.iconBox}><CheckCircle2 size={18} /></div>
              <span>Verify Queue</span>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.iconBox}><Percent size={18} /></div>
              <span>TDS & Tax Validation</span>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.iconBox}><RefreshCcw size={18} /></div>
              <span>Export AP Advice</span>
            </button>
          </div>
        </Card>

        {/* AI Smart Insights */}
        <Card className={styles.aiCard}>
          <h3 className={styles.sectionTitle}>AI Accounts Payable Insights</h3>
          <div className={styles.aiList}>
            <div className={styles.aiItem}>
              <ShieldAlert size={16} className={styles.aiIconRed} />
              <div>
                <p className={styles.aiText}><strong>Possible duplicate detected</strong>: Invoice #INV-2026-9908 matches PO-2026-000789 value and date.</p>
                <button className={styles.aiLink}>Review Mismatch</button>
              </div>
            </div>
            <div className={styles.aiItem}>
              <AlertTriangle size={16} className={styles.aiIconOrange} />
              <div>
                <p className={styles.aiText}><strong>GST compliance risk</strong>: GSTR-2B lookup failed for Secure Facilities Ltd (GSTIN mismatch).</p>
                <button className={styles.aiLink}>Verify GSTIN</button>
              </div>
            </div>
            <div className={styles.aiItem}>
              <Percent size={16} className={styles.aiIconBlue} />
              <div>
                <p className={styles.aiText}><strong>Discount Opportunity</strong>: Early settlement discount of 2% available for ABC Infotech Invoice.</p>
                <button className={styles.aiLink}>Process Early Payment</button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
