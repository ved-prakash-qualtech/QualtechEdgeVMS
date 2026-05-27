import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart as BarIcon, 
  ArrowRight, 
  Users, 
  FileText, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Percent, 
  AlertTriangle, 
  Settings, 
  Download, 
  Bot, 
  Sparkles,
  Zap,
  TrendingUp,
  Share2
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid
} from 'recharts';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import styles from './ReportsDashboard.module.css';

const steps = [
  'Data Collection',
  'Data Validation',
  'Data Aggregation',
  'KPI Calculation',
  'Analytics Processing',
  'Visualization',
  'AI Insights Gen',
  'Publishing',
  'Distribution',
  'Decision Dashboard'
];

const mockSpendData = [
  { name: 'Dec', budget: 4.5, actual: 4.2 },
  { name: 'Jan', budget: 5.0, actual: 5.1 },
  { name: 'Feb', budget: 5.0, actual: 4.8 },
  { name: 'Mar', budget: 6.5, actual: 6.2 },
  { name: 'Apr', budget: 7.0, actual: 6.9 },
  { name: 'May', budget: 8.0, actual: 7.5 },
];

const categorySpend = [
  { name: 'IT Services', value: 3.8, color: '#0b1f5f' },
  { name: 'Facility Mgmt', value: 2.1, color: '#1d4ed8' },
  { name: 'Security', value: 1.5, color: '#3b82f6' },
  { name: 'Consulting', value: 1.2, color: '#7c3aed' },
  { name: 'Logistics', value: 0.9, color: '#f59e0b' },
  { name: 'Infrastructure', value: 1.8, color: '#16a34a' },
];

const riskDistribution = [
  { name: 'Low Risk', value: 480, color: '#16a34a' },
  { name: 'Medium Risk', value: 95, color: '#f59e0b' },
  { name: 'High Risk', value: 12, color: '#dc2626' },
];

export const ReportsDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Reports & MIS (Executive Room)</h1>
          <p className={styles.subtitle}>Unified BI Analytics, compliance auditing, and spend orchestration</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.dateFilter}>
            <span>FY 2026 - Q1</span>
          </div>
          <Button variant="outline" icon={<Download size={16} />}>Export PDF</Button>
          <Button icon={<BarIcon size={16} />} onClick={() => navigate('/reports/builder')}>Custom Builder</Button>
        </div>
      </header>

      {/* HORIZONTAL reporting stepper */}
      <Card className={styles.stepperCard}>
        <h3 className={styles.sectionTitle}>MIS Processing Pipeline</h3>
        <div className={styles.stepperScroll}>
          <div className={styles.stepperContainer}>
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <div className={styles.stepItem}>
                  <div className={`${styles.stepCircle} ${index === 9 ? styles.stepCircleActive : ''}`}>
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

      {/* KPI GRID */}
      <div className={styles.kpiGrid}>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Vendors</span>
            <Users size={16} className={styles.kpiIcon} style={{ color: '#1d4ed8' }} />
          </div>
          <div className={styles.kpiValue}>587</div>
          <div className={styles.trendGreen}>↑ 8% vs last Qtr</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Active Contracts</span>
            <FileText size={16} className={styles.kpiIcon} style={{ color: '#7c3aed' }} />
          </div>
          <div className={styles.kpiValue}>142</div>
          <div className={styles.trendGreen}>↑ 12 new contracts</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total Spend</span>
            <DollarSign size={16} className={styles.kpiIcon} style={{ color: '#0b1f5f' }} />
          </div>
          <div className={styles.kpiValue}>₹11.3 Cr</div>
          <div className={styles.trendRed}>↓ 4.2% budget variance</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Compliance Score</span>
            <ShieldCheck size={16} className={styles.kpiIcon} style={{ color: '#16a34a' }} />
          </div>
          <div className={styles.kpiValue}>97.4%</div>
          <div className={styles.trendGreen}>Excellent Adherence</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Savings Achieved</span>
            <Percent size={16} className={styles.kpiIcon} style={{ color: '#f59e0b' }} />
          </div>
          <div className={styles.kpiValue}>₹84.6 L</div>
          <div className={styles.trendGreen}>↑ 1.8% negotiation yield</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Payment Efficiency</span>
            <Clock size={16} className={styles.kpiIcon} style={{ color: '#0284c7' }} />
          </div>
          <div className={styles.kpiValue}>8.4 Days</div>
          <div className={styles.trendGreen}>SLA Turnaround</div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className={styles.chartGrid}>
        {/* Spend Trend */}
        <Card className={styles.chartCard} style={{ gridColumn: 'span 2' }}>
          <h3 className={styles.sectionTitle}>Procurement Spend Trend (₹ Cr)</h3>
          <div style={{ height: '240px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSpendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="budget" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="actual" stroke="#1d4ed8" strokeWidth={3} dot={{ r: 4, fill: '#1d4ed8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Spend by Category */}
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>Spend by Category (₹ Cr)</h3>
          <div className={styles.pieWrapper}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={categorySpend}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categorySpend.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.pieCenter}>
              <span>11.3 Cr</span>
              <p>Spend</p>
            </div>
          </div>
          <div className={styles.legendGrid}>
            {categorySpend.map(item => (
              <div key={item.name} className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: item.color }}></span>
                <span className={styles.legendName}>{item.name}</span>
                <span className={styles.legendVal}>{item.value}Cr</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Compliance Risk Distribution */}
        <Card className={styles.chartCard}>
          <h3 className={styles.sectionTitle}>Compliance Risk Distribution</h3>
          <div className={styles.pieWrapper}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.pieCenter}>
              <span>587</span>
              <p>Vendors</p>
            </div>
          </div>
          <div className={styles.legendGrid}>
            {riskDistribution.map(item => (
              <div key={item.name} className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: item.color }}></span>
                <span className={styles.legendName}>{item.name}</span>
                <span className={styles.legendVal}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className={styles.bottomGrid}>
        {/* Quick Actions */}
        <Card className={styles.quickCard}>
          <h3 className={styles.sectionTitle}>Quick Actions</h3>
          <div className={styles.actionRow}>
            <button className={styles.actionBtn} onClick={() => navigate('/reports/procurement')}>
              <div className={styles.iconBox}><TrendingUp size={18} /></div>
              <span>Procurement Analytics</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/reports/performance')}>
              <div className={styles.iconBox}><Users size={18} /></div>
              <span>Vendor Performance</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/reports/finance')}>
              <div className={styles.iconBox}><DollarSign size={18} /></div>
              <span>Finance Reports</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/reports/builder')}>
              <div className={styles.iconBox}><Settings size={18} /></div>
              <span>Custom Builder</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/reports/insights')}>
              <div className={styles.iconBox}><Bot size={18} /></div>
              <span>AI Insights</span>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.iconBox}><Share2 size={18} /></div>
              <span>Share Dashboard</span>
            </button>
          </div>
        </Card>

        {/* AI Recommendations */}
        <Card className={styles.aiCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '16px' }}>
            <Bot size={20} className={styles.aiHeaderIcon} />
            <h3 className={styles.sectionTitle} style={{ margin: 0 }}>AI Executive Insights</h3>
          </div>
          <div className={styles.aiList}>
            <div className={styles.aiItem}>
              <Sparkles size={16} className={styles.aiIconBlue} />
              <div>
                <p className={styles.aiText}><strong>Savings Leakage Detected</strong>: IT Software licenses renewal showed a 12% price hike. Transitioning to ABC Solutions under pre-approved rates could save ₹8,40,000 annually.</p>
                <button className={styles.aiLink} onClick={() => navigate('/reports/insights')}>View Trade-off Matrix</button>
              </div>
            </div>
            <div className={styles.aiItem}>
              <AlertTriangle size={16} className={styles.aiIconOrange} />
              <div>
                <p className={styles.aiText}><strong>SLA Breach Prediction</strong>: Consulting deliveries from Fincons are projected to breach milestone-3 deadlines due to resource deficit.</p>
                <button className={styles.aiLink} onClick={() => navigate('/reports/performance')}>Open Scorecard</button>
              </div>
            </div>
            <div className={styles.aiItem}>
              <Zap size={16} className={styles.aiIconPurple} />
              <div>
                <p className={styles.aiText}><strong>Compliance Warning</strong>: GST return mismatch detected for 3 facilities vendors, halting ITC claims of ₹4.2 L.</p>
                <button className={styles.aiLink} onClick={() => navigate('/reports/finance')}>Initiate Vendor Notice</button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
