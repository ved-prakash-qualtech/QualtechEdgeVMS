import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock, ShieldAlert, Shield, FileText } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import { Input } from '../../components/Input/Input';
import styles from './SecurityGovernanceSettings.module.css';

const securityLogs = [
  { time: '10:45 AM', user: 'Neha Sharma (Super Admin)', action: 'Modified IP Whitelisting range', ip: '103.45.201.90' },
  { time: 'Yesterday', user: 'Suresh Kumar (Finance Admin)', action: 'Enabled early invoice cash rebate workflow', ip: '103.45.201.92' },
  { time: '14 May 2026', user: 'System Agent', action: 'Auto-revoked inactive vendor portal session token', ip: 'Middleware Node' },
  { time: '12 May 2026', user: 'Neha Sharma (Super Admin)', action: 'Enforced Multi-Factor Authentication (MFA)', ip: '103.45.201.90' }
];

export const SecurityGovernanceSettings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/settings/dashboard')}>
            <ChevronLeft size={16} /> Back to Settings
          </button>
          <h1 className={styles.title}>Security Controls & Audit Governance</h1>
          <p className={styles.subtitle}>Enforce session policies, manage multi-factor authentication (MFA), whitelist corporate IPs, and audit system logs</p>
        </div>
        <Button>Apply Security Policy</Button>
      </header>

      <div className={styles.grid}>
        {/* Left Side: Policies Forms */}
        <div className={styles.leftCol}>
          {/* Identity & Timeout controls */}
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <Lock size={18} className={styles.icon} />
              <h3>Identity & Session Policies</h3>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Multi-Factor Authentication (MFA)</label>
                <select className={styles.select} defaultValue="enforced">
                  <option value="enforced">Enforced for All Users</option>
                  <option value="optional">Optional for Vendors</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>SSO Integration (SAML 2.0)</label>
                <select className={styles.select} defaultValue="active">
                  <option value="active">Active (Okta, Azure AD)</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Idle Session Timeout</label>
                <select className={styles.select} defaultValue="15">
                  <option value="15">15 Minutes (Recommended)</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Password Rotation Cycle</label>
                <select className={styles.select} defaultValue="90">
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                  <option value="never">Never Rotate</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Network IP Whitelist */}
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <ShieldAlert size={18} className={styles.icon} />
              <h3>Network Access & IP Whitelisting</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="Whitelisted Corporate IP Subnet" defaultValue="103.45.201.0/24" />
              <Input label="Secondary Backup Proxy Range" defaultValue="202.164.30.12/32" />
            </div>
          </Card>
        </div>

        {/* Right Side: Risk score and threat charts */}
        <div className={styles.rightCol}>
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <Shield size={18} className={styles.icon} />
              <h3>SOC2 & ISO 27001 Readiness Score</h3>
            </div>
            <div className={styles.riskWrapper}>
              <div className={styles.riskHeader}>
                <span className={styles.riskLabel}>Security posture</span>
                <Badge variant="success">Excellent</Badge>
              </div>
              <div className={styles.meterContainer}>
                <div className={styles.meterFill} style={{ width: '96%' }}></div>
              </div>
              <span className={styles.postureDesc}>96% of core security controls are compliant with ISO/IEC 27001 guidelines.</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Immutable audit logs */}
      <Card className={styles.logsCard}>
        <div className={styles.logsHeader}>
          <FileText size={18} className={styles.icon} />
          <h3>System Audit Trail (SOC2 Compliance Ledger)</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Authorized User</th>
                <th>Configuration Action</th>
                <th>Origin IP</th>
              </tr>
            </thead>
            <tbody>
              {securityLogs.map((log, index) => (
                <tr key={index}>
                  <td className={styles.timestamp}>{log.time}</td>
                  <td className={styles.userName}>{log.user}</td>
                  <td>{log.action}</td>
                  <td className={styles.ipAddress}>{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
