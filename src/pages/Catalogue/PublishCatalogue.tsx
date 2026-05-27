import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Globe, 
  GitBranch, 
  ShieldAlert,
  Server
} from 'lucide-react';
import { CatalogueHeader } from './CatalogueHeader';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';
import styles from './PublishCatalogue.module.css';

interface PublishLog {
  version: string;
  date: string;
  environment: 'Staging' | 'Production ERP';
  publisher: string;
  itemsPublished: number;
  status: 'Successful' | 'Failed';
}

const PUBLISH_LOGS_MOCK: PublishLog[] = [
  {
    version: 'v4.2.0',
    date: '10 May 2026 11:30 AM',
    environment: 'Production ERP',
    publisher: 'Neha Sharma',
    itemsPublished: 124,
    status: 'Successful'
  },
  {
    version: 'v4.2.0-rc1',
    date: '08 May 2026 04:15 PM',
    environment: 'Staging',
    publisher: 'Neha Sharma',
    itemsPublished: 124,
    status: 'Successful'
  },
  {
    version: 'v4.1.2',
    date: '01 May 2026 09:00 AM',
    environment: 'Production ERP',
    publisher: 'Neha Sharma',
    itemsPublished: 110,
    status: 'Successful'
  }
];

export const PublishCatalogue: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<PublishLog[]>(PUBLISH_LOGS_MOCK);
  const [uatLoading, setUatLoading] = useState(false);
  const [prodLoading, setProdLoading] = useState(false);

  const handlePublish = (env: 'Staging' | 'Production ERP') => {
    if (env === 'Staging') {
      setUatLoading(true);
      setTimeout(() => {
        setUatLoading(false);
        const newLog: PublishLog = {
          version: 'v4.3.0-rc1',
          date: new Date().toLocaleString(),
          environment: 'Staging',
          publisher: 'Neha Sharma (You)',
          itemsPublished: 15,
          status: 'Successful'
        };
        setLogs([newLog, ...logs]);
        alert("Successfully published version v4.3.0-rc1 to Staging/UAT server environment!");
      }, 1500);
    } else {
      const confirmPublish = window.confirm("Are you sure you want to release v4.3.0 to Production ERP? This will sync price references immediately.");
      if (confirmPublish) {
        setProdLoading(true);
        setTimeout(() => {
          setProdLoading(false);
          const newLog: PublishLog = {
            version: 'v4.3.0',
            date: new Date().toLocaleString(),
            environment: 'Production ERP',
            publisher: 'Neha Sharma (You)',
            itemsPublished: 15,
            status: 'Successful'
          };
          setLogs([newLog, ...logs]);
          alert("Version v4.3.0 successfully published and synced with Core ERP Database!");
        }, 2000);
      }
    }
  };

  return (
    <div className={styles.container}>
      <CatalogueHeader 
        title="PUBLISH & RELEASE CATALOGUE" 
        subtitle="Version-control your item configurations and release updates to Staging or Production ERP environments"
        actions={
          <Button variant="outline" icon={<ArrowLeft size={16} />} onClick={() => navigate('/catalogue/dashboard')}>
            Back to Dashboard
          </Button>
        }
      />

      <div className={styles.publishGrid}>
        {/* Release Summary Details */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <span>Pending Version Release Summary</span>
            <Badge variant="warning">Ready to Release</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Target Release Version</span>
            <div className={styles.versionBadge}>v4.3.0</div>
          </div>

          <div className={styles.detailsList}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>New Items Configured</span>
              <span className={styles.detailValue}>2 Items</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>New Services Mapped</span>
              <span className={styles.detailValue}>1 Service</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Rate Updates Pending Sync</span>
              <span className={styles.detailValue}>12 Price Lines</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Quality Standards Configured</span>
              <span className={styles.detailValue}>4 Quality Rules</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Maker-Checker Status</span>
              <span className={styles.detailValue} style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>
                100% Signed Off
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', backgroundColor: '#eaf2ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#0b1f5f' }}>
            <GitBranch size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-primary)' }} />
            <div>
              <strong>Version Info:</strong> Release branch includes standard rate revisions, IT hardware procurement code tags, and mapped compliance checkpoints.
            </div>
          </div>
        </div>

        {/* Action Panel for releasing */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <span>Release Environments</span>
          </div>

          <div className={styles.actionPanel}>
            <button 
              className={`${styles.publishButton} ${styles.btnUat}`}
              disabled={uatLoading}
              onClick={() => handlePublish('Staging')}
            >
              <Server size={18} />
              <span>{uatLoading ? "Publishing..." : "Publish to Staging/UAT"}</span>
            </button>

            <button 
              className={`${styles.publishButton} ${styles.btnProd}`}
              disabled={prodLoading}
              onClick={() => handlePublish('Production ERP')}
            >
              <Globe size={18} />
              <span>{prodLoading ? "Syncing ERP..." : "Publish to Production"}</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            <ShieldAlert size={16} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
            <span>Publishing to production syncs catalogue rates immediately with active procurement purchase orders. Ensure L1 audit values are correct.</span>
          </div>
        </div>
      </div>

      {/* Release Audit History */}
      <Card className={styles.card} style={{ marginTop: '8px' }}>
        <div className={styles.cardTitle}>
          <span>Publish & Sync Audit Log</span>
          <Badge variant="info">Trace History</Badge>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className={styles.auditTable}>
            <thead>
              <tr>
                <th className={styles.auditTh}>Version</th>
                <th className={styles.auditTh}>Environment</th>
                <th className={styles.auditTh}>Publish Date & Time</th>
                <th className={styles.auditTh}>Published By</th>
                <th className={styles.auditTh}>Items Synced</th>
                <th className={styles.auditTh}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td className={styles.auditTd} style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{log.version}</td>
                  <td className={styles.auditTd}>
                    <Badge variant={log.environment === 'Staging' ? 'default' : 'info'}>
                      {log.environment}
                    </Badge>
                  </td>
                  <td className={styles.auditTd}>{log.date}</td>
                  <td className={styles.auditTd}>{log.publisher}</td>
                  <td className={styles.auditTd} style={{ fontWeight: '600' }}>{log.itemsPublished} Lines</td>
                  <td className={styles.auditTd}>
                    <span style={{ color: log.status === 'Successful' ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 'bold' }}>
                      {log.status}
                    </span>
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
