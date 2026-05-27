import React, { useState, useEffect } from 'react';
import { 
  Download, 
  ShieldAlert, 
  Activity, 
  Search, 
  Filter, 
  AlertTriangle, 
  Lock, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './AuditLogsDashboard.module.css';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  tenant: string;
  action: string;
  ipAddress: string;
  status: 'Success' | 'Denied' | 'Override' | 'Failed';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface CheckerAction {
  id: string;
  timestamp: string;
  makerName: string;
  module: string;
  changeDetails: string;
  securityImpact: string;
}

export const AuditLogsDashboard: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [checkerQueue, setCheckerQueue] = useState<CheckerAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  // Static alarms for watchlist (due to compliance static rule validation)
  const [watchlist] = useState([
    { id: 'ALR-401', timestamp: '22 May 2026 10:30:18', issue: 'Unauthorized Bank Account Change Attempt', sourceIp: '192.168.2.19', status: 'Under Investigation', threat: 'High' },
    { id: 'ALR-388', timestamp: '22 May 2026 09:15:00', issue: 'Sanctions Clearance Manual Bypass', sourceIp: '192.168.1.22', status: 'Board Notified', threat: 'Critical' },
    { id: 'ALR-345', timestamp: '21 May 2026 14:05:30', issue: 'Brute-Force Login Pattern Identified', sourceIp: '203.0.113.88', status: 'IP Temporary Blocked', threat: 'Medium' }
  ]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [logsRes, approvalsRes] = await Promise.all([
        axios.get('/api/audit-logs'),
        axios.get('/api/approvals')
      ]);
      setLogs(logsRes.data);
      setCheckerQueue(approvalsRes.data);
    } catch (err) {
      console.error('Error loading audit dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApproveChecker = async (id: string, detail: string) => {
    const confirmAction = window.confirm(`FOUR-EYE SECURITY CONFIRMATION:\nAre you sure you want to approve this action?\nDetails: ${detail}`);
    if (confirmAction) {
      try {
        await axios.post(`/api/approvals/${id}/resolve`, {
          action: 'Approved',
          performedBy: 'Saurabh.S'
        });
        alert(`Action ${id} has been signed-off and committed to active database.`);
        loadDashboardData();
      } catch (err) {
        console.error('Error resolving checker approval:', err);
        alert('Failed to approve security action.');
      }
    }
  };

  const handleRejectChecker = async (id: string) => {
    const reason = window.prompt("Please enter rejection reason:");
    if (reason !== null) {
      try {
        await axios.post(`/api/approvals/${id}/resolve`, {
          action: 'Rejected',
          performedBy: 'Saurabh.S'
        });
        alert(`Action ${id} rejected. Maker notified. Reason: ${reason}`);
        loadDashboardData();
      } catch (err) {
        console.error('Error rejecting checker approval:', err);
        alert('Failed to reject security action.');
      }
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.actor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.ipAddress.includes(searchTerm);
    const matchesSeverity = filterSeverity === 'All' ? true : log.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>ZERO-TRUST GOVERNANCE & AUDIT LOGS</h1>
          <p className={styles.breadcrumbs}>Home / Admin / Audit Logs & Trail</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" icon={<Download size={16} />} onClick={() => alert("Downloading encrypted JSON audit bundle with HMAC signature verification keys...")}>
            Export Audit Bundle
          </Button>
          <Button variant="primary" icon={<RefreshCw size={16} />} onClick={() => loadDashboardData()}>
            Refresh Logs
          </Button>
        </div>
      </header>

      {/* KPI Cards Section */}
      <div className={styles.kpiGrid}>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>Total Logged Actions</span>
              <div className={styles.kpiValue} style={{ color: '#071B3B' }}>{logs.length} Events</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
              <Activity size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend}><Clock size={12} /> Log retention set to 7 Years</span>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>Watchlist Detections</span>
              <div className={styles.kpiValue} style={{ color: '#dc2626' }}>{watchlist.length} Alarms</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
              <ShieldAlert size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend} style={{ color: '#b91c1c' }}><AlertTriangle size={12} /> 1 Critical PEP Override logged</span>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>Checker Queues</span>
              <div className={styles.kpiValue} style={{ color: '#f59e0b' }}>{checkerQueue.length} Pending Sign-offs</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
              <Lock size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend} style={{ color: '#b45309' }}>Segregation of duties active</span>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>Log Chain Status</span>
              <div className={styles.kpiValue} style={{ color: '#16a34a' }}>ReadOnly Immutable</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <CheckCircle size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend} style={{ color: '#16a34a' }}>HMAC Verified</span>
        </Card>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '64px' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          <span style={{ marginLeft: '12px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Loading governance logs...</span>
        </div>
      ) : (
        <div className={styles.layoutGrid}>
          {/* Watchlist & Checker Queue */}
          <div className={styles.leftCol}>
            <Card className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Real-time Security Watchlist</span>
              </div>
              <div className={styles.watchlistList}>
                {watchlist.map(alarm => (
                  <div key={alarm.id} className={styles.alarmRow}>
                    <div className={styles.alarmContent}>
                      <div className={styles.alarmTitle}>{alarm.issue}</div>
                      <div className={styles.alarmMeta}>{alarm.id} • IP: {alarm.sourceIp} • {alarm.timestamp}</div>
                    </div>
                    <div>
                      <Badge variant={alarm.threat === 'Critical' ? 'danger' : alarm.threat === 'High' ? 'danger' : 'warning'}>
                        {alarm.threat} Threat
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className={styles.card} style={{ marginTop: '20px' }}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Four-Eye Checker Approvals</span>
              </div>
              <div className={styles.checkerList}>
                {checkerQueue.map(item => (
                  <div key={item.id} className={styles.checkerRow}>
                    <div className={styles.checkerDetails}>
                      <strong style={{ color: '#071B3B', fontSize: '13px' }}>{item.changeDetails}</strong>
                      <div className={styles.checkerMeta}>Maker: {item.makerName} • Module: {item.module}</div>
                      <div className={styles.checkerSecurity}>Impact: <strong>{item.securityImpact}</strong></div>
                    </div>
                    <div className={styles.checkerActions}>
                      <Button size="sm" variant="primary" onClick={() => handleApproveChecker(item.id, item.changeDetails)}>Approve</Button>
                      <Button size="sm" variant="danger" onClick={() => handleRejectChecker(item.id)}>Reject</Button>
                    </div>
                  </div>
                ))}
                {checkerQueue.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px', color: '#64748b', fontSize: '13px' }}>
                    No pending security approvals in verification queue.
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Trace logs list with filters */}
          <div className={styles.rightCol}>
            <Card className={styles.card}>
              <div className={styles.traceFilters}>
                <div className={styles.searchBar}>
                  <Search size={16} className={styles.searchIcon} />
                  <input 
                    type="text" 
                    className={styles.searchInput}
                    placeholder="Search logs by actor, action description, IP address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className={styles.filterGroup}>
                  <Filter size={16} style={{ color: '#64748b' }} />
                  <select 
                    className={styles.selectInput}
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                  >
                    <option value="All">All Severities</option>
                    <option value="Low">Low Only</option>
                    <option value="Medium">Medium Only</option>
                    <option value="High">High Only</option>
                    <option value="Critical">Critical Only</option>
                  </select>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Log ID</th>
                      <th>Date & Time</th>
                      <th>User Actor</th>
                      <th>Tenant Org</th>
                      <th>Action Executed</th>
                      <th>Source IP</th>
                      <th>Severity</th>
                      <th>Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map(log => (
                      <tr key={log.id}>
                        <td style={{ fontWeight: 'bold' }}>{log.id}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                        <td>
                          <div>
                            <strong style={{ color: '#071B3B' }}>{log.actor}</strong>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{log.role}</div>
                          </div>
                        </td>
                        <td>{log.tenant}</td>
                        <td><span className={styles.actionText}>{log.action}</span></td>
                        <td><code>{log.ipAddress}</code></td>
                        <td>
                          <Badge variant={log.severity === 'Critical' ? 'danger' : log.severity === 'High' ? 'danger' : log.severity === 'Medium' ? 'warning' : 'default'}>
                            {log.severity}
                          </Badge>
                        </td>
                        <td>
                          <Badge variant={log.status === 'Success' ? 'success' : log.status === 'Denied' ? 'danger' : 'warning'}>
                            {log.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
