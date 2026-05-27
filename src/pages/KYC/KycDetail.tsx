import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Clock
} from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './KycDetail.module.css';

const TABS = ['Basic Info', 'Documents', 'Due Diligence Checks', 'Comments', 'History'];

const CHECKS = [
  { id: 'pan', name: 'PAN Verification', desc: 'Valid', status: 'Completed', date: '12 May 2025' },
  { id: 'gst', name: 'GST Verification', desc: 'Valid', status: 'Completed', date: '12 May 2025' },
  { id: 'cin', name: 'CIN / Incorporation Check', desc: 'Valid', status: 'Completed', date: '12 May 2025' },
  { id: 'bank', name: 'Bank Account Verification', desc: 'Valid', status: 'In Progress', date: '-' },
  { id: 'pep', name: 'PEP Check', desc: 'No Match Found', status: 'Pending', date: '-' },
  { id: 'sanctions', name: 'Sanctions Screening', desc: 'No Match Found', status: 'Pending', date: '-' },
  { id: 'media', name: 'Adverse Media Check', desc: 'No Negative News Found', status: 'Pending', date: '-' },
  { id: 'shell', name: 'Shell Company Check', desc: 'Valid', status: 'Pending', date: '-' },
  { id: 'roc', name: 'ROC / MCA Check', desc: 'Active', status: 'Pending', date: '-' },
  { id: 'itr', name: 'ITR / Financial Check', desc: 'FY 2023-24 Verified', status: 'Pending', date: '-' },
];

export const KycDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Due Diligence Checks');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <CheckCircle2 size={64} color="#16a34a" />
          </div>
          <h2 className={styles.successTitle}>KYC Assessment Submitted!</h2>
          <p className={styles.successDesc}>The due diligence report has been forwarded to the checker for approval.</p>
          <div className={styles.successActions}>
            <Button onClick={() => navigate('/kyc')}>Back to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/kyc')}>
            <ChevronLeft size={16} /> Back to KYC Dashboard
          </button>
          <h1 className={styles.title}>KYC Detail View</h1>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" className={styles.rejectBtn}>Reject</Button>
          <Button>Approve</Button>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.mainCol}>
          <Card className={styles.vendorHeaderCard}>
            <div className={styles.vhTop}>
              <div>
                <h2 className={styles.vendorName}>TECH SOLUTIONS PVT LTD</h2>
                <span className={styles.vendorId}>{id || 'VND-0001248'} • IT Services</span>
              </div>
              <Badge variant="warning">Pending</Badge>
            </div>
            
            <div className={styles.tabsContainer}>
              {TABS.map(tab => (
                <button 
                  key={tab}
                  className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </Card>

          {activeTab === 'Due Diligence Checks' && (
            <Card className={styles.checksCard}>
              <div className={styles.checksHeader}>
                <h3 className={styles.sectionTitle}>Due Diligence Checks</h3>
                <Button variant="outline" size="sm">Run All Pending Checks</Button>
              </div>

              <div className={styles.checksList}>
                {CHECKS.map(check => (
                  <div key={check.id} className={styles.checkRow}>
                    <div className={styles.checkIcon}>
                      {check.status === 'Completed' ? <CheckCircle2 size={20} color="#16a34a" /> : 
                       check.status === 'In Progress' ? <Clock size={20} color="#0ea5e9" /> : 
                       <div className={styles.pendingCircle} />}
                    </div>
                    <div className={styles.checkInfo}>
                      <h4>{check.name}</h4>
                      <p>{check.desc}</p>
                    </div>
                    <div className={styles.checkStatusWrap}>
                      <span className={`${styles.checkStatus} ${
                        check.status === 'Completed' ? styles.statusCompleted : 
                        check.status === 'In Progress' ? styles.statusInProgress : 
                        styles.statusPendingText
                      }`}>{check.status}</span>
                      <span className={styles.checkDate}>{check.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.checksFooter}>
                <Button variant="outline">Send Back</Button>
                <Button>Proceed with Checks</Button>
              </div>
            </Card>
          )}

          {activeTab === 'Basic Info' && (
            <Card className={styles.placeholderCard}>
              Basic Information content goes here.
            </Card>
          )}

        </div>

        <div className={styles.sideCol}>
          <Card className={styles.riskCard}>
            <h3 className={styles.sectionTitle}>Risk Assessment</h3>
            
            <div className={styles.gaugeContainer}>
              <p className={styles.gaugeTitle}>Overall Risk Rating</p>
              {/* Fake semi-circle gauge */}
              <div className={styles.gauge}>
                <div className={styles.gaugeArc}></div>
                <div className={styles.gaugeNeedle}></div>
              </div>
              <div className={styles.gaugeScore}>
                <span className={styles.scoreText}>Low Risk</span>
                <span className={styles.scoreNumber}>20 / 100</span>
              </div>
            </div>

            <div className={styles.riskFactors}>
              <h4 className={styles.factorsTitle}>Risk Factors</h4>
              <div className={styles.factorRow}>
                <span>Business Risk</span>
                <span className={styles.factorScoreGreen}>15/100</span>
              </div>
              <div className={styles.factorRow}>
                <span>Financial Risk</span>
                <span className={styles.factorScoreGreen}>20/100</span>
              </div>
              <div className={styles.factorRow}>
                <span>Compliance Risk</span>
                <span className={styles.factorScoreGreen}>18/100</span>
              </div>
              <div className={styles.factorRow}>
                <span>Operational Risk</span>
                <span className={styles.factorScoreGreen}>25/100</span>
              </div>
            </div>

            <div className={styles.riskComments}>
              <label className={styles.inputLabel}>Risk Comments (Optional)</label>
              <textarea className={styles.textarea} placeholder="Low risk vendor. All checks cleared." defaultValue="Low risk vendor. All checks cleared."></textarea>
            </div>
            
            <Button className={styles.fullWidthBtn}>Next →</Button>
          </Card>

          <Card className={styles.submitCard}>
            <h3 className={styles.sectionTitle}>Review & Submit for Approval</h3>
            
            <div className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <span>Vendor Name</span>
                <strong>TECH SOLUTIONS PVT LTD</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Vendor Code</span>
                <strong>VND-0001248</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Category</span>
                <strong>IT Services</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Overall Risk Rating</span>
                <strong className={styles.greenText}>Low (20/100)</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>KYC Status</span>
                <strong>Ready for Approval</strong>
              </div>
            </div>

            <div className={styles.declaration}>
              <label className={styles.checkbox}>
                <input type="checkbox" defaultChecked /> 
                I confirm that due diligence has been performed and the information is true and correct.
              </label>
            </div>
            
            <div className={styles.submitActions}>
              <Button variant="ghost">Save Draft</Button>
              <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Submitting...' : 'Submit for Approval'}</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
