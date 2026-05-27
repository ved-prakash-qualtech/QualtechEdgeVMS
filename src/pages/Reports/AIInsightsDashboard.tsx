import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, AlertTriangle, ShieldAlert, Award, FileText } from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import styles from './AIInsightsDashboard.module.css';

const mockForecast = [
  { name: 'Dec', actual: 4.5, projected: null },
  { name: 'Jan', actual: 5.0, projected: null },
  { name: 'Feb', actual: 4.8, projected: null },
  { name: 'Mar', actual: 6.2, projected: 6.2 },
  { name: 'Apr', actual: null, projected: 6.9 },
  { name: 'May', actual: null, projected: 7.5 },
  { name: 'Jun', actual: null, projected: 8.2 },
];

const mockRisk = [
  { name: 'Low Risk', value: 480, color: '#16a34a' },
  { name: 'Medium Risk', value: 95, color: '#f59e0b' },
  { name: 'High Risk', value: 12, color: '#dc2626' },
];

export const AIInsightsDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/reports/dashboard')}>
            <ChevronLeft size={16} /> Back to MIS
          </button>
          <h1 className={styles.title}>AI Intelligence & Forecasting</h1>
          <p className={styles.subtitle}>Forecast procurement expenditures, predict vendor contract churn, and detect compliance risks</p>
        </div>
      </header>

      {/* Prediction Cards */}
      <div className={styles.predictionGrid}>
        <Card className={styles.predictCard}>
          <div className={styles.predictHeader}>
            <Sparkles size={18} className={styles.iconBlue} />
            <span>Spend Projection (FY26)</span>
          </div>
          <div className={styles.predictValue}>₹12.4 Cr</div>
          <p className={styles.predictDesc}>AI models predict a 8% increase in IT/Soft licensing expenditures next quarter.</p>
        </Card>

        <Card className={styles.predictCard}>
          <div className={styles.predictHeader}>
            <AlertTriangle size={18} className={styles.iconOrange} />
            <span>SLA Failure Warnings</span>
          </div>
          <div className={styles.predictValue}>2 Vendors</div>
          <p className={styles.predictDesc}>Fincons Milestones are flagged at high-risk (84% probability of delay).</p>
        </Card>

        <Card className={styles.predictCard}>
          <div className={styles.predictHeader}>
            <ShieldAlert size={18} className={styles.iconRed} />
            <span>Contract Churn Warnings</span>
          </div>
          <div className={styles.predictValue}>3 Contracts</div>
          <p className={styles.predictDesc}>Facility contracts expiring in 30 days without renegotiation terms.</p>
        </Card>
      </div>

      <div className={styles.chartGrid}>
        {/* Spend Forecasting */}
        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Spend Forecasting (₹ Cr actual vs projected)</h3>
          <div style={{ height: '260px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="actual" stroke="#1d4ed8" strokeWidth={3} dot={{ r: 4, fill: '#1d4ed8' }} connectNulls />
                <Line type="monotone" dataKey="projected" stroke="#3b82f6" strokeDasharray="5 5" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Risk Donut */}
        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Vendor Compliance Risk Grouping</h3>
          <div className={styles.pieWrapper}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={mockRisk}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {mockRisk.map((entry, idx) => (
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
            {mockRisk.map(item => (
              <div key={item.name} className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: item.color }}></span>
                <span className={styles.legendName}>{item.name}</span>
                <span className={styles.legendVal}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sourcing Actions Log */}
      <Card className={styles.recommendationCard}>
        <h3 className={styles.cardTitle}>AI Actionable Sourcing Insights</h3>
        <div className={styles.recList}>
          <div className={styles.recItem}>
            <Award size={18} className={styles.recIconGreen} />
            <div>
              <h5>Cash rebate optimization</h5>
              <p>Releasing early payouts to ABC Infotech Pvt Ltd secures an invoice rebate of ₹29,500.</p>
              <Button variant="outline" size="sm" style={{ marginTop: '8px' }}>Execute Early Payout</Button>
            </div>
          </div>
          <div className={styles.recItem}>
            <FileText size={18} className={styles.recIconOrange} />
            <div>
              <h5>Contract renewal warning</h5>
              <p>Sourcing agreement with Secure Facilities Ltd expires on 19 Jan 2027. Sourcing rates are projected to increase by 8.5% if not locked in this quarter.</p>
              <Button variant="outline" size="sm" style={{ marginTop: '8px' }}>Draft Renewal Amendment</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
