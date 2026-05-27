import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './PublishDeploySettings.module.css';

const configVersions = [
  { version: 'v2.4.1', desc: 'Enforced MFA, whitelisted Noida IP range', date: 'Today, 10:45 AM', author: 'Neha Sharma', status: 'Active' },
  { version: 'v2.4.0', desc: 'Added 3-tier Invoice Approval rules for Facilities', date: '14 May 2026', author: 'Suresh Kumar', status: 'Archived' },
  { version: 'v2.3.9', desc: 'Updated HDFC Disbursal API endpoints', date: '08 May 2026', author: 'System Agent', status: 'Archived' }
];

export const PublishDeploySettings: React.FC = () => {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState({
    maker: true,
    integrations: true,
    mfa: true,
    backup: false
  });

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/settings/dashboard')}>
            <ChevronLeft size={16} /> Back to Settings
          </button>
          <h1 className={styles.title}>Publish & Configuration Deployment</h1>
          <p className={styles.subtitle}>Promote draft configurations to production, audit historical environment versions, and trigger instant rollbacks</p>
        </div>
        <Button disabled={!checklist.maker || !checklist.integrations || !checklist.mfa} icon={<ShieldCheck size={16} />}>
          Deploy to Production
        </Button>
      </header>

      {/* Promotion Pipeline */}
      <Card className={styles.stepperCard}>
        <h3 className={styles.sectionTitle}>Environment Promotion Status</h3>
        <div className={styles.stepperContainer}>
          <div className={styles.stepItem}>
            <div className={`${styles.stepCircle} ${styles.stepCircleActive}`}>1</div>
            <span className={styles.stepLabel}>Local Draft</span>
          </div>
          <ArrowRight size={14} className={styles.stepArrow} />
          <div className={styles.stepItem}>
            <div className={`${styles.stepCircle} ${styles.stepCircleActive}`}>2</div>
            <span className={styles.stepLabel}>Sandbox Test</span>
          </div>
          <ArrowRight size={14} className={styles.stepArrow} />
          <div className={styles.stepItem}>
            <div className={`${styles.stepCircle} ${styles.stepCircleActive}`}>3</div>
            <span className={styles.stepLabel}>Approved</span>
          </div>
          <ArrowRight size={14} className={styles.stepArrow} />
          <div className={styles.stepItem}>
            <div className={`${styles.stepCircle} ${styles.stepCirclePending}`}>4</div>
            <span className={styles.stepLabel}>Production Release</span>
          </div>
        </div>
      </Card>

      <div className={styles.grid}>
        {/* Pre-publication Checklist */}
        <Card className={styles.card}>
          <div className={styles.cardHeader}>
            <AlertCircle size={18} className={styles.icon} />
            <h3>Deployment Checklist Requirements</h3>
          </div>
          <div className={styles.checklist}>
            <label className={styles.checkItem}>
              <input 
                type="checkbox" 
                checked={checklist.maker} 
                onChange={e => setChecklist(prev => ({ ...prev, maker: e.target.checked }))} 
              />
              <div className={styles.checkText}>
                <strong>Maker-Checker Policy Verification</strong>
                <p>Confirm that configuration adjustments comply with administrative policies.</p>
              </div>
            </label>

            <label className={styles.checkItem}>
              <input 
                type="checkbox" 
                checked={checklist.integrations} 
                onChange={e => setChecklist(prev => ({ ...prev, integrations: e.target.checked }))} 
              />
              <div className={styles.checkText}>
                <strong>Integrations Verification</strong>
                <p>Verify that connected ERP and tax validator APIs poll successfully.</p>
              </div>
            </label>

            <label className={styles.checkItem}>
              <input 
                type="checkbox" 
                checked={checklist.mfa} 
                onChange={e => setChecklist(prev => ({ ...prev, mfa: e.target.checked }))} 
              />
              <div className={styles.checkText}>
                <strong>SSO & MFA Guard Check</strong>
                <p>Enforce strict security parameters prior to publication.</p>
              </div>
            </label>

            <label className={styles.checkItem}>
              <input 
                type="checkbox" 
                checked={checklist.backup} 
                onChange={e => setChecklist(prev => ({ ...prev, backup: e.target.checked }))} 
              />
              <div className={styles.checkText}>
                <strong>State Backup Logs (Optional)</strong>
                <p>Save config backup point to cloud storage prior to promotion.</p>
              </div>
            </label>
          </div>
        </Card>

        {/* Deploy Settings info details */}
        <Card className={styles.card}>
          <div className={styles.cardHeader}>
            <RefreshCw size={18} className={styles.icon} />
            <h3>Active Version Parameters</h3>
          </div>
          <div className={styles.infoWrapper}>
            <div className={styles.infoRow}>
              <span>Active Sourcing Release</span>
              <strong>v2.4.1 (Published)</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Environment Target</span>
              <strong>Qualtech-Edge-VMS-Prod</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Last Sync Pipeline</span>
              <strong>Today, 10:45 AM</strong>
            </div>
          </div>
        </Card>
      </div>

      {/* Deployment Version History */}
      <Card className={styles.historyCard}>
        <div className={styles.historyHeader}>
          <h3>Historical Configuration Deployment Auditing</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Configuration Version</th>
                <th>Change Overview Summary</th>
                <th>Published Timestamp</th>
                <th>Super Administrator</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {configVersions.map((v, index) => (
                <tr key={index}>
                  <td className={styles.versionNum}>{v.version}</td>
                  <td>{v.desc}</td>
                  <td>{v.date}</td>
                  <td>{v.author}</td>
                  <td>
                    <Badge variant={v.status === 'Active' ? 'success' : 'default'}>{v.status}</Badge>
                  </td>
                  <td>
                    {v.status !== 'Active' && <button className={styles.rollbackBtn}>Rollback</button>}
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
