import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Download, 
  AlertOctagon, 
  Layers, 
  FileSpreadsheet, 
  Info,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './ComplianceDashboard.module.css';

interface OutsourcingVendor {
  id: string;
  name: string;
  activityType: string;
  materiality: 'Material' | 'Non-Material';
  boardApprovalDate: string;
  lastAuditDate: string;
  riskRating: 'High' | 'Medium' | 'Low';
  concentrationPercentage: number;
  rbiStatus: 'Approved' | 'Review Pending' | 'Non-Compliant';
}

const OUTSOURCING_REGISTER: OutsourcingVendor[] = [
  { id: 'VND-001', name: 'ABC Infotech Pvt Ltd', activityType: 'Core Banking hosting & cloud infrastructure', materiality: 'Material', boardApprovalDate: '12 Jan 2025', lastAuditDate: '04 Mar 2026', riskRating: 'High', concentrationPercentage: 28.5, rbiStatus: 'Approved' },
  { id: 'VND-002', name: 'Tech Solutions Ltd', activityType: 'Application development & production support', materiality: 'Material', boardApprovalDate: '20 Feb 2025', lastAuditDate: '15 Apr 2026', riskRating: 'Medium', concentrationPercentage: 18.2, rbiStatus: 'Approved' },
  { id: 'VND-004', name: 'Global Logistics Ltd', activityType: 'Cash replenishment & physical vaulting logistics', materiality: 'Material', boardApprovalDate: '08 Mar 2025', lastAuditDate: '10 May 2026', riskRating: 'High', concentrationPercentage: 12.4, rbiStatus: 'Review Pending' },
  { id: 'VND-006', name: 'Secure Guards India', activityType: 'Physical branch security guards management', materiality: 'Non-Material', boardApprovalDate: 'N/A', lastAuditDate: '18 Nov 2025', riskRating: 'Low', concentrationPercentage: 4.5, rbiStatus: 'Approved' },
  { id: 'VND-007', name: 'BPO India Services', activityType: 'Customer service call center outsourcing', materiality: 'Material', boardApprovalDate: '15 May 2025', lastAuditDate: '22 Apr 2026', riskRating: 'Medium', concentrationPercentage: 21.0, rbiStatus: 'Approved' }
];

const COMPLIANCE_ITEMS = [
  { id: 'REG-101', name: 'RBI Outsourcing Policy Board Approval', status: 'Compliant', type: 'RBI Circular', lastCheck: '24 Apr 2026' },
  { id: 'REG-102', name: 'Materiality Assessment Document Register', status: 'Compliant', type: 'RBI Circular', lastCheck: '12 May 2026' },
  { id: 'REG-103', name: 'DPDP Act (2023) Consent Architecture', status: 'In Review', type: 'DPDP Compliance', lastCheck: '20 May 2026' },
  { id: 'REG-104', name: 'Vendor Security Assessment (SOC2/ISO)', status: 'Action Required', type: 'Data Security', lastCheck: '18 May 2026' },
  { id: 'REG-105', name: 'Four-Eye Audit Trail Logs Backup', status: 'Compliant', type: 'Internal Audit', lastCheck: '21 May 2026' }
];

const CONCENTRATION_DATA = [
  { name: 'ABC Infotech (Cloud)', value: 28.5 },
  { name: 'BPO India (Call Center)', value: 21.0 },
  { name: 'Tech Solutions (Dev)', value: 18.2 },
  { name: 'Global Logistics (Vault)', value: 12.4 },
  { name: 'Others (Non-Material)', value: 19.9 }
];

const COLORS = ['#1D4ED8', '#3B82F6', '#60A5FA', '#93C5FD', '#CBD5E1'];

export const ComplianceDashboard: React.FC = () => {
  const [vendors] = useState<OutsourcingVendor[]>(OUTSOURCING_REGISTER);
  const [complianceList] = useState(COMPLIANCE_ITEMS);
  const [filterType, setFilterType] = useState<'All' | 'Material' | 'High-Risk'>('All');

  const handleDownloadEvidence = (vendorName: string) => {
    alert(`Generating Compliance Package for ${vendorName}.\nIncludes:\n- Board approval minutes\n- SOC2 Certificate\n- MCA21 compliance history\n- Risk Assessment report`);
  };

  const filteredVendors = vendors.filter(v => {
    if (filterType === 'Material') return v.materiality === 'Material';
    if (filterType === 'High-Risk') return v.riskRating === 'High';
    return true;
  });

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>COMPLIANCE & REGULATORY AUDIT CENTRE</h1>
          <p className={styles.breadcrumbs}>Home / Compliance / Compliance Dashboard</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" icon={<FileSpreadsheet size={16} />} onClick={() => alert("Downloading RBI Outsourcing Policy Register in Excel (RBI Annexure II format)...")}>
            Export RBI Register
          </Button>
          <Button variant="primary" icon={<ShieldCheck size={16} />} onClick={() => alert("Running Automated KYC Risk assessment on all vendor nodes...")}>
            Run Audit Scan
          </Button>
        </div>
      </header>

      {/* KPI Cards Section */}
      <div className={styles.kpiGrid}>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>RBI Material Vendors</span>
              <div className={styles.kpiValue} style={{ color: '#071B3B' }}>4 / 5 Vendors</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
              <Layers size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend}><Info size={12} /> Undergoing active RBI monitoring</span>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>Compliance Index</span>
              <div className={styles.kpiValue} style={{ color: '#16a34a' }}>94.2% Audit Ready</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <ShieldCheck size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend} style={{ color: '#16a34a' }}>DPDP Act aligned</span>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>Pending Audit Scans</span>
              <div className={styles.kpiValue} style={{ color: '#f59e0b' }}>1 Review Required</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
              <AlertOctagon size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend} style={{ color: '#b45309' }}>Global Logistics audit expiring soon</span>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>Concentration Index</span>
              <div className={styles.kpiValue} style={{ color: '#dc2626' }}>28.5% Max Single</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
              <ShieldAlert size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend} style={{ color: '#b91c1c' }}><AlertTriangle size={12} /> High cloud provider concentration</span>
        </Card>
      </div>

      <div className={styles.layoutGrid}>
        {/* Compliance checklist and Concentration Pie */}
        <div className={styles.leftCol}>
          <Card className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Regulatory Checklists</span>
            </div>
            <div className={styles.regulatoryList}>
              {complianceList.map(item => (
                <div key={item.id} className={styles.regRow}>
                  <div className={styles.regInfo}>
                    <span className={styles.regName}>{item.name}</span>
                    <span className={styles.regType}>{item.id} • {item.type}</span>
                  </div>
                  <div className={styles.regBadge}>
                    <Badge variant={item.status === 'Compliant' ? 'success' : item.status === 'In Review' ? 'warning' : 'danger'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className={styles.card} style={{ marginTop: '20px' }}>
            <div className={styles.cardTitle}>
              <span>Spend & Risk Concentration</span>
            </div>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={CONCENTRATION_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CONCENTRATION_DATA.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.chartLegend}>
                {CONCENTRATION_DATA.map((entry, index) => (
                  <div key={entry.name} className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className={styles.legendText}>{entry.name} ({entry.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* RBI Outsourcing Register list */}
        <div className={styles.rightCol}>
          <Card className={styles.card}>
            <div className={styles.cardTitleHeader}>
              <div className={styles.cardTitle}>
                <span>RBI Core Outsourcing Register</span>
              </div>
              <div className={styles.filterBtns}>
                <button 
                  className={`${styles.filterBtn} ${filterType === 'All' ? styles.filterBtnActive : ''}`} 
                  onClick={() => setFilterType('All')}
                >
                  All
                </button>
                <button 
                  className={`${styles.filterBtn} ${filterType === 'Material' ? styles.filterBtnActive : ''}`} 
                  onClick={() => setFilterType('Material')}
                >
                  Material
                </button>
                <button 
                  className={`${styles.filterBtn} ${filterType === 'High-Risk' ? styles.filterBtnActive : ''}`} 
                  onClick={() => setFilterType('High-Risk')}
                >
                  High-Risk
                </button>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Activity Type</th>
                    <th>Materiality</th>
                    <th>Board Appr.</th>
                    <th>Last Audit</th>
                    <th>Concentration</th>
                    <th>RBI Audit Status</th>
                    <th>Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map(vendor => (
                    <tr key={vendor.id}>
                      <td>
                        <div>
                          <strong className={styles.vendorNameText}>{vendor.name}</strong>
                          <div className={styles.vendorIdText}>{vendor.id}</div>
                        </div>
                      </td>
                      <td><span className={styles.activityText}>{vendor.activityType}</span></td>
                      <td>
                        <Badge variant={vendor.materiality === 'Material' ? 'danger' : 'default'}>
                          {vendor.materiality}
                        </Badge>
                      </td>
                      <td>{vendor.boardApprovalDate}</td>
                      <td>{vendor.lastAuditDate}</td>
                      <td>
                        <div>
                          <div className={styles.progressLabel}>{vendor.concentrationPercentage}%</div>
                          <div className={styles.progressBarBg}>
                            <div 
                              className={styles.progressBar} 
                              style={{ 
                                width: `${vendor.concentrationPercentage}%`,
                                backgroundColor: vendor.concentrationPercentage >= 25 ? 'var(--color-danger)' : 'var(--color-primary)'
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge variant={vendor.rbiStatus === 'Approved' ? 'success' : vendor.rbiStatus === 'Review Pending' ? 'warning' : 'danger'}>
                          {vendor.rbiStatus}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          icon={<Download size={14} />} 
                          onClick={() => handleDownloadEvidence(vendor.name)}
                        >
                          Evidence Pack
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
