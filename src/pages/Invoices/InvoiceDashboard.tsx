import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Upload, 
  Download,
  Eye,
  MoreVertical,
  Search,
  Filter,
  CreditCard
} from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { DataTable } from '../../components/DataTable/DataTable';
import styles from './InvoiceDashboard.module.css';

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

// Mock Data for Invoices List
const invoiceData = [
  { id: 'INV-2026-9908', vendor: 'ABC Infotech Pvt Ltd', poRef: 'PO-2026-000789', value: '₹14,75,000', status: 'Approved', due: '12 Jun 2026', risk: 'Low (12%)', date: '12 May 2026' },
  { id: 'INV-2026-9907', vendor: 'Secure Facilities Ltd', poRef: 'PO-2026-000788', value: '₹5,31,000', status: 'Pending Match', due: '10 Jun 2026', risk: 'Medium (45%)', date: '10 May 2026' },
  { id: 'INV-2026-9906', vendor: 'Global Security', poRef: 'PO-2026-000787', value: '₹10,32,500', status: 'Paid', due: 'Paid', risk: 'Low (8%)', date: '09 May 2026' },
  { id: 'INV-2026-9905', vendor: 'Fincons Consulting', poRef: 'PO-2026-000786', value: '₹25,96,000', status: 'Draft', due: '08 Jun 2026', risk: 'Low (10%)', date: '08 May 2026' },
  { id: 'INV-2026-9904', vendor: 'Tech Solutions', poRef: 'PO-2026-000785', value: '₹4,01,200', status: 'Exception', due: '01 Jun 2026', risk: 'High (78%)', date: '01 May 2026' },
  { id: 'INV-2026-9903', vendor: 'Data Soft', poRef: 'PO-2026-000784', value: '₹1,41,600', status: 'Rejected', due: 'Canceled', risk: 'High (82%)', date: '28 Apr 2026' },
];

export const InvoiceDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Invoice List Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  // Helper functions to clear other filters when clicking KPI cards
  const handleKpiClick = (tabName: string, status: string = 'All', risk: string = 'All') => {
    setActiveTab(tabName);
    setStatusFilter(status);
    setRiskFilter(risk);
  };

  const tabCounts = {
    All: invoiceData.length,
    'Pending Match': invoiceData.filter(inv => inv.status === 'Pending Match').length,
    Exceptions: invoiceData.filter(inv => inv.status === 'Exception').length,
    Approved: invoiceData.filter(inv => inv.status === 'Approved').length,
    Paid: invoiceData.filter(inv => inv.status === 'Paid').length
  };

  const filteredInvoices = invoiceData.filter(inv => {
    // Tab Filter
    if (activeTab === 'Pending Match' && inv.status !== 'Pending Match') return false;
    if (activeTab === 'Exceptions' && inv.status !== 'Exception') return false;
    if (activeTab === 'Approved' && inv.status !== 'Approved') return false;
    if (activeTab === 'Paid' && inv.status !== 'Paid') return false;

    // Status Dropdown Filter
    if (statusFilter !== 'All' && inv.status !== statusFilter) return false;

    // Risk Dropdown Filter
    if (riskFilter !== 'All') {
      const rf = riskFilter.toLowerCase();
      if (rf === 'low risk' && !inv.risk.toLowerCase().includes('low')) return false;
      if (rf === 'medium risk' && !inv.risk.toLowerCase().includes('medium')) return false;
      if (rf === 'high risk' && !inv.risk.toLowerCase().includes('high')) return false;
    }

    // Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = inv.id.toLowerCase().includes(q);
      const matchVendor = inv.vendor.toLowerCase().includes(q);
      const matchPo = inv.poRef.toLowerCase().includes(q);
      return matchId || matchVendor || matchPo;
    }

    return true;
  });

  const columns = [
    { header: 'Invoice Number', accessor: 'id' as keyof typeof invoiceData[0] },
    { header: 'Vendor Name', accessor: 'vendor' as keyof typeof invoiceData[0] },
    { header: 'PO Ref', accessor: 'poRef' as keyof typeof invoiceData[0] },
    { header: 'Grand Total', accessor: 'value' as keyof typeof invoiceData[0] },
    { header: 'Created Date', accessor: 'date' as keyof typeof invoiceData[0] },
    { header: 'Due Date', accessor: 'due' as keyof typeof invoiceData[0] },
    { 
      header: 'Risk Score', 
      accessor: (row: typeof invoiceData[0]) => {
        let style = { color: '#16a34a', fontWeight: '600' };
        if (row.risk.includes('High')) style = { color: '#dc2626', fontWeight: '600' };
        if (row.risk.includes('Medium')) style = { color: '#d97706', fontWeight: '600' };
        return <span style={style}>{row.risk}</span>;
      } 
    },
    { 
      header: 'Status', 
      accessor: (row: typeof invoiceData[0]) => {
        let className = styles.statusBadge;
        if (row.status === 'Approved' || row.status === 'Paid') className = styles.statusSuccess;
        if (row.status === 'Pending Match') className = styles.statusWarning;
        if (row.status === 'Draft') className = styles.statusDraft;
        if (row.status === 'Rejected') className = styles.statusDanger;
        if (row.status === 'Exception') className = styles.statusPurple;
        return <span className={className}>{row.status}</span>;
      } 
    },
    { 
      header: 'Actions', 
      align: 'center' as const,
      accessor: () => (
        <div className={styles.actionsCell}>
          <button className={styles.actionBtn} onClick={() => navigate('/invoices/approvals')} title="View details"><Eye size={16} /></button>
          <button className={styles.actionBtn} title="More Options"><MoreVertical size={16} /></button>
        </div>
      ) 
    },
  ];

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


      {/* KPI Cards (Interactive clickable cards) */}
      <div className={styles.kpiGrid}>
        <Card 
          className={`${styles.kpiCard} ${activeTab === 'All' ? styles.kpiCardActive : ''}`}
          onClick={() => handleKpiClick('All', 'All', 'All')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Invoices</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}><FileText size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts.All.toLocaleString()}</div>
          <div className={styles.kpiFooterGreen}>↑ 8.2% vs last month</div>
        </Card>

        <Card 
          className={`${styles.kpiCard} ${activeTab === 'Pending Match' ? styles.kpiCardActive : ''}`}
          onClick={() => handleKpiClick('Pending Match', 'Pending Match')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Pending Match</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}><Clock size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts['Pending Match'].toLocaleString()}</div>
          <div className={styles.kpiFooter}>Requires 3-Way Match</div>
        </Card>

        <Card 
          className={`${styles.kpiCard} ${activeTab === 'Exceptions' ? styles.kpiCardActive : ''}`}
          onClick={() => handleKpiClick('Exceptions', 'Exception')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Exceptions</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}><AlertTriangle size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts.Exceptions.toLocaleString()}</div>
          <div className={styles.kpiFooter}>Tax & compliance mismatches</div>
        </Card>

        <Card 
          className={`${styles.kpiCard} ${activeTab === 'Approved' ? styles.kpiCardActive : ''}`}
          onClick={() => handleKpiClick('Approved', 'Approved')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Approved Invoices</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}><CheckCircle2 size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts.Approved.toLocaleString()}</div>
          <div className={styles.kpiFooterGreen}>Ready for disbursement</div>
        </Card>

        <Card 
          className={`${styles.kpiCard} ${activeTab === 'Paid' ? styles.kpiCardActive : ''}`}
          onClick={() => handleKpiClick('Paid', 'Paid')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Paid Invoices</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#ffedd5', color: '#f97316' }}><CreditCard size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts.Paid.toLocaleString()}</div>
          <div className={styles.kpiFooter}>Settled & reconciled</div>
        </Card>
      </div>

      {/* Invoice List Embedded Card */}
      <Card className={styles.tableCard} style={{ marginTop: '24px', marginBottom: '24px' }}>
        <div className={styles.tabs}>
          <div className={`${styles.tab} ${activeTab === 'All' ? styles.activeTab : ''}`} onClick={() => handleKpiClick('All')}>
            All Invoices ({tabCounts.All})
          </div>
          <div className={`${styles.tab} ${activeTab === 'Pending Match' ? styles.activeTab : ''}`} onClick={() => handleKpiClick('Pending Match', 'Pending Match')}>
            Pending Match ({tabCounts['Pending Match']})
          </div>
          <div className={`${styles.tab} ${activeTab === 'Exceptions' ? styles.activeTab : ''}`} onClick={() => handleKpiClick('Exceptions', 'Exception')}>
            Exceptions ({tabCounts.Exceptions})
          </div>
          <div className={`${styles.tab} ${activeTab === 'Approved' ? styles.activeTab : ''}`} onClick={() => handleKpiClick('Approved', 'Approved')}>
            Approved ({tabCounts.Approved})
          </div>
          <div className={`${styles.tab} ${activeTab === 'Paid' ? styles.activeTab : ''}`} onClick={() => handleKpiClick('Paid', 'Paid')}>
            Paid ({tabCounts.Paid})
          </div>
        </div>

        <div className={styles.tableToolbar}>
          <div className={styles.filters}>
            <div className={styles.searchWrap}>
              <Input 
                placeholder="Search Invoice number, vendor..." 
                fullWidth={false} 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className={styles.searchIcon} />
            </div>
            
            <select className={styles.filterSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">Status: All</option>
              <option value="Draft">Draft</option>
              <option value="Pending Match">Pending Match</option>
              <option value="Approved">Approved</option>
              <option value="Paid">Paid</option>
              <option value="Rejected">Rejected</option>
              <option value="Exception">Exception</option>
            </select>

            <select className={styles.filterSelect} value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="All">Risk Level: All</option>
              <option value="Low Risk">Low Risk</option>
              <option value="Medium Risk">Medium Risk</option>
              <option value="High Risk">High Risk</option>
            </select>
            
            <Button variant="ghost" icon={<Filter size={16} />}>More Filters</Button>
          </div>
          
          <Button variant="outline" icon={<Download size={16} />}>Export</Button>
        </div>

        <DataTable 
          columns={columns} 
          data={filteredInvoices} 
          keyExtractor={(row) => row.id} 
        />
        
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>Showing 1 to {filteredInvoices.length} of {filteredInvoices.length} entries</span>
          <div className={styles.pageControls}>
            <button className={styles.pageBtnActive}>1</button>
            <button className={styles.pageBtnNext}>&gt;</button>
          </div>
        </div>
      </Card>

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
    </div>
  );
};
