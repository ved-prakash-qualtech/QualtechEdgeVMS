import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  RefreshCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  FileText,
  ShieldAlert,
  Eye,
  Download,
  MoreVertical
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { Badge } from '../../components/Badge/Badge';
import { DataTable } from '../../components/DataTable/DataTable';
import styles from './KycDashboard.module.css';

// Mock Data for KYC
const kycData = [
  { id: 'VND-0001248', name: 'TECH SOLUTIONS PVT LTD', category: 'IT Services', risk: 'Low', status: 'Pending', lastVerified: '-', reKyc: '-' },
  { id: 'VND-0001247', name: 'ABC FACILITY SERVICES', category: 'Facility Management', risk: 'Medium', status: 'In Progress', lastVerified: '20 Apr 2025', reKyc: '20 Apr 2026' },
  { id: 'VND-0001246', name: 'XYZ INFRASTRUCTURE LTD', category: 'Infrastructure', risk: 'High', status: 'Pending', lastVerified: '-', reKyc: '-' },
  { id: 'VND-0001245', name: 'GLOBAL SECURITY SERVICES', category: 'Security', risk: 'Medium', status: 'Pending', lastVerified: '-', reKyc: '-' },
  { id: 'VND-0001244', name: 'FINCONS CONSULTING LLP', category: 'Consulting', risk: 'Low', status: 'Verified', lastVerified: '05 May 2025', reKyc: '05 May 2026' },
];

const kycOverview = [
  { name: 'Verified', value: 1073, color: '#16A34A' },
  { name: 'Pending', value: 76, color: '#F59E0B' },
  { name: 'In Progress', value: 45, color: '#0EA5E9' },
  { name: 'High Risk', value: 18, color: '#DC2626' },
  { name: 'Re-KYC Due', value: 32, color: '#9333EA' },
];

export const KycDashboard: React.FC = () => {
  const navigate = useNavigate();

  const columns = [
    { header: 'Vendor Code', accessor: 'id' as keyof typeof kycData[0] },
    { header: 'Vendor Name', accessor: 'name' as keyof typeof kycData[0] },
    { header: 'Category', accessor: 'category' as keyof typeof kycData[0] },
    { 
      header: 'Risk Level', 
      accessor: (row: any) => {
        let variant: 'success' | 'warning' | 'danger' | 'info' = 'info';
        if (row.risk === 'Low') variant = 'success';
        if (row.risk === 'Medium') variant = 'warning';
        if (row.risk === 'High' || row.risk === 'Critical') variant = 'danger';
        return <Badge variant={variant}>{row.risk}</Badge>;
      } 
    },
    { 
      header: 'KYC Status', 
      accessor: (row: any) => {
        let className = styles.statusText;
        if (row.status === 'Verified') className = styles.statusVerified;
        if (row.status === 'Pending') className = styles.statusPending;
        if (row.status === 'In Progress') className = styles.statusInProgress;
        return <span className={className}>{row.status}</span>;
      } 
    },
    { header: 'Last Verified On', accessor: 'lastVerified' as keyof typeof kycData[0] },
    { header: 'Re-KYC Due On', accessor: 'reKyc' as keyof typeof kycData[0] },
    { 
      header: 'Actions', 
      align: 'center' as const,
      accessor: (row: any) => (
        <div className={styles.actionsCell}>
          <button className={styles.actionBtn} onClick={() => navigate(`/kyc/${row.id}`)}>
            <Eye size={16} />
          </button>
          <button className={styles.actionBtn}><MoreVertical size={16} /></button>
        </div>
      ) 
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>KYC Verification</h1>
          <p className={styles.breadcrumbs}>Perform due diligence and verify vendor information</p>
        </div>
      </header>

      <div className={styles.kpiGrid}>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Vendors</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
              <Users size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>1,248</div>
          <div className={styles.kpiFooter}>↑ 12.5% vs last month</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Pending KYC</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className={styles.kpiValue} style={{ color: '#f59e0b' }}>76</div>
          <div className={styles.kpiFooter}>Requires action</div>
        </Card>
        
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>In Progress</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>
              <RefreshCcw size={20} />
            </div>
          </div>
          <div className={styles.kpiValue} style={{ color: '#0ea5e9' }}>45</div>
          <div className={styles.kpiFooter}>In verification</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>KYC Verified</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className={styles.kpiValue} style={{ color: '#16a34a' }}>1,073</div>
          <div className={styles.kpiFooter}>This year</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>High Risk</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className={styles.kpiValue} style={{ color: '#dc2626' }}>18</div>
          <div className={styles.kpiFooter}>Requires review</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Re-KYC Due</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div className={styles.kpiValue} style={{ color: '#9333ea' }}>32</div>
          <div className={styles.kpiFooter}>Next 30 days</div>
        </Card>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.tableSection}>
          <Card className={styles.tableCard}>
            <div className={styles.tabs}>
              <div className={`${styles.tab} ${styles.activeTab}`}>Pending (76)</div>
              <div className={styles.tab}>In Progress (45)</div>
              <div className={styles.tab}>Verified (1,073)</div>
              <div className={styles.tab}>High Risk (18)</div>
              <div className={styles.tab}>Re-KYC Due (32)</div>
            </div>

            <div className={styles.tableToolbar}>
              <div className={styles.filters}>
                <div className={styles.searchWrap}>
                  <Input 
                    placeholder="Search vendor name, code, PAN..." 
                    fullWidth={false} 
                    className={styles.searchInput}
                  />
                </div>
                
                <select className={styles.filterSelect}>
                  <option>Risk Level: All</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>

                <select className={styles.filterSelect}>
                  <option>KYC Status: All</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                </select>
              </div>
              
              <Button variant="outline" icon={<Download size={16} />}>
                Export
              </Button>
            </div>

            <DataTable 
              columns={columns} 
              data={kycData} 
              keyExtractor={(row) => row.id} 
            />
            
            <div className={styles.pagination}>
              <span className={styles.pageInfo}>Showing 1 to 5 of 76 entries</span>
              <div className={styles.pageControls}>
                <button className={styles.pageBtnActive}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <span>...</span>
                <button className={styles.pageBtn}>16</button>
                <button className={styles.pageBtnNext}>&gt;</button>
              </div>
            </div>
          </Card>
        </div>

        <div className={styles.sideSection}>
          <Card className={styles.chartCard}>
            <h3 className={styles.sectionTitle}>KYC Verification Overview</h3>
            <div className={styles.pieContainer}>
              <div className={styles.pieChartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={kycOverview}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {kycOverview.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.pieCenterText}>
                  <span>1,248</span>
                  <p>Total</p>
                </div>
              </div>
              <div className={styles.pieLegend}>
                {kycOverview.map((item) => (
                  <div key={item.name} className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: item.color }}></div>
                    <span className={styles.legendLabel}>{item.name}</span>
                    <span className={styles.legendValue}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className={styles.actionsCard}>
            <h3 className={styles.sectionTitle}>Quick Actions</h3>
            <div className={styles.actionGrid}>
              <div className={styles.quickActionBox}>
                <div className={styles.qaIcon}><Users size={20} color="#1d4ed8" /></div>
                <div>
                  <h4>Bulk KYC Verification</h4>
                  <p>Verify multiple vendors</p>
                </div>
              </div>
              
              <div className={styles.quickActionBox}>
                <div className={styles.qaIcon}><Calendar size={20} color="#1d4ed8" /></div>
                <div>
                  <h4>Schedule Re-KYC</h4>
                  <p>Set re-kyc reminders</p>
                </div>
              </div>

              <div className={styles.quickActionBox}>
                <div className={styles.qaIcon}><FileText size={20} color="#1d4ed8" /></div>
                <div>
                  <h4>Download KYC Report</h4>
                  <p>Export verification report</p>
                </div>
              </div>

              <div className={styles.quickActionBox}>
                <div className={styles.qaIcon}><ShieldAlert size={20} color="#1d4ed8" /></div>
                <div>
                  <h4>Sanctions Screening</h4>
                  <p>Check against sanctions</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
