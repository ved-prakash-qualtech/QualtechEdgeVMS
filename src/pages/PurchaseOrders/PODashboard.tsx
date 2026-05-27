import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Hourglass, 
  CheckCircle2, 
  Truck, 
  FileText, 
  IndianRupee, 
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Plus,
  Upload,
  RefreshCcw
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
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { getPODashboard } from '../../services/purchaseOrderService';
import type { DashboardStats } from '../../services/purchaseOrderService';
import styles from './PODashboard.module.css';

export const PODashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPODashboard()
      .then(res => {
        if (active) {
          setStats(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load dashboard metrics:', err);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading || !stats) {
    return (
      <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>Loading Dashboard Metrics...</p>
      </div>
    );
  }

  const { kpis, statusData, categoryData, trendData, topVendors, approvalQueue, aiInsights } = stats;

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
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total POs</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}><ShoppingCart size={20} /></div>
          </div>
          <div className={styles.kpiValue}>{kpis.totalPOs.toLocaleString()}</div>
          <div className={styles.kpiFooterGreen}>↑ 12.5% vs last month</div>
        </Card>
        
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>POs in Progress</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}><Hourglass size={20} /></div>
          </div>
          <div className={styles.kpiValue}>{kpis.posInProgress.toLocaleString()}</div>
          <div className={styles.kpiFooterGreen}>↑ 8.4% vs last month</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Awaiting Approval</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#f3e8ff', color: '#8b5cf6' }}><CheckCircle2 size={20} /></div>
          </div>
          <div className={styles.kpiValue}>{kpis.awaitingApproval.toLocaleString()}</div>
          <div className={styles.kpiFooter} style={{ color: 'var(--color-primary)', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/purchase-orders/approvals')}>Requires action</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Goods Received</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#dcfce7', color: '#10b981' }}><Truck size={20} /></div>
          </div>
          <div className={styles.kpiValue}>{kpis.goodsReceived.toLocaleString()}</div>
          <div className={styles.kpiFooterGreen}>↑ 15.6% vs last month</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Pending Invoices</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#ffedd5', color: '#f97316' }}><FileText size={20} /></div>
          </div>
          <div className={styles.kpiValue}>{kpis.pendingInvoices.toLocaleString()}</div>
          <div className={styles.kpiFooter} style={{ color: 'var(--color-warning-text)', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/purchase-orders/match')}>Requires action</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>PO Value (This Month)</span>
            <div className={styles.kpiIcon} style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}><IndianRupee size={20} /></div>
          </div>
          <div className={styles.kpiValue}>₹ {kpis.poValueThisMonth} Cr</div>
          <div className={styles.kpiFooterGreen}>↑ 18.7% vs last month</div>
        </Card>
      </div>

      <div className={styles.chartGrid}>
        {/* Status Donut */}
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>PO Status Overview</h3>
          <div className={styles.pieWrapper}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.pieCenter}>
              <span>{kpis.totalPOs}</span>
              <p>Total POs</p>
            </div>
          </div>
          <div className={styles.legendGrid}>
            {statusData.map(item => (
              <div key={item.name} className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: item.color }}></span>
                <span className={styles.legendName}>{item.name}</span>
                <span className={styles.legendVal}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Spend by Category */}
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>PO Value by Category (₹ Cr)</h3>
          <div style={{ height: '280px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="value" fill="#1d4ed8" radius={[4, 4, 0, 0]} barSize={24}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#1d4ed8' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* POs Over Time */}
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>POs Over Time</h3>
          <div className={styles.chartLegendTop}>
            <span className={styles.legendDotCurrent}>This Year</span>
            <span className={styles.legendDotLast}>Last Year</span>
          </div>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="thisYear" stroke="#1d4ed8" strokeWidth={3} dot={{ r: 4, fill: '#1d4ed8' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="lastYear" stroke="#93c5fd" strokeWidth={3} dot={{ r: 4, fill: '#93c5fd' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Vendors */}
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>Top Vendors by PO Value (₹ Cr)</h3>
          <div className={styles.vendorList}>
            {topVendors.map(vendor => (
              <div key={vendor.name} className={styles.vendorItem}>
                <div className={styles.vendorInfo}>
                  <span className={styles.vendorName}>{vendor.name}</span>
                  <span className={styles.vendorVal}>{vendor.value}</span>
                </div>
                <div className={styles.vendorBarBg}>
                  <div className={styles.vendorBarFill} style={{ width: vendor.width }}></div>
                </div>
              </div>
            ))}
          </div>
          <button className={styles.viewAllBtn} onClick={() => navigate('/purchase-orders/list')}>View All Vendors</button>
        </Card>
      </div>

      <div className={styles.bottomGrid}>
        {/* Quick Actions */}
        <Card className={styles.quickCard}>
          <h3 className={styles.sectionTitle}>Quick Actions</h3>
          <div className={styles.actionRow}>
            <button className={styles.actionBtn} onClick={() => navigate('/purchase-orders/create')}>
              <div className={styles.iconBox}><Plus size={20} /></div>
              <span>Create Requisition</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/purchase-orders/create')}>
              <div className={styles.iconBox}><ShoppingCart size={20} /></div>
              <span>Create PO</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/purchase-orders/grn')}>
              <div className={styles.iconBox}><Upload size={20} /></div>
              <span>Goods Receipt (GRN)</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/contracts/repository')}>
              <div className={styles.iconBox}><FileText size={20} /></div>
              <span>PO from Contract</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/purchase-orders/list')}>
              <div className={styles.iconBox}><Truck size={20} /></div>
              <span>Track PO</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/purchase-orders/match')}>
              <div className={styles.iconBox}><RefreshCcw size={20} /></div>
              <span>3-Way Match</span>
            </button>
          </div>
        </Card>

        {/* Approval Queue */}
        <Card className={styles.queueCard}>
          <h3 className={styles.sectionTitle}>Approval Queue</h3>
          <div className={styles.queueList}>
            {approvalQueue.map(item => (
              <div key={item.type} className={styles.queueItem} style={{ cursor: 'pointer' }} onClick={() => {
                if (item.type === "PO Approval") navigate('/purchase-orders/approvals');
                else if (item.type === "GRN Approval") navigate('/purchase-orders/grn');
                else if (item.type === "Payment Approval") navigate('/purchase-orders/match');
              }}>
                <div className={styles.queueLabel}>
                  {item.type === "PO Approval" && <CheckCircle2 size={16} color={item.color} />}
                  {item.type === "PO Amendment" && <FileText size={16} color={item.color} />}
                  {item.type === "GRN Approval" && <Truck size={16} color={item.color} />}
                  {item.type === "Payment Approval" && <IndianRupee size={16} color={item.color} />}
                  <span>{item.type}</span>
                </div>
                <div className={styles.queueVal}>
                  <span className={styles.queueNum}>{String(item.count).padStart(2, '0')}</span>
                  <ArrowRight size={14} color="#94a3b8" />
                </div>
              </div>
            ))}
          </div>
          <button className={styles.viewAllBtnQueue} onClick={() => navigate('/purchase-orders/approvals')}>View All</button>
        </Card>

        {/* AI Insights */}
        <Card className={styles.aiCard}>
          <h3 className={styles.sectionTitle}>AI Insights</h3>
          <div className={styles.aiList}>
            {aiInsights.map((insight, idx) => (
              <div key={idx} className={styles.aiItem}>
                {insight.type === 'warning' && <AlertTriangle size={16} color="#f59e0b" className={styles.aiItemIcon} />}
                {insight.type === 'danger' && <AlertTriangle size={16} color="#ef4444" className={styles.aiItemIcon} />}
                {insight.type === 'info' && <TrendingUp size={16} color="#3b82f6" className={styles.aiItemIcon} />}
                {insight.type === 'success' && <CheckCircle2 size={16} color="#10b981" className={styles.aiItemIcon} />}
                <p>{insight.text}</p>
                <button onClick={() => {
                  if (insight.text.includes('delay') || insight.text.includes('limit')) navigate('/purchase-orders/list');
                  else if (insight.text.includes('duplicate')) navigate('/purchase-orders/approvals');
                }}>View Details</button>
              </div>
            ))}
          </div>
        </Card>
      </div>

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
          <div className={styles.flowStep} onClick={() => navigate('/purchase-orders/grn')} style={{ cursor: 'pointer' }}>5. Goods Receipt (GRN)</div>
          <ArrowRight size={16} color="#cbd5e1" />
          <div className={styles.flowStep} onClick={() => navigate('/purchase-orders/match')} style={{ cursor: 'pointer' }}>6. Invoice & 3-Way Match</div>
          <ArrowRight size={16} color="#cbd5e1" />
          <div className={styles.flowStep}>7. Payment Processing</div>
        </div>
      </div>
    </div>
  );
};
