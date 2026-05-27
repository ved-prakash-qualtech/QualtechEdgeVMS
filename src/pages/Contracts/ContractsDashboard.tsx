import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCcw, 
  ShieldAlert, 
  Plus, 
  UploadCloud, 
  FileSignature, 
  Calendar 
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import { DataTable } from '../../components/DataTable/DataTable';
import { getContractDashboard, getRenewalContracts } from '../../services/contractService';
import type { DashboardStats, RenewalRecord } from '../../services/contractService';
import styles from './ContractsDashboard.module.css';

export const ContractsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [renewals, setRenewals] = useState<RenewalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const dashboardStats = await getContractDashboard();
        setStats(dashboardStats);
        
        const renewalsList = await getRenewalContracts();
        setRenewals(renewalsList);
      } catch (err) {
        console.error('Failed to load contract dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const renewalColumns = [
    { header: 'Vendor Name', accessor: 'vendorName' as keyof RenewalRecord },
    { header: 'Contract Type', accessor: 'contractType' as keyof RenewalRecord },
    { header: 'Renewal Date', accessor: 'expiryDate' as keyof RenewalRecord },
    { header: 'Owner', accessor: 'owner' as keyof RenewalRecord },
    { 
      header: 'Status', 
      accessor: (row: any) => {
        let variant: 'success' | 'warning' | 'info' | 'default' = 'default';
        if (row.status === 'Auto-Renew') variant = 'success';
        if (row.status === 'In Review') variant = 'warning';
        if (row.status === 'Pending') variant = 'info';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    },
  ];

  if (loading || !stats) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        Loading dashboard metrics...
      </div>
    );
  }

  // Calculate needle rotation based on portfolio risk
  const getNeedleRotation = (risk: string) => {
    if (risk === 'Low') return -45;
    if (risk === 'High') return 45;
    return 0; // Medium
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'Low') return '#10b981';
    if (risk === 'High') return '#ef4444';
    return '#f59e0b'; // Medium
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Contracts Dashboard</h1>
          <p className={styles.breadcrumbs}>Home / Contracts / Dashboard</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" icon={<UploadCloud size={16} />} onClick={() => navigate('/contracts/create')}>Import Contract</Button>
          <Button icon={<Plus size={16} />} onClick={() => navigate('/contracts/create')}>Create Contract</Button>
        </div>
      </header>

      {/* KPI Row */}
      <div className={styles.kpiGrid}>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Active Contracts</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
              <FileText size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{stats.totalActiveContracts}</div>
          <div className={styles.kpiFooter}>↑ 5.2% vs last quarter</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Expiring Soon (30d)</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className={styles.kpiValue} style={{ color: '#d97706' }}>{stats.expiringSoon}</div>
          <div className={styles.kpiFooter}>Requires renewal action</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Pending Legal Reviews</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
              <FileSignature size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{stats.pendingLegalReviews}</div>
          <div className={styles.kpiFooter}>Avg TAT: 3.2 Days</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>SLA Breaches</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
              <AlertCircle size={20} />
            </div>
          </div>
          <div className={styles.kpiValue} style={{ color: '#b91c1c' }}>{stats.slaBreaches}</div>
          <div className={styles.kpiFooter}>Penalty triggered: 3</div>
        </Card>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          <div className={styles.chartRow}>
            {/* Lifecycle Donut */}
            <Card className={styles.chartCard}>
              <h3 className={styles.sectionTitle}>Lifecycle Distribution</h3>
              <div className={styles.pieContainer}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={stats.lifecycleDistribution}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {stats.lifecycleDistribution.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.pieLegend}>
                  {stats.lifecycleDistribution.map(item => (
                    <div key={item.name} className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ backgroundColor: item.color }}></span>
                      <span className={styles.legendName}>{item.name}</span>
                      <span className={styles.legendVal}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Spend Bar Chart */}
            <Card className={styles.chartCard}>
              <h3 className={styles.sectionTitle}>Contract Value by Category (Cr)</h3>
              <div className={styles.barContainer}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.contractValueByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Bar dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h3 className={styles.sectionTitle}>Upcoming Renewals</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/contracts/renewals')}>View All</Button>
            </div>
            <DataTable 
              columns={renewalColumns}
              data={renewals}
              keyExtractor={(item) => item.contractId}
            />
          </Card>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          {/* AI Risk Widget */}
          <Card className={styles.riskCard}>
            <div className={styles.riskHeader}>
              <ShieldAlert size={20} className={styles.riskIcon} />
              <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>AI Risk Insights</h3>
            </div>
            
            <div className={styles.gaugeContainer}>
               <div className={styles.gauge}>
                 <div className={styles.gaugeArc}></div>
                 <div className={styles.gaugeNeedle} style={{ transform: `translateX(-50%) rotate(${getNeedleRotation(stats.portfolioRisk)}deg)` }}></div>
               </div>
               <div className={styles.gaugeScore}>
                 <span className={styles.scoreLabel}>Portfolio Risk</span>
                 <span className={styles.scoreValue} style={{ color: getRiskColor(stats.portfolioRisk) }}>{stats.portfolioRisk}</span>
               </div>
            </div>

            <div className={styles.riskList}>
              <div className={styles.riskItem}>
                <div className={styles.riskLabel}>Legal Exposure ({stats.legalExposure || 58}%)</div>
                <div className={styles.riskBar}><div className={styles.riskFill} style={{ width: `${stats.legalExposure || 58}%`, backgroundColor: '#f59e0b' }}></div></div>
              </div>
              <div className={styles.riskItem}>
                <div className={styles.riskLabel}>Compliance Risk ({stats.complianceRisk || 22}%)</div>
                <div className={styles.riskBar}><div className={styles.riskFill} style={{ width: `${stats.complianceRisk || 22}%`, backgroundColor: '#10b981' }}></div></div>
              </div>
              <div className={styles.riskItem}>
                <div className={styles.riskLabel}>Financial Risk ({stats.financialRisk || 74}%)</div>
                <div className={styles.riskBar}><div className={styles.riskFill} style={{ width: `${stats.financialRisk || 74}%`, backgroundColor: '#ef4444' }}></div></div>
              </div>
            </div>
            
            <div className={styles.aiSuggestion}>
              <div className={styles.aiBadge}>AI Copilot</div>
              <p>Consider renegotiating payment terms with <strong>ABC Facility Services</strong>. Current penalty clauses are non-standard.</p>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className={styles.actionsCard}>
            <h3 className={styles.sectionTitle}>Quick Actions</h3>
            <div className={styles.actionGrid}>
              <button className={styles.actionBtn} onClick={() => navigate('/contracts/create')}>
                <div className={styles.actionIcon}><FileSignature size={18} /></div>
                <span>Generate NDA</span>
              </button>
              <button className={styles.actionBtn} onClick={() => navigate('/contracts/renewals')}>
                <div className={styles.actionIcon}><RefreshCcw size={18} /></div>
                <span>Renew Contract</span>
              </button>
              <button className={styles.actionBtn} onClick={() => navigate('/contracts/renewals')}>
                <div className={styles.actionIcon}><Calendar size={18} /></div>
                <span>Expiry Calendar</span>
              </button>
              <button className={styles.actionBtn} onClick={() => navigate('/contracts/approvals')}>
                <div className={styles.actionIcon}><CheckCircle2 size={18} /></div>
                <span>Pending Approvals</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
