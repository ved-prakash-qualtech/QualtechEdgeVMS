import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  Download
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area, 
  LineChart, 
  Line 
} from 'recharts';
import { CatalogueHeader } from './CatalogueHeader';
import { Button } from '../../components/Button/Button';
import styles from './CatalogueAnalytics.module.css';

const COLORS = ['#1D4ED8', '#16A34A', '#F59E0B', '#7C3AED', '#DC2626'];

const SPEND_DISTRIBUTION = [
  { name: 'IT Hardware', value: 3400000 },
  { name: 'Professional Services', value: 1800000 },
  { name: 'Facility Management', value: 2100000 },
  { name: 'Office Supplies', value: 1200000 },
  { name: 'Logistics', value: 1300000 }
];

const TRENDS_DATA = [
  { month: 'Jan', Spend: 4500000, Savings: 210000 },
  { month: 'Feb', Spend: 5200000, Savings: 280000 },
  { month: 'Mar', Spend: 4900000, Savings: 240000 },
  { month: 'Apr', Spend: 5800000, Savings: 320000 },
  { month: 'May', Spend: 6400000, Savings: 380000 },
  { month: 'Jun', Spend: 7200000, Savings: 450000 }
];

const LEAD_TIMES_DATA = [
  { category: 'IT Hardware', leadTime: 9 },
  { category: 'Professional Services', leadTime: 15 },
  { category: 'Facility Management', leadTime: 2 },
  { category: 'Office Supplies', leadTime: 4 },
  { category: 'Logistics', leadTime: 6 }
];

const COMPLIANCE_TREND = [
  { month: 'Jan', Compliance: 82 },
  { month: 'Feb', Compliance: 84 },
  { month: 'Mar', Compliance: 85 },
  { month: 'Apr', Compliance: 86 },
  { month: 'May', Compliance: 87.5 },
  { month: 'Jun', Compliance: 89 }
];

export const CatalogueAnalytics: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <CatalogueHeader 
        title="CATALOGUE LIFE-CYCLE BI ANALYTICS" 
        subtitle="Gain procurement visibility on category spend growth trends, forecast coverage, contract leakages, and SLA performance metric details"
        actions={
          <>
            <Button variant="outline" icon={<Download size={16} />} onClick={() => alert("Downloading PDF Executive report...")}>
              Export PDF
            </Button>
            <Button variant="outline" icon={<ArrowLeft size={16} />} onClick={() => navigate('/catalogue/dashboard')}>
              Back to Dashboard
            </Button>
          </>
        }
      />

      {/* Analytics KPI Row */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Sourced Value YTD</span>
          <div className={styles.kpiValue}>₹90.0L</div>
          <div className={styles.kpiTrend}>
            <span className={styles.trendUp}><TrendingUp size={12} /> +14.2%</span> vs last year
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Year-over-Year Sourcing Savings</span>
          <div className={styles.kpiValue}>₹4.8L</div>
          <div className={styles.kpiTrend}>
            <span className={styles.trendUp}><TrendingUp size={12} /> +6.6%</span> via L1 routing
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Catalogue Compliance Adherence</span>
          <div className={styles.kpiValue}>87.5%</div>
          <div className={styles.kpiTrend}>
            <span className={styles.trendUp}><TrendingUp size={12} /> +2.1%</span> contract coverage
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Active Mapped Lines</span>
          <div className={styles.kpiValue}>9,668</div>
          <div className={styles.kpiTrend}>
            <span className={styles.trendUp}><TrendingUp size={12} /> +240</span> new items
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className={styles.analyticsGrid}>
        {/* Spend Category distribution */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Spend Distribution by Category (INR)</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SPEND_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {SPEND_DISTRIBUTION.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `₹${(Number(value) / 100000).toFixed(1)} L`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Spend Area Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Monthly spend vs realized AI Savings</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRENDS_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(val: number) => `₹${(val / 100000).toFixed(0)}L`} />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Legend />
                <Area type="monotone" dataKey="Spend" stackId="1" stroke="#1D4ED8" fill="#EAF2FF" strokeWidth={2} />
                <Area type="monotone" dataKey="Savings" stackId="2" stroke="#16A34A" fill="#DCFCE7" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead times bar chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Average Delivery Lead Times (Days)</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LEAD_TIMES_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="leadTime" name="Lead Time (Days)" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Catalogue adherence Line chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>SLA Catalogue Compliance Adherence Growth Trend (%)</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={COMPLIANCE_TREND}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[70, 100]} label={{ value: '% Adherence', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Compliance" stroke="#16A34A" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
