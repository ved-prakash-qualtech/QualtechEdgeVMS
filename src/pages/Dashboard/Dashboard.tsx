import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserCheck, 
  ShieldAlert, 
  TrendingUp,
  Receipt,
  FileText,
  Calendar,
  FileSignature,
  DollarSign,
  ArrowRight,
  UserPlus
} from 'lucide-react';

import { Card } from '../../components/Card/Card';
import styles from './Dashboard.module.css';

// Mock Data

const recentActivity = [
  { id: 1, title: 'New vendor "XYZ Infra Pvt Ltd" onboarded', time: '12 May 2026, 11:30 AM', status: 'Onboarded', icon: 'UserPlus' },
  { id: 2, title: 'Contract with "Tech Solutions Pvt Ltd" approved', time: '12 May 2026, 10:45 AM', status: 'Approved', icon: 'FileSignature' },
  { id: 3, title: 'Invoice INV-2026-0487 matched successfully', time: '12 May 2026, 10:20 AM', status: 'Invoice Matched', icon: 'Receipt' },
  { id: 4, title: 'Payment of ₹ 12.45 Lakh released to ABC Services', time: '12 May 2026, 09:15 AM', status: 'Payment Released', icon: 'DollarSign' },
];

const approvalQueue = [
  { id: 1, name: 'Vendor Approval', count: 12, icon: 'UserCheck', color: '#1D4ED8' },
  { id: 2, name: 'KYC Approval', count: 8, icon: 'ShieldAlert', color: '#16A34A' },
  { id: 3, name: 'PO Approval', count: 24, icon: 'FileText', color: '#F59E0B' },
  { id: 4, name: 'Invoice Approval', count: 19, icon: 'Receipt', color: '#9333EA' },
  { id: 5, name: 'Contract Approval', count: 6, icon: 'FileSignature', color: '#DC2626' },
];

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.kpiGrid}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ height: 100, borderRadius: 12, padding: 16, background: 'var(--color-surface)', border: '1px solid var(--color-border)', display: 'flex', gap: 14 }}>
              <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 10, width: '60%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 24, width: '40%' }} />
              </div>
            </div>
          ))}
        </div>

      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, Saurabh Anand! 👋</h1>
          <p className={styles.subtitle}>Here's what's happening with your vendor ecosystem.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.dateSelector}>
            <Calendar size={16} />
            <span>12 May 2026 - 18 May 2026</span>
          </div>
        </div>
      </header>

      {/* KPI Cards Row (6 Cards) */}
      <div className={styles.kpiGrid}>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Vendors</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
              <Users size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>1,248</div>
          <div className={styles.kpiFooter}>
            <span className={styles.trendUp}><TrendingUp size={14} /> 12.5%</span> vs last month
          </div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Active Vendors</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <UserCheck size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>1,035</div>
          <div className={styles.kpiFooter}>
            <span className={styles.trendUp}><TrendingUp size={14} /> 8.4%</span> vs last month
          </div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Pending KYC</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
              <ShieldAlert size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>76</div>
          <div className={styles.kpiFooter}>
            <span className={styles.neutralText}>Requires Action</span>
          </div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Contracts Expiring</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
              <FileSignature size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>18</div>
          <div className={styles.kpiFooter}>
            <span className={styles.neutralText}>In next 30 days</span>
          </div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Invoices Pending</span>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>
              <Receipt size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>₹ 2.45 Cr</div>
          <div className={styles.kpiFooter}>
            <span className={styles.neutralText}>Due in next 7 days</span>
          </div>
        </Card>
      </div>


      {/* Bottom Widgets Row */}
      <div className={styles.widgetsGrid}>
        
        {/* Invoice Aging */}
        <Card className={styles.widgetCard}>
          <div className={styles.chartHeader}>
            <h3>Invoice Aging</h3>
          </div>
          <div className={styles.agingGrid}>
            <div className={styles.agingItem}>
              <span className={styles.agingLabel} style={{color: '#16a34a'}}>0 - 30 Days</span>
              <span className={styles.agingValue}>₹ 1.15 Cr</span>
              <span className={styles.agingPercent}>42%</span>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '42%', backgroundColor: '#16a34a'}}></div></div>
            </div>
            <div className={styles.agingItem}>
              <span className={styles.agingLabel} style={{color: '#f59e0b'}}>31 - 60 Days</span>
              <span className={styles.agingValue}>₹ 0.85 Cr</span>
              <span className={styles.agingPercent}>31%</span>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '31%', backgroundColor: '#f59e0b'}}></div></div>
            </div>
            <div className={styles.agingItem}>
              <span className={styles.agingLabel} style={{color: '#ea580c'}}>61 - 90 Days</span>
              <span className={styles.agingValue}>₹ 0.28 Cr</span>
              <span className={styles.agingPercent}>10%</span>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '10%', backgroundColor: '#ea580c'}}></div></div>
            </div>
            <div className={styles.agingItem}>
              <span className={styles.agingLabel} style={{color: '#dc2626'}}>90+ Days</span>
              <span className={styles.agingValue}>₹ 0.17 Cr</span>
              <span className={styles.agingPercent}>6%</span>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '6%', backgroundColor: '#dc2626'}}></div></div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className={styles.widgetCard}>
          <div className={styles.chartHeader}>
            <h3>Recent Activity</h3>
            <a href="#" className={styles.viewAll}>View All</a>
          </div>
          <div className={styles.activityList}>
            {recentActivity.map(item => (
              <div key={item.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  {item.icon === 'UserPlus' && <UserPlus size={18} color="#1d4ed8" />}
                  {item.icon === 'FileSignature' && <FileSignature size={18} color="#9333ea" />}
                  {item.icon === 'Receipt' && <Receipt size={18} color="#0ea5e9" />}
                  {item.icon === 'DollarSign' && <DollarSign size={18} color="#f59e0b" />}
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>{item.title}</p>
                  <span className={styles.activityTime}>{item.time}</span>
                </div>
                <div className={styles.activityBadge}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Approval Queue */}
        <Card className={styles.widgetCard}>
          <div className={styles.chartHeader}>
            <h3>Approval Queue</h3>
            <a href="#" className={styles.viewAll}>View All</a>
          </div>
          <div className={styles.queueList}>
            {approvalQueue.map(item => (
              <div key={item.id} className={styles.queueItem}>
                <div className={styles.queueLeft}>
                  <div className={styles.queueIcon} style={{color: item.color, backgroundColor: `${item.color}15`}}>
                    {item.icon === 'UserCheck' && <UserCheck size={18} />}
                    {item.icon === 'ShieldAlert' && <ShieldAlert size={18} />}
                    {item.icon === 'FileText' && <FileText size={18} />}
                    {item.icon === 'Receipt' && <Receipt size={18} />}
                    {item.icon === 'FileSignature' && <FileSignature size={18} />}
                  </div>
                  <span className={styles.queueName}>{item.name}</span>
                </div>
                <div className={styles.queueRight}>
                  <span className={styles.queueCount} style={{color: item.color}}>{item.count}</span>
                  <ArrowRight size={16} color="#cbd5e1" />
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
};

