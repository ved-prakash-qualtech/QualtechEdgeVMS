import { useState } from 'react';
import { 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Eye, 
  FileText, 
  Ban, 
  Search,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './PerformanceDashboard.module.css';

interface Scorecard {
  vendorId: string;
  vendorName: string;
  category: string;
  quality: number;
  delivery: number;
  slaCompliance: number;
  cooperation: number;
  overall: number;
}

const SCORECARDS_MOCK: Scorecard[] = [
  { vendorId: 'VND-001', vendorName: 'ABC Infotech Pvt Ltd', category: 'IT Hardware', quality: 96, delivery: 94, slaCompliance: 98, cooperation: 92, overall: 95 },
  { vendorId: 'VND-002', vendorName: 'Tech Solutions Ltd', category: 'Professional Services', quality: 98, delivery: 95, slaCompliance: 96, cooperation: 94, overall: 96 },
  { vendorId: 'VND-003', vendorName: 'Office Supplies Co', category: 'Office Supplies', quality: 84, delivery: 88, slaCompliance: 90, cooperation: 85, overall: 87 },
  { vendorId: 'VND-004', vendorName: 'Global Logistics Ltd', category: 'Logistics', quality: 92, delivery: 91, slaCompliance: 94, cooperation: 90, overall: 92 },
  { vendorId: 'VND-005', vendorName: 'Comfort Seating Systems', category: 'Office Supplies', quality: 82, delivery: 85, slaCompliance: 89, cooperation: 80, overall: 84 }
];

const INCIDENTS_MOCK = [
  { id: 'INC-204', vendorName: 'Comfort Seating Systems', issue: 'Late delivery of workstation chairs', severity: 'Medium', status: 'Under Review', date: '21 May 2026' },
  { id: 'INC-201', vendorName: 'Global Logistics Ltd', issue: 'Freight SLA breach (Delhi-Mumbai)', severity: 'Low', status: 'Resolved', date: '19 May 2026' },
  { id: 'INC-198', vendorName: 'Office Supplies Co', issue: 'Defective stationery batch delivered', severity: 'Medium', status: 'Pending Vendor Response', date: '15 May 2026' },
  { id: 'INC-195', vendorName: 'Apex Security Systems', issue: 'Firewall certification expired on KYC register', severity: 'High', status: 'Escalated to Compliance', date: '10 May 2026' }
];

export const PerformanceDashboard: React.FC = () => {
  const [scorecards] = useState<Scorecard[]>(SCORECARDS_MOCK);
  const [selectedVendor, setSelectedVendor] = useState<Scorecard>(SCORECARDS_MOCK[0]);
  const [incidents, setIncidents] = useState(INCIDENTS_MOCK);
  const [searchTerm, setSearchTerm] = useState('');

  const handleBlacklist = (vendorId: string, vendorName: string) => {
    const confirmAction = window.confirm(`CRITICAL WARNING: Are you sure you want to trigger the blacklisting workflow for ${vendorName} (${vendorId})? This will restrict creating new Purchase Orders immediately.`);
    if (confirmAction) {
      alert(`Blacklisting request submitted. Maker-Checker compliance workflow initialized for ${vendorName}.`);
      setIncidents(prev => [
        {
          id: `INC-${Math.floor(Math.random() * 100) + 300}`,
          vendorName: vendorName,
          issue: 'Blacklist status initialized - Sourcing suspension requested',
          severity: 'High',
          status: 'Maker Sign-Off Completed',
          date: new Date().toLocaleDateString('en-IN')
        },
        ...prev
      ]);
    }
  };

  const radarData = [
    { subject: 'Quality Score', value: selectedVendor.quality, fullMark: 100 },
    { subject: 'Delivery / Lead Time', value: selectedVendor.delivery, fullMark: 100 },
    { subject: 'SLA Compliance', value: selectedVendor.slaCompliance, fullMark: 100 },
    { subject: 'Commercial Cooperation', value: selectedVendor.cooperation, fullMark: 100 },
    { subject: 'Overall Score', value: selectedVendor.overall, fullMark: 100 }
  ];

  const filteredScorecards = scorecards.filter(sc => 
    sc.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sc.vendorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>VENDOR PERFORMANCE MANAGEMENT</h1>
          <p className={styles.breadcrumbs}>Home / Performance / Performance Dashboard</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" icon={<Plus size={16} />} onClick={() => alert("Initiate Vendor Improvement Plan (VIP) wizard...")}>
            Create VIP Program
          </Button>
          <Button variant="primary" icon={<Activity size={16} />} onClick={() => alert("Recalculating scorecard indices based on ERP GRN/SLA data...")}>
            Run Performance Run
          </Button>
        </div>
      </header>

      {/* KPI Cards Section */}
      <div className={styles.kpiGrid}>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>SLA Compliance Average</span>
              <div className={styles.kpiValue} style={{ color: '#16a34a' }}>96.8%</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <CheckCircle size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend}><TrendingUp size={12} /> +1.2% versus last quarter</span>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>Avg Supplier Scorecard</span>
              <div className={styles.kpiValue} style={{ color: '#0b1f5f' }}>91.2 / 100</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
              <Award size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend}><TrendingUp size={12} /> Stable compliance level</span>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>Active Incidents</span>
              <div className={styles.kpiValue} style={{ color: '#f59e0b' }}>3 Issues</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
              <AlertTriangle size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend} style={{ color: 'var(--color-danger-text)' }}>2 pending vendor action</span>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>SLA Breach Rate</span>
              <div className={styles.kpiValue} style={{ color: '#dc2626' }}>1.4%</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
              <Ban size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend} style={{ color: 'var(--color-success-text)' }}>-0.4% improvement this month</span>
        </Card>
      </div>

      <div className={styles.layoutGrid}>
        {/* Left Side: Scorecard Directory & Selector */}
        <div className={styles.leftPanel}>
          <Card className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Vendor Scorecards</span>
              <Badge variant="info">{filteredScorecards.length} Registered</Badge>
            </div>
            
            <div className={styles.searchBoxWrap}>
              <Search size={16} className={styles.searchIcon} />
              <input 
                type="text" 
                className={styles.searchBox} 
                placeholder="Search scorecards, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.vendorList}>
              {filteredScorecards.map(sc => {
                const isActive = sc.vendorId === selectedVendor.vendorId;
                return (
                  <div 
                    key={sc.vendorId} 
                    className={`${styles.vendorRow} ${isActive ? styles.vendorRowActive : ''}`}
                    onClick={() => setSelectedVendor(sc)}
                  >
                    <div className={styles.vendorInfo}>
                      <span className={styles.vendorName}>{sc.vendorName}</span>
                      <span className={styles.vendorMeta}>{sc.vendorId} • {sc.category}</span>
                    </div>
                    <div className={styles.vendorBadge}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: sc.overall >= 90 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                        {sc.overall}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Side: Radars, Performance metrics & Incident tracking */}
        <div className={styles.mainPanel}>
          <Card className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Performance Radar: {selectedVendor.vendorName} ({selectedVendor.vendorId})</span>
              <Badge variant={selectedVendor.overall >= 90 ? 'success' : 'warning'}>
                {selectedVendor.overall >= 90 ? 'Preferred Vendor' : 'Needs Improvement'}
              </Badge>
            </div>

            <div className={styles.analysisGrid}>
              {/* Radar Chart widget */}
              <div className={styles.chartCol}>
                <div style={{ width: '100%', height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#0b1f5f', fontSize: 11, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name={selectedVendor.vendorName} dataKey="value" stroke="#1D4ED8" fill="#1D4ED8" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Value Listing */}
              <div className={styles.detailsCol}>
                <h4 style={{ color: '#0b1f5f', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>Operational Metrics Breakdown</h4>
                <div className={styles.metricList}>
                  <div className={styles.metricRow}>
                    <span>Quality / Defect Deflection Rate</span>
                    <strong>{selectedVendor.quality}%</strong>
                  </div>
                  <div className={styles.metricRow}>
                    <span>On-Time Delivery / Dispatch Speed</span>
                    <strong>{selectedVendor.delivery}%</strong>
                  </div>
                  <div className={styles.metricRow}>
                    <span>SLA Commitments Met</span>
                    <strong>{selectedVendor.slaCompliance}%</strong>
                  </div>
                  <div className={styles.metricRow}>
                    <span>Commercial Cooperation Score</span>
                    <strong>{selectedVendor.cooperation}%</strong>
                  </div>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                  <Button size="sm" variant="outline" icon={<FileText size={12} />} onClick={() => alert(`Opening full scorecard PDF for ${selectedVendor.vendorName}`)}>
                    Scorecard PDF
                  </Button>
                  <Button size="sm" variant="danger" icon={<Ban size={12} />} onClick={() => handleBlacklist(selectedVendor.vendorId, selectedVendor.vendorName)}>
                    Suspend Sourcing
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Incident Tracking list */}
          <Card className={styles.card} style={{ marginTop: '8px' }}>
            <div className={styles.cardTitle}>
              <span>Incidents & SLA Violations Logs</span>
              <Badge variant="danger">Active Incidents</Badge>
            </div>
            
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Vendor Partner</th>
                    <th>Issue Description</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Logged Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map(inc => (
                    <tr key={inc.id}>
                      <td style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{inc.id}</td>
                      <td>{inc.vendorName}</td>
                      <td>{inc.issue}</td>
                      <td>
                        <Badge variant={inc.severity === 'High' ? 'danger' : inc.severity === 'Medium' ? 'warning' : 'default'}>
                          {inc.severity}
                        </Badge>
                      </td>
                      <td style={{ fontWeight: 600 }}>{inc.status}</td>
                      <td>{inc.date}</td>
                      <td>
                        <Button size="sm" variant="ghost" icon={<Eye size={12} />} onClick={() => alert(`Reviewing details of audit incident: ${inc.id}`)}>
                          Review
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
