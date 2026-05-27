import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, DollarSign, Award, Bot, FileText, Download } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import styles from './ProcurementAnalytics.module.css';

const mockSpendComparison = [
  { month: 'Q1-25', budget: 3.5, actual: 3.2 },
  { month: 'Q2-25', budget: 3.8, actual: 4.0 },
  { month: 'Q3-25', budget: 4.2, actual: 3.9 },
  { month: 'Q4-25', budget: 4.5, actual: 4.8 },
  { month: 'Q1-26', budget: 5.2, actual: 4.9 },
];

const mockSavingsTrend = [
  { month: 'Dec', savings: 12.5 },
  { month: 'Jan', savings: 15.2 },
  { month: 'Feb', savings: 14.8 },
  { month: 'Mar', savings: 18.6 },
  { month: 'Apr', savings: 22.1 },
  { month: 'May', savings: 25.4 },
];

const categoryMetrics = [
  { category: 'IT Services', spend: '₹3.8 Cr', budget: '₹4.0 Cr', savings: '₹20 L', performance: '94%' },
  { category: 'Facility Management', spend: '₹2.1 Cr', budget: '₹2.0 Cr', savings: '₹12 L', performance: '88%' },
  { category: 'Security Services', spend: '₹1.5 Cr', budget: '₹1.6 Cr', savings: '₹10 L', performance: '91%' },
  { category: 'Consulting', spend: '₹1.2 Cr', budget: '₹1.4 Cr', savings: '₹25 L', performance: '95%' },
  { category: 'Logistics', spend: '₹0.9 Cr', budget: '₹0.8 Cr', savings: '₹5 L', performance: '86%' },
];

export const ProcurementAnalytics: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/reports/dashboard')}>
            <ChevronLeft size={16} /> Back to MIS
          </button>
          <h1 className={styles.title}>Procurement Analytics & Spend Intelligence</h1>
          <p className={styles.subtitle}>Audit organizational cash leaks, category distributions, and historical savings</p>
        </div>
        <Button variant="outline" icon={<Download size={16} />}>Download Excel</Button>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Procurement Spend</span>
            <DollarSign size={16} className={styles.icon} />
          </div>
          <div className={styles.kpiValue}>₹11.3 Cr</div>
          <div className={styles.trendGreen}>↓ 4.2% below budget cap</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Savings Yield %</span>
            <TrendingUp size={16} className={styles.icon} />
          </div>
          <div className={styles.kpiValue}>7.5%</div>
          <div className={styles.trendGreen}>↑ 1.2% over target</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Cycle Efficiency</span>
            <Award size={16} className={styles.icon} />
          </div>
          <div className={styles.kpiValue}>14.2 Days</div>
          <div className={styles.trendGreen}>Average Purchase Cycle</div>
        </Card>
      </div>

      <div className={styles.chartGrid}>
        {/* Budget vs Actual spend comparison */}
        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Budget vs Actual Spend Comparison (₹ Cr)</h3>
          <div style={{ height: '260px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSpendComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip />
                <Legend iconSize={10} verticalAlign="top" height={36} />
                <Bar dataKey="budget" fill="#94a3b8" name="Budget Cap" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#1d4ed8" name="Actual Spend" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Cost savings trend */}
        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Monthly Cost Savings Trend (₹ L)</h3>
          <div style={{ height: '260px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSavingsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="savings" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, fill: '#16a34a' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Category breakdown table */}
      <Card className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>Spend Breakdown by Sourcing Category</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sourcing Category</th>
                <th>Actual Spend</th>
                <th>Allocated Budget</th>
                <th>SLA Score</th>
                <th>Cost Savings Yield</th>
              </tr>
            </thead>
            <tbody>
              {categoryMetrics.map(item => (
                <tr key={item.category}>
                  <td className={styles.categoryName}>{item.category}</td>
                  <td style={{ fontWeight: 600 }}>{item.spend}</td>
                  <td>{item.budget}</td>
                  <td>{item.performance}</td>
                  <td style={{ color: '#16a34a', fontWeight: 600 }}>{item.savings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Recommendation panel */}
      <Card className={styles.aiCard}>
        <div className={styles.aiHeader}>
          <Bot size={20} className={styles.aiIcon} />
          <h3>Sourcing Strategy Recommendations</h3>
        </div>
        <div className={styles.recommendationList}>
          <div className={styles.recItem}>
            <FileText size={16} className={styles.recIcon} />
            <div>
              <h5>Sourcing consolidation in Facility Management</h5>
              <p>Spend in Facilities exceeds allocated budget by 5%. Consolidating cleaning contracts across H1 and H2 nodes under Secure Facilities Ltd yields a potential rebate of ₹6,50,000.</p>
            </div>
          </div>
          <div className={styles.recItem}>
            <FileText size={16} className={styles.recIcon} />
            <div>
              <h5>Early settlement discount opportunity</h5>
              <p>Contract terms with Tech Solutions allow for 2% prompt settlement savings. Releasing invoice payouts 10 days early saves ₹80,240 in treasury outflows.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
