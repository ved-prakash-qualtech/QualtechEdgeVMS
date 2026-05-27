import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, ShieldAlert, Award, Download } from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './VendorPerformance.module.css';

const mockPerformanceData = [
  { subject: 'SLA Adherence', A: 96, fullMark: 100 },
  { subject: 'Quality Index', A: 92, fullMark: 100 },
  { subject: 'Delivery Time', A: 85, fullMark: 100 },
  { subject: 'Compliance', A: 98, fullMark: 100 },
  { subject: 'Responsiveness', A: 88, fullMark: 100 },
];

const mockCategorySLA = [
  { category: 'Consulting', sla: 95 },
  { category: 'IT Services', sla: 94 },
  { category: 'Security', sla: 91 },
  { category: 'Facilities', sla: 88 },
  { category: 'Logistics', sla: 86 },
];

const vendorScorecards = [
  { name: 'ABC Infotech Pvt Ltd', category: 'IT Services', sla: '96%', quality: '98%', delivery: '95%', risk: 'Low' },
  { name: 'Secure Facilities Ltd', category: 'Facility Mgmt', sla: '88%', quality: '90%', delivery: '85%', risk: 'Medium' },
  { name: 'Global Security Ltd', category: 'Security Services', sla: '91%', quality: '93%', delivery: '90%', risk: 'Low' },
  { name: 'Fincons Consulting', category: 'Consulting', sla: '95%', quality: '94%', delivery: '92%', risk: 'Low' },
  { name: 'Data Soft Solutions', category: 'IT Services', sla: '94%', quality: '95%', delivery: '93%', risk: 'Low' },
];

export const VendorPerformance: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/reports/dashboard')}>
            <ChevronLeft size={16} /> Back to MIS
          </button>
          <h1 className={styles.title}>Vendor Performance & Scorecards</h1>
          <p className={styles.subtitle}>Track SLA breaches, quality indices, delivery performance, and compliance metrics</p>
        </div>
        <Button variant="outline" icon={<Download size={16} />}>Export Scorecards</Button>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Average SLA Score</span>
            <Award size={16} className={styles.icon} />
          </div>
          <div className={styles.kpiValue}>92.4%</div>
          <div className={styles.trendGreen}>↑ 1.5% vs last Qtr</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Delayed Deliveries</span>
            <ShieldAlert size={16} className={styles.iconRed} />
          </div>
          <div className={styles.kpiValue}>8</div>
          <div className={styles.trendRed}>SLA warning threshold</div>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Quality Index</span>
            <Star size={16} className={styles.icon} />
          </div>
          <div className={styles.kpiValue}>94.8%</div>
          <div className={styles.trendGreen}>Excellent Grade</div>
        </Card>
      </div>

      <div className={styles.chartGrid}>
        {/* Radar Performance Index */}
        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Overall Performance Indexes</h3>
          <div className={styles.radarWrapper}>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockPerformanceData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Radar name="Performance" dataKey="A" stroke="#1d4ed8" fill="#1d4ed8" fillOpacity={0.3} />
                <RechartsTooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bar SLA Breakdown */}
        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Category Sourcing SLA Breakdown (%)</h3>
          <div style={{ height: '260px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCategorySLA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                <RechartsTooltip />
                <Bar dataKey="sla" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Scorecard Table */}
      <Card className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>Vendor Sourcing Performance Scorecard</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Category</th>
                <th>SLA Adherence</th>
                <th>Quality Rating</th>
                <th>Delivery Time</th>
                <th>Risk Profile</th>
              </tr>
            </thead>
            <tbody>
              {vendorScorecards.map(vendor => (
                <tr key={vendor.name}>
                  <td className={styles.vendorName}>{vendor.name}</td>
                  <td>{vendor.category}</td>
                  <td style={{ fontWeight: 600 }}>{vendor.sla}</td>
                  <td>{vendor.quality}</td>
                  <td>{vendor.delivery}</td>
                  <td>
                    <Badge variant={vendor.risk === 'Low' ? 'success' : 'warning'}>
                      {vendor.risk}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
