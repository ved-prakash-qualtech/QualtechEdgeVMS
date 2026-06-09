import React, { useState, useEffect } from 'react';
import {
  Bell, Link, Shield, FileText, CheckCircle, RefreshCw, Settings, Zap, Lock, Clock
} from 'lucide-react';
import { getSettings, saveSettings } from '../../services/settingsService';
import type { NotificationSettings, Integration, SecuritySettings, AuditLogEntry } from '../../services/settingsService';
import styles from './SystemPreferences.module.css';

const INT_ICONS: Record<string, string> = {
  'ERP': 'ERP',
  'Tax & Compliance': 'TAX',
  'Payment Gateway': 'PAY',
  'Document Signing': 'DOC'
};

export const SystemPreferences: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationSettings | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [security, setSecurity] = useState<SecuritySettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      setNotifications(data.notifications);
      setIntegrations(data.integrations || []);
      setSecurity(data.security);
      setAuditLogs(data.auditLogs || []);
    } catch (err) {
      console.error('Failed to load preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotif = (key: keyof NotificationSettings) => {
    setNotifications(prev => prev ? { ...prev, [key]: !prev[key as keyof typeof prev] } : prev);
  };

  const handleSecurityChange = (key: keyof SecuritySettings, value: number | boolean | string) => {
    setSecurity(prev => prev ? { ...prev, [key]: value } : prev);
  };

  const handleSave = async () => {
    if (!notifications || !security) return;
    setSaving(true);
    try {
      await saveSettings({ notifications, security, updatedBy: 'Saurabh Anand' });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await fetchData(); // refresh audit logs
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  const severityClass = (s: string) => {
    if (s === 'High') return styles.severityHigh;
    if (s === 'Medium') return styles.severityMedium;
    return styles.severityLow;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', padding: '40px' }}>
          <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
          Loading system preferences…
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <span className={styles.badge}><Settings size={12} /> System Configuration</span>
          <h1 className={styles.title}>System Preferences</h1>
          <p className={styles.subtitle}>Manage notifications, integrations, security policies and view system audit logs</p>
        </div>
        <div className={styles.headerActions}>
          {saved && <span className={styles.savedBanner}><CheckCircle size={14} /> Preferences saved</span>}
          <button className={styles.secondaryBtn} onClick={fetchData}><RefreshCw size={14} /> Refresh</button>
          <button className={styles.primaryBtn} onClick={handleSave} disabled={saving}>
            {saving ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={14} />}
            {saving ? 'Saving…' : 'Save Preferences'}
          </button>
        </div>
      </header>

      {/* Top Grid: Notifications + Security */}
      <div className={styles.topGrid}>
        {/* Notifications */}
        {notifications && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Bell size={15} className={`${styles.cardIcon} ${styles.cardIconBlue}`} />
              <h3 className={styles.cardTitle}>Notification Settings</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.toggleList}>
                {([
                  { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive important updates via email' },
                  { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Critical alerts via SMS notifications' },
                  { key: 'inAppNotifications', label: 'In-App Notifications', desc: 'Bell icon alerts within the platform' },
                  { key: 'vendorOnboarding', label: 'Vendor Onboarding', desc: 'New vendor registration alerts' },
                  { key: 'documentExpiry', label: 'Document Expiry', desc: 'Alerts for expiring vendor documents' },
                  { key: 'invoiceApproval', label: 'Invoice Approvals', desc: 'Invoice pending review notifications' },
                  { key: 'paymentRelease', label: 'Payment Releases', desc: 'Payment disbursement confirmations' },
                  { key: 'kycAlerts', label: 'KYC & Compliance', desc: 'KYC screening and risk alerts' },
                  { key: 'contractRenewal', label: 'Contract Renewals', desc: 'Upcoming contract renewal reminders' },
                  { key: 'systemHealth', label: 'System Health', desc: 'Service uptime and error alerts' }
                ] as Array<{ key: keyof NotificationSettings; label: string; desc: string }>).map(item => (
                  <div key={item.key} className={styles.toggleRow}>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleLabel}>{item.label}</span>
                      <span className={styles.toggleDesc}>{item.desc}</span>
                    </div>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={notifications[item.key] as boolean}
                        onChange={() => handleToggleNotif(item.key)}
                      />
                      <span className={styles.slider} />
                    </label>
                  </div>
                ))}
                <div className={styles.toggleRow} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                  <div>
                    <div className={styles.toggleLabel}>Digest Frequency</div>
                    <div className={styles.toggleDesc}>How often to send summary digest emails</div>
                  </div>
                  <select
                    className={styles.select}
                    value={notifications.digestFrequency}
                    onChange={e => setNotifications(p => p ? { ...p, digestFrequency: e.target.value } : p)}
                    style={{ width: '100%', marginTop: 4 }}
                  >
                    <option>Real-time</option>
                    <option>Hourly</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security */}
        {security && (
          <div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Lock size={15} className={`${styles.cardIcon} ${styles.cardIconOrange}`} />
                <h3 className={styles.cardTitle}>Security & Access Policies</h3>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.toggleList}>
                  {([
                    { key: 'mfaEnabled', label: 'Multi-Factor Authentication (MFA)', desc: 'Require OTP for all logins' },
                    { key: 'ipWhitelistEnabled', label: 'IP Whitelist Enforcement', desc: 'Restrict access to approved IPs only' },
                    { key: 'auditLogsEnabled', label: 'Full Audit Logging', desc: 'Log all user actions for compliance' },
                    { key: 'ssoEnabled', label: 'SSO Integration', desc: 'Allow Single Sign-On via corporate IdP' }
                  ] as Array<{ key: keyof SecuritySettings; label: string; desc: string }>).map(item => (
                    <div key={item.key} className={styles.toggleRow}>
                      <div className={styles.toggleInfo}>
                        <span className={styles.toggleLabel}>{item.label}</span>
                        <span className={styles.toggleDesc}>{item.desc}</span>
                      </div>
                      <label className={styles.toggle}>
                        <input
                          type="checkbox"
                          checked={security[item.key] as boolean}
                          onChange={() => handleSecurityChange(item.key, !security[item.key as keyof SecuritySettings])}
                        />
                        <span className={styles.slider} />
                      </label>
                    </div>
                  ))}
                </div>

                <div className={styles.securityGrid} style={{ marginTop: 16 }}>
                  <div className={styles.securityItem}>
                    <label className={styles.label}><Clock size={10} /> Session Timeout (min)</label>
                    <input className={styles.input} type="number" value={security.sessionTimeout} onChange={e => handleSecurityChange('sessionTimeout', parseInt(e.target.value))} />
                  </div>
                  <div className={styles.securityItem}>
                    <label className={styles.label}><Zap size={10} /> Password Expiry (days)</label>
                    <input className={styles.input} type="number" value={security.passwordExpiryDays} onChange={e => handleSecurityChange('passwordExpiryDays', parseInt(e.target.value))} />
                  </div>
                  <div className={styles.securityItem}>
                    <label className={styles.label}><Shield size={10} /> Max Login Attempts</label>
                    <input className={styles.input} type="number" value={security.loginAttempts} onChange={e => handleSecurityChange('loginAttempts', parseInt(e.target.value))} />
                  </div>
                  <div className={styles.securityItem}>
                    <label className={styles.label}><FileText size={10} /> Data Retention (days)</label>
                    <input className={styles.input} type="number" value={security.dataRetentionDays} onChange={e => handleSecurityChange('dataRetentionDays', parseInt(e.target.value))} />
                  </div>
                  <div className={styles.securityItem} style={{ gridColumn: '1 / -1' }}>
                    <label className={styles.label}><Lock size={10} /> Data Encryption Standard</label>
                    <select className={styles.select} value={security.dataEncryption} onChange={e => handleSecurityChange('dataEncryption', e.target.value)}>
                      <option>AES-256</option>
                      <option>AES-128</option>
                      <option>TLS 1.3</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Integrations */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Link size={15} className={`${styles.cardIcon} ${styles.cardIconGreen}`} />
          <h3 className={styles.cardTitle}>Integration Hub ({integrations.filter(i => i.status === 'Connected').length}/{integrations.length} Connected)</h3>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.intList}>
            {integrations.map(int => (
              <div key={int.id} className={styles.intItem}>
                <div className={styles.intLeft}>
                  <div className={`${styles.intIcon} ${int.status === 'Connected' ? styles.intIconGreen : styles.intIconOrange}`}>
                    {INT_ICONS[int.category] || 'API'}
                  </div>
                  <div>
                    <div className={styles.intName}>{int.name}</div>
                    <div className={styles.intCat}>{int.category} · Uptime: {int.uptime}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={styles.intStatus}>
                    <span className={`${styles.statusDot} ${int.status === 'Connected' ? styles.dotGreen : styles.dotRed}`} />
                    <span className={`${styles.statusText} ${int.status === 'Connected' ? styles.textGreen : styles.textRed}`}>{int.status}</span>
                  </div>
                  <div className={styles.syncTime}>
                    Last sync: {new Date(int.lastSync).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <FileText size={15} className={`${styles.cardIcon} ${styles.cardIconPurple}`} />
          <h3 className={styles.cardTitle}>Settings Audit Log</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Action</th>
                <th>Performed By</th>
                <th>Role</th>
                <th>Timestamp</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.slice(0, 10).map(log => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#7c3aed' }}>{log.id}</td>
                  <td style={{ maxWidth: 280, color: '#1e293b' }}>{log.action}</td>
                  <td style={{ fontWeight: 600 }}>{log.performedBy}</td>
                  <td style={{ color: '#64748b' }}>{log.role}</td>
                  <td style={{ fontSize: '0.76rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </td>
                  <td>
                    <span className={`${styles.severityBadge} ${severityClass(log.severity)}`}>{log.severity}</span>
                  </td>
                  <td style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.8rem' }}>{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
