import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Link, RefreshCw, Key, ShieldAlert } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './IntegrationHubSettings.module.css';

const apiTokens = [
  { service: 'SAP S/4HANA Middleware Token', client: 'ERP Sourcing Agent', created: '10 April 2026', expires: '10 April 2027', status: 'Active' },
  { service: 'Vendor KYC Webhook Key', client: 'KYC Document Extractor', created: '01 May 2026', expires: '01 May 2027', status: 'Active' }
];

export const IntegrationHubSettings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/settings/dashboard')}>
            <ChevronLeft size={16} /> Back to Settings
          </button>
          <h1 className={styles.title}>Integration Hub & Middleware</h1>
          <p className={styles.subtitle}>Poll endpoint health statuses, manage client authentication credentials, and configure ERP integrations</p>
        </div>
        <Button icon={<RefreshCw size={16} />}>Check All Systems</Button>
      </header>

      <div className={styles.grid}>
        {/* Core Endpoints List */}
        <div className={styles.leftCol}>
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <Link size={18} className={styles.icon} />
              <h3>Middleware Connectivity Catalog</h3>
            </div>
            <div className={styles.hubGrid}>
              <div className={styles.hubCard}>
                <div className={styles.hubHeader}>
                  <strong>SAP ERP Connector</strong>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className={styles.hubDetails}>
                  <p>Endpoint: <code>https://sap.qualtech.in/api/v2</code></p>
                  <p>Average Latency: <strong>48ms</strong></p>
                </div>
              </div>

              <div className={styles.hubCard}>
                <div className={styles.hubHeader}>
                  <strong>Oracle Ledger sync</strong>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className={styles.hubDetails}>
                  <p>Endpoint: <code>https://oracle.qualtech.in/ledger</code></p>
                  <p>Average Latency: <strong>62ms</strong></p>
                </div>
              </div>

              <div className={styles.hubCard}>
                <div className={styles.hubHeader}>
                  <strong>GSTN Verification</strong>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className={styles.hubDetails}>
                  <p>Endpoint: <code>https://api.gstn.gov.in/v1</code></p>
                  <p>Average Latency: <strong>110ms</strong></p>
                </div>
              </div>

              <div className={styles.hubCard}>
                <div className={styles.hubHeader}>
                  <strong>Tally Prime local</strong>
                  <Badge variant="warning">Offline</Badge>
                </div>
                <div className={styles.hubDetails}>
                  <p>Endpoint: <code>http://192.168.1.45:9000</code></p>
                  <p>Average Latency: <strong>N/A</strong></p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sync logs and latency info */}
        <div className={styles.rightCol}>
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <ShieldAlert size={18} className={styles.icon} />
              <h3>Integrations Health Metrics</h3>
            </div>
            <div className={styles.metricWrapper}>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Daily API Requests</span>
                <strong className={styles.metricVal}>14,890</strong>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Error Rate</span>
                <strong className={styles.metricValRed}>0.04%</strong>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Average Latency</span>
                <strong className={styles.metricVal}>73ms</strong>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Generated Token Management */}
      <Card className={styles.tokenCard}>
        <div className={styles.tokenHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} className={styles.icon} />
            <h3 style={{ margin: 0 }}>API Client Tokens</h3>
          </div>
          <Button variant="outline" size="sm">Generate Client Token</Button>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Token Description</th>
                <th>Client System</th>
                <th>Created On</th>
                <th>Expires On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiTokens.map((token, index) => (
                <tr key={index}>
                  <td className={styles.tokenName}>{token.service}</td>
                  <td>{token.client}</td>
                  <td>{token.created}</td>
                  <td>{token.expires}</td>
                  <td>
                    <Badge variant="success">{token.status}</Badge>
                  </td>
                  <td>
                    <button className={styles.revokeBtn}>Revoke</button>
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
