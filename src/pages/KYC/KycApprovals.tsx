import React, { useState } from 'react';
import { Search, ChevronRight, CheckCircle2, XCircle, Send } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import { useNavigate } from 'react-router-dom';
import styles from './KycApprovals.module.css';

const pendingApprovals = [
  { id: 'VND-0001248', name: 'TECH SOLUTIONS PVT LTD', date: '12 May 2025', active: true },
  { id: 'VND-0001247', name: 'ABC FACILITY SERVICES', date: '11 May 2025', active: false },
  { id: 'VND-0001246', name: 'XYZ INFRASTRUCTURE LTD', date: '10 May 2025', active: false },
  { id: 'VND-0001245', name: 'GLOBAL SECURITY SERVICES', date: '10 May 2025', active: false },
];

export const KycApprovals: React.FC = () => {
  const [remarks, setRemarks] = useState('');
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Approval (Checker View)</h1>
          <p className={styles.subtitle}>Review and take action on submitted KYC due diligence.</p>
        </div>
      </header>

      <div className={styles.splitLayout}>
        {/* Left Pane - List */}
        <Card className={styles.listCard}>
          <div className={styles.listHeader}>
            <h3>Pending KYC Approvals</h3>
            <Badge variant="info">76</Badge>
          </div>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input type="text" placeholder="Search vendors..." className={styles.searchInput} />
          </div>
          
          <div className={styles.listContainer}>
            {pendingApprovals.map(item => (
              <div key={item.id} className={`${styles.listItem} ${item.active ? styles.listActive : ''}`}>
                <div className={styles.itemContent}>
                  <span className={styles.itemName}>{item.name}</span>
                  <div className={styles.itemMeta}>
                    <span className={styles.itemId}>{item.id}</span>
                    <span className={styles.itemDate}>{item.date}</span>
                  </div>
                </div>
                {item.active && <ChevronRight size={18} color="#1d4ed8" />}
              </div>
            ))}
          </div>
          <div className={styles.pagination}>
            <span>Showing 1 to 4 of 76</span>
          </div>
        </Card>

        {/* Right Pane - Detail */}
        <div className={styles.detailPane}>
          <Card className={styles.detailCard}>
            <div className={styles.detailHeader}>
              <h3 className={styles.detailTitle}>Vendor Details</h3>
            </div>
            
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Overall Risk</span>
                <span className={styles.infoValueGreen}>Low (20/100)</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>KYC Status</span>
                <span className={styles.infoValue}>Ready for Approval</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Last Checked On</span>
                <span className={styles.infoValue}>12 May 2025</span>
              </div>
            </div>

            <button 
              className={styles.viewFullLink} 
              onClick={() => navigate(`/kyc/${pendingApprovals[0].id}`)}
            >
              View Full Details &gt;
            </button>

            <h3 className={styles.actionTitle}>Action</h3>

            <div className={styles.actionButtons}>
              <Button className={styles.approveBtn} icon={<CheckCircle2 size={16} />}>Approve</Button>
              <Button className={styles.rejectBtn} icon={<XCircle size={16} />}>Reject</Button>
              <Button className={styles.sendBackBtn} icon={<Send size={16} />}>Send Back</Button>
            </div>

            <div className={styles.remarksSection}>
              <label className={styles.remarksLabel}>Remarks (Required for Reject / Send Back)</label>
              <textarea 
                className={styles.remarksInput} 
                placeholder="Enter remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              ></textarea>
              <span className={styles.remarksHint}>Comments will be visible to maker.</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
