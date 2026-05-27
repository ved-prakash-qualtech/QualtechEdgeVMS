import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert,
  Coins,
  FileCode2,
  TrendingDown,
  Merge
} from 'lucide-react';
import { CatalogueHeader } from './CatalogueHeader';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';
import styles from './AiRecommendations.module.css';

interface AiAlert {
  id: string;
  type: 'duplicate' | 'tax' | 'savings';
  title: string;
  matchPct?: number;
  severity: 'danger' | 'warning' | 'success';
  description: string;
  details: { label: string; value: string }[];
  actionLabel: string;
}

const INITIAL_ALERTS: AiAlert[] = [
  {
    id: 'AI-001',
    type: 'duplicate',
    title: 'Duplicate Catalogue Entries (92% Match Detected)',
    matchPct: 92,
    severity: 'warning',
    description: 'Our LLM-powered catalog parser detected two entries in Office Supplies that have identical attributes but different names.',
    details: [
      { label: 'Existing Entry A', value: 'Ergonomic Mesh Chair (CAT-003)' },
      { label: 'New Entry B', value: 'Comfort Seating Chair (Draft - CAT-098)' },
      { label: 'Matching Specs', value: 'Height adjust, gas cylinder, dual-wheel casters, armrest specs match 100%' },
      { label: 'Category', value: 'Office Supplies / Seating' }
    ],
    actionLabel: 'Merge Items & Map Alternate Vendor'
  },
  {
    id: 'AI-002',
    type: 'tax',
    title: 'HSN Tax Mapping Mismatch',
    severity: 'danger',
    description: 'GST validation crawler flagged a tax code mismatch. IT Hardware category matches standard 18% GST, but 2 newly mapped services have been tagged under 12%.',
    details: [
      { label: 'Mismatched Item', value: 'Annual Security Audit Service (CAT-002)' },
      { label: 'Configured Rate', value: 'GST 12% (CGST 6% / SGST 6%)' },
      { label: 'Statutory GST Rate', value: 'GST 18% (SAC 998311 - Information Technology Services)' },
      { label: 'Compliance Audit Impact', value: 'High Risk (Potential penalty on incorrect invoice input credits)' }
    ],
    actionLabel: 'Update GST Mapping to Statutory 18%'
  },
  {
    id: 'AI-003',
    type: 'savings',
    title: 'Contract Rate Leakage / Sourcing Savings (6.6% Potential)',
    severity: 'success',
    description: 'Alternative pre-approved vendor offers a lower unit price on an identical item specification sheet matching current procurement guidelines.',
    details: [
      { label: 'Item Name', value: 'Dell Latitude 5420 Laptop (CAT-001)' },
      { label: 'Current Provider Rate', value: 'Tech Solutions Ltd - ₹74,900' },
      { label: 'Alternative AVL Provider Rate', value: 'ABC Infotech Pvt Ltd - ₹72,500' },
      { label: 'Estimated Annual Savings', value: '₹2,40,000 (Based on forecasted demand of 100 units)' }
    ],
    actionLabel: 'Update Preferred Sourcing to ABC Infotech'
  }
];

export const AiRecommendations: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<AiAlert[]>(INITIAL_ALERTS);

  const handleApply = (id: string, actionText: string) => {
    alert(`Applying AI Recommendation: ${actionText}`);
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleDismiss = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className={styles.container}>
      <CatalogueHeader 
        title="AI RECOMMENDED PROCUREMENT INSIGHTS" 
        subtitle="LLM-driven analysis scans your items and services to identify duplicates, correct HSN tax anomalies, and find cost savings opportunities"
        actions={
          <Button variant="outline" icon={<ArrowLeft size={16} />} onClick={() => navigate('/catalogue/dashboard')}>
            Back to Dashboard
          </Button>
        }
      />

      <div className={styles.insightGrid}>
        {alerts.map(alert => {
          let cardTypeClass = styles.insightCardWarning;
          let icon = <AlertTriangle size={20} />;

          if (alert.severity === 'danger') {
            cardTypeClass = styles.insightCardDanger;
            icon = <ShieldAlert size={20} />;
          } else if (alert.severity === 'success') {
            cardTypeClass = styles.insightCardSuccess;
            icon = <Coins size={20} />;
          }

          if (alert.type === 'duplicate') icon = <Merge size={20} />;
          else if (alert.type === 'tax') icon = <FileCode2 size={20} />;
          else if (alert.type === 'savings') icon = <TrendingDown size={20} />;

          return (
            <div key={alert.id} className={`${styles.insightCard} ${cardTypeClass}`}>
              <div className={styles.insightHeader}>
                <div className={styles.insightTitleContainer}>
                  <div className={styles.insightIcon} style={{ color: alert.severity === 'danger' ? '#dc2626' : alert.severity === 'success' ? '#16a34a' : '#d97706' }}>
                    {icon}
                  </div>
                  <h3 className={styles.insightTitle}>{alert.title}</h3>
                </div>
                {alert.matchPct && (
                  <Badge variant="warning" className={styles.matchBadge}>
                    {alert.matchPct}% Match
                  </Badge>
                )}
              </div>

              <div className={styles.insightBody}>
                <p>{alert.description}</p>

                <div className={styles.detailMatrix}>
                  {alert.details.map((detail, idx) => (
                    <div key={idx} className={styles.matrixItem}>
                      <span className={styles.matrixLabel}>{detail.label}</span>
                      <span className={styles.matrixValue}>{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.actionRow}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDismiss(alert.id)}
                >
                  Dismiss Insight
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  icon={<Sparkles size={14} />}
                  onClick={() => handleApply(alert.id, alert.actionLabel)}
                >
                  {alert.actionLabel}
                </Button>
              </div>
            </div>
          );
        })}

          {alerts.length === 0 && (
            <Card style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <Sparkles size={48} style={{ color: 'var(--color-success)', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0b1f5f' }}>All Insights Addressed</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px', fontSize: '14px' }}>
                Your procurement catalog is fully optimized. The AI engine is running scans in the background.
              </p>
              <Button style={{ marginTop: '16px' }} onClick={() => setAlerts(INITIAL_ALERTS)}>
                Reset Mock Insights
              </Button>
            </Card>
          )}
      </div>
    </div>
  );
};
