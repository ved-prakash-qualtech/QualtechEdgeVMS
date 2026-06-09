import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Hourglass, 
  CheckCircle2, 
  Truck, 
  FileText, 
  ArrowRight,
  Plus,
  Download,
  Eye,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { DataTable } from '../../components/DataTable/DataTable';
import { getAllPOs } from '../../services/purchaseOrderService';
import type { PurchaseOrderRecord } from '../../services/purchaseOrderService';
import styles from './PODashboard.module.css';

export const PODashboard: React.FC = () => {
  const navigate = useNavigate();
  // PO List States
  const [poList, setPoList] = useState<PurchaseOrderRecord[]>([]);
  const [repoLoading, setRepoLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deliveryFilter, setDeliveryFilter] = useState('All');

  useEffect(() => {
    let active = true;
    
    // Fetch POs
    getAllPOs()
      .then(res => {
        if (active) {
          setPoList(res);
          setRepoLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load POs:', err);
        if (active) setRepoLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const tabCounts = {
    All: poList.length,
    'Pending Approval': poList.filter(po => po.status === 'Pending Approval').length,
    'Sent to Vendor': poList.filter(po => po.status === 'Sent').length,
    'Partially Received': poList.filter(po => po.deliveryStatus === 'Partial').length,
    Closed: poList.filter(po => po.status === 'Closed').length
  };

  const filteredPOs = poList.filter(po => {
    // Tab Filter
    if (activeTab === 'Pending Approval' && po.status !== 'Pending Approval') return false;
    if (activeTab === 'Sent to Vendor' && po.status !== 'Sent') return false;
    if (activeTab === 'Partially Received' && po.deliveryStatus !== 'Partial') return false;
    if (activeTab === 'Closed' && po.status !== 'Closed') return false;

    // Status Dropdown Filter
    if (statusFilter !== 'All' && po.status !== statusFilter) return false;

    // Delivery Dropdown Filter
    if (deliveryFilter !== 'All' && po.deliveryStatus !== deliveryFilter) return false;

    // Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = po.poId.toLowerCase().includes(q);
      const matchVendor = po.vendorName.toLowerCase().includes(q);
      const matchCategory = po.category.toLowerCase().includes(q);
      return matchId || matchVendor || matchCategory;
    }

    return true;
  });

  const columns = [
    { header: 'PO Number', accessor: 'poId' as keyof PurchaseOrderRecord },
    { header: 'Vendor Name', accessor: 'vendorName' as keyof PurchaseOrderRecord },
    { header: 'Category', accessor: 'category' as keyof PurchaseOrderRecord },
    { 
      header: 'PO Value', 
      accessor: (row: PurchaseOrderRecord) => `₹${row.poValue.toLocaleString('en-IN')}` 
    },
    { header: 'Created Date', accessor: 'createdDate' as keyof PurchaseOrderRecord },
    { 
      header: 'Status', 
      accessor: (row: PurchaseOrderRecord) => {
        let className = styles.statusBadge;
        if (row.status === 'Approved' || row.status === 'Sent' || row.status === 'Closed') className = styles.statusSuccess;
        if (row.status === 'Pending Approval') className = styles.statusWarning;
        if (row.status === 'Draft') className = styles.statusDraft;
        if (row.status === 'Canceled' || row.status === 'Rejected') className = styles.statusDanger;
        if (row.status === 'Sent Back') className = styles.statusWarning;
        return <span className={className}>{row.status}</span>;
      } 
    },
    { 
      header: 'Delivery', 
      accessor: (row: PurchaseOrderRecord) => {
        let className = styles.statusBadge;
        if (row.deliveryStatus === 'Received') className = styles.statusSuccess;
        if (row.deliveryStatus === 'Partial') className = styles.statusPurple;
        if (row.deliveryStatus === 'Pending') className = styles.statusWarning;
        if (row.deliveryStatus === '-') return '-';
        return <span className={className}>{row.deliveryStatus}</span>;
      } 
    },
    { 
      header: 'Actions', 
      align: 'center' as const,
      accessor: () => (
        <div className={styles.actionsCell}>
          <button className={styles.actionBtn} onClick={() => navigate('/purchase-orders/list')} title="View details"><Eye size={16} /></button>
          <button className={styles.actionBtn} title="More Options"><MoreVertical size={16} /></button>
        </div>
      ) 
    },
  ];

  if (repoLoading) {
    return (
      <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>PO Dashboard</h1>
          <p className={styles.subtitle}>Manage requisitions, purchase orders and deliveries</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.dateFilter}>
            <span>Live Data Stream (INR)</span>
          </div>
          <Button icon={<Plus size={16} />} onClick={() => navigate('/purchase-orders/create')}>Create Requisition</Button>
        </div>
      </header>

      {/* KPI Row */}
      <div className={styles.kpiGrid}>
        <Card 
          className={`${styles.kpiCard} ${activeTab === 'All' ? styles.kpiCardActive : ''}`}
          onClick={() => setActiveTab('All')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total POs</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}><ShoppingCart size={20} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts.All.toLocaleString()}</div>
          <div className={styles.kpiFooterGreen}>↑ 12.5% vs last month</div>
        </Card>
        
        <Card 
          className={`${styles.kpiCard} ${activeTab === 'Pending Approval' ? styles.kpiCardActive : ''}`}
          onClick={() => setActiveTab('Pending Approval')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Pending Approval</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}><Hourglass size={20} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts['Pending Approval'].toLocaleString()}</div>
          <div className={styles.kpiFooter}>Requires action</div>
        </Card>

        <Card 
          className={`${styles.kpiCard} ${activeTab === 'Sent to Vendor' ? styles.kpiCardActive : ''}`}
          onClick={() => setActiveTab('Sent to Vendor')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Sent to Vendor</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#f3e8ff', color: '#8b5cf6' }}><CheckCircle2 size={20} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts['Sent to Vendor'].toLocaleString()}</div>
          <div className={styles.kpiFooter}>POs sent to suppliers</div>
        </Card>

        <Card 
          className={`${styles.kpiCard} ${activeTab === 'Partially Received' ? styles.kpiCardActive : ''}`}
          onClick={() => setActiveTab('Partially Received')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Partially Received</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#dcfce7', color: '#10b981' }}><Truck size={20} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts['Partially Received'].toLocaleString()}</div>
          <div className={styles.kpiFooterGreen}>Partial delivery status</div>
        </Card>

        <Card 
          className={`${styles.kpiCard} ${activeTab === 'Closed' ? styles.kpiCardActive : ''}`}
          onClick={() => setActiveTab('Closed')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Closed POs</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#ffedd5', color: '#f97316' }}><FileText size={20} /></div>
          </div>
          <div className={styles.kpiValue}>{tabCounts.Closed.toLocaleString()}</div>
          <div className={styles.kpiFooter}>Fully completed & closed</div>
        </Card>
      </div>



      {/* PO List Embedded Section */}
      <Card className={styles.tableCard} style={{ marginTop: '24px', marginBottom: '24px' }}>
        <div className={styles.tabs}>
          <div className={`${styles.tab} ${activeTab === 'All' ? styles.activeTab : ''}`} onClick={() => setActiveTab('All')}>
            All POs ({tabCounts.All})
          </div>
          <div className={`${styles.tab} ${activeTab === 'Pending Approval' ? styles.activeTab : ''}`} onClick={() => setActiveTab('Pending Approval')}>
            Pending Approval ({tabCounts['Pending Approval']})
          </div>
          <div className={`${styles.tab} ${activeTab === 'Sent to Vendor' ? styles.activeTab : ''}`} onClick={() => setActiveTab('Sent to Vendor')}>
            Sent to Vendor ({tabCounts['Sent to Vendor']})
          </div>
          <div className={`${styles.tab} ${activeTab === 'Partially Received' ? styles.activeTab : ''}`} onClick={() => setActiveTab('Partially Received')}>
            Partially Received ({tabCounts['Partially Received']})
          </div>
          <div className={`${styles.tab} ${activeTab === 'Closed' ? styles.activeTab : ''}`} onClick={() => setActiveTab('Closed')}>
            Closed ({tabCounts.Closed})
          </div>
        </div>

        <div className={styles.tableToolbar}>
          <div className={styles.filters}>
            <div className={styles.searchWrap}>
              <Input 
                placeholder="Search PO number, vendor..." 
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
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Sent">Sent</option>
              <option value="Closed">Closed</option>
              <option value="Canceled">Canceled</option>
            </select>

            <select className={styles.filterSelect} value={deliveryFilter} onChange={(e) => setDeliveryFilter(e.target.value)}>
              <option value="All">Delivery: All</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Received">Received</option>
            </select>
            
            <Button variant="ghost" icon={<Filter size={16} />}>More Filters</Button>
          </div>
          
          <Button variant="outline" icon={<Download size={16} />}>Export</Button>
        </div>

        {repoLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
            Loading Purchase Orders Repository...
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={filteredPOs} 
            keyExtractor={(row) => row.poId} 
          />
        )}
        
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>Showing 1 to {filteredPOs.length} of {filteredPOs.length} entries</span>
          <div className={styles.pageControls}>
            <button className={styles.pageBtnActive}>1</button>
            <button className={styles.pageBtnNext}>&gt;</button>
          </div>
        </div>
      </Card>

      {/* End to End Flow Visualizer */}
      <div className={styles.flowContainer}>
        <h3 className={styles.flowTitle}>Purchase Orders – End to End Flow</h3>
        <div className={styles.flowSteps}>
          <div className={styles.flowStepActive} onClick={() => navigate('/purchase-orders/create')} style={{ cursor: 'pointer' }}>1. Create Requisition</div>
          <ArrowRight size={16} color="#cbd5e1" />
          <div className={styles.flowStep} onClick={() => navigate('/purchase-orders/approvals')} style={{ cursor: 'pointer' }}>2. PO Approval</div>
          <ArrowRight size={16} color="#cbd5e1" />
          <div className={styles.flowStep} onClick={() => navigate('/purchase-orders/list')} style={{ cursor: 'pointer' }}>3. PO Generation</div>
          <ArrowRight size={16} color="#cbd5e1" />
          <div className={styles.flowStep} onClick={() => navigate('/purchase-orders/list')} style={{ cursor: 'pointer' }}>4. PO Sent to Vendor</div>
          <ArrowRight size={16} color="#cbd5e1" />
          <div className={styles.flowStep} onClick={() => navigate('/invoices/grn')} style={{ cursor: 'pointer' }}>5. Goods Receipt (GRN)</div>
          <ArrowRight size={16} color="#cbd5e1" />
          <div className={styles.flowStep} onClick={() => navigate('/invoices/match')} style={{ cursor: 'pointer' }}>6. Invoice & 3-Way Match</div>
          <ArrowRight size={16} color="#cbd5e1" />
          <div className={styles.flowStep}>7. Payment Processing</div>
        </div>
      </div>
    </div>
  );
};
