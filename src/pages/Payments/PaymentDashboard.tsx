import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Users,
  ArrowRight, 
  Search,
  Filter,
  Download
} from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './PaymentDashboard.module.css';

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

// Mock Payment Data
const mockPayments = [
  { id: 'PAY-2026-0087', vendor: 'ABC Infotech Pvt Ltd',   invoice: 'INV-2026-9908', amount: 1475000, mode: 'RTGS', status: 'Completed',  utr: 'HDFCR520260512001', sched: '12 May 2026', processed: '12 May 2026', type: 'MSME' },
  { id: 'PAY-2026-0088', vendor: 'Secure Facilities Ltd',  invoice: 'INV-2026-9907', amount:  531000, mode: 'RTGS', status: 'Completed',  utr: 'HDFCR520260512002', sched: '12 May 2026', processed: '12 May 2026', type: 'Non-MSME' },
  { id: 'PAY-2026-0089', vendor: 'Fincons Consulting',     invoice: 'INV-2026-9906', amount:  189000, mode: 'NEFT', status: 'Processing', utr: 'Awaiting Bank...',  sched: '19 May 2026', processed: 'Pending',      type: 'Non-MSME' },
  { id: 'PAY-2026-0090', vendor: 'Global Security Ltd',    invoice: 'INV-2026-9905', amount:  241000, mode: 'IMPS', status: 'Failed',     utr: 'REJECT-B2-09',     sched: '18 May 2026', processed: 'Failed',       type: 'Non-MSME' },
];

type TabKey = 'All' | 'Completed' | 'Processing' | 'Failed' | 'MSME';

export const PaymentDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Payment list filter states
  const [activeTab, setActiveTab] = useState<TabKey>('All');
  const [search, setSearch] = useState('');

  // Dynamic tab counts
  const tabCounts: Record<TabKey, number> = {
    All:        mockPayments.length,
    Completed:  mockPayments.filter(p => p.status === 'Completed').length,
    Processing: mockPayments.filter(p => p.status === 'Processing').length,
    Failed:     mockPayments.filter(p => p.status === 'Failed').length,
    MSME:       mockPayments.filter(p => p.type === 'MSME').length,
  };

  const filteredPayments = mockPayments.filter(p => {
    if (activeTab === 'Completed'  && p.status !== 'Completed')  return false;
    if (activeTab === 'Processing' && p.status !== 'Processing') return false;
    if (activeTab === 'Failed'     && p.status !== 'Failed')     return false;
    if (activeTab === 'MSME'       && p.type   !== 'MSME')       return false;
    const q = search.toLowerCase();
    if (q) return p.vendor.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.invoice.toLowerCase().includes(q);
    return true;
  });

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

      {/* KPI Cards — aligned 1-to-1 with Payment List tabs */}
      <div className={styles.kpiGrid}>
        <Card
          className={`${styles.kpiCard} ${activeTab === 'All' ? styles.kpiCardActive : ''}`}
          onClick={() => setActiveTab('All')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Payments</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}><CreditCard size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts.All.toLocaleString()}</div>
          <div className={styles.kpiFooterGreen}>↑ 12.4% vs last month</div>
        </Card>

        <Card
          className={`${styles.kpiCard} ${activeTab === 'Completed' ? styles.kpiCardActive : ''}`}
          onClick={() => setActiveTab('Completed')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Completed</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}><CheckCircle2 size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts.Completed.toLocaleString()}</div>
          <div className={styles.kpiFooterGreen}>Successfully settled</div>
        </Card>

        <Card
          className={`${styles.kpiCard} ${activeTab === 'Processing' ? styles.kpiCardActive : ''}`}
          onClick={() => setActiveTab('Processing')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Processing</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}><AlertTriangle size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts.Processing.toLocaleString()}</div>
          <div className={styles.kpiFooter}>Awaiting bank confirmation</div>
        </Card>

        <Card
          className={`${styles.kpiCard} ${activeTab === 'Failed' ? styles.kpiCardActive : ''}`}
          onClick={() => setActiveTab('Failed')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Failed</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}><XCircle size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts.Failed.toLocaleString()}</div>
          <div className={styles.kpiFooterRed}>Beneficiary account issues</div>
        </Card>

        <Card
          className={`${styles.kpiCard} ${activeTab === 'MSME' ? styles.kpiCardActive : ''}`}
          onClick={() => setActiveTab('MSME')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>MSME Payments</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}><Users size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts.MSME.toLocaleString()}</div>
          <div className={styles.kpiFooter}>Statutory 45-day tracking</div>
        </Card>
      </div>

      {/* Payment List Card */}
      <Card className={styles.tableCard}>
        {/* Tabs */}
        <div className={styles.tabs}>
          {(['All', 'Completed', 'Processing', 'Failed', 'MSME'] as TabKey[]).map(tab => (
            <div
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'All' ? 'All Payments' : `${tab}`} ({tabCounts[tab]})
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className={styles.tableToolbar}>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search vendor name, payment ID or invoice ref..."
              className={styles.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.toolbarActions}>
            <Button variant="ghost" icon={<Filter size={16} />}>Advanced Filters</Button>
            <Button variant="outline" icon={<Download size={16} />}>Export</Button>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Vendor Name</th>
                <th>Invoice Ref</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>UTR Reference</th>
                <th>Scheduled Date</th>
                <th>Processed Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(p => (
                <tr key={p.id}>
                  <td className={styles.paymentId}>{p.id}</td>
                  <td>
                    <div className={styles.vendorNameCell}>
                      <span className={styles.vendorName}>{p.vendor}</span>
                      {p.type === 'MSME' && <span className={styles.msmeTag}>MSME</span>}
                    </div>
                  </td>
                  <td>{p.invoice}</td>
                  <td className={styles.amountCell}>₹{p.amount.toLocaleString('en-IN')}</td>
                  <td>{p.mode}</td>
                  <td className={styles.utrCell}>{p.utr}</td>
                  <td>{p.sched}</td>
                  <td>{p.processed}</td>
                  <td>
                    <Badge
                      variant={
                        p.status === 'Completed' ? 'success' :
                        p.status === 'Processing' ? 'warning' : 'danger'
                      }
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      {p.status === 'Completed'  && <button className={styles.actionBtn}><Download size={14} /> Advice</button>}
                      {p.status === 'Failed'     && <button className={styles.actionBtn} style={{ color: '#dc2626' }}>Retry Payout</button>}
                      {p.status === 'Processing' && <button className={styles.actionBtn}>Track Node</button>}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '32px' }}>
                    No payments match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>Showing 1 to {filteredPayments.length} of {filteredPayments.length} entries</span>
          <div className={styles.pageControls}>
            <button className={styles.pageBtnActive}>1</button>
            <button className={styles.pageBtnNext}>&gt;</button>
          </div>
        </div>
      </Card>
      {/* Payments Lifecycle Stepper */}
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
    </div>
  );
};
