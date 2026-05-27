import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './PaymentList.module.css';

const mockPayments = [
  { id: 'PAY-2026-0087', vendor: 'ABC Infotech Pvt Ltd', invoice: 'INV-2026-9908', amount: 1475000, mode: 'RTGS', status: 'Completed', utr: 'HDFCR520260512001', sched: '12 May 2026', processed: '12 May 2026', type: 'MSME' },
  { id: 'PAY-2026-0088', vendor: 'Secure Facilities Ltd', invoice: 'INV-2026-9907', amount: 531000, mode: 'RTGS', status: 'Completed', utr: 'HDFCR520260512002', sched: '12 May 2026', processed: '12 May 2026', type: 'Non-MSME' },
  { id: 'PAY-2026-0089', vendor: 'Fincons Consulting', invoice: 'INV-2026-9906', amount: 189000, mode: 'NEFT', status: 'Processing', utr: 'Awaiting Bank...', sched: '19 May 2026', processed: 'Pending', type: 'Non-MSME' },
  { id: 'PAY-2026-0090', vendor: 'Global Security Ltd', invoice: 'INV-2026-9905', amount: 241000, mode: 'IMPS', status: 'Failed', utr: 'REJECT-B2-09', sched: '18 May 2026', processed: 'Failed', type: 'Non-MSME' },
];

export const PaymentList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Completed' | 'Processing' | 'Failed' | 'MSME'>('All');
  const [search, setSearch] = useState('');

  const filteredPayments = mockPayments.filter(p => {
    if (activeTab === 'Completed' && p.status !== 'Completed') return false;
    if (activeTab === 'Processing' && p.status !== 'Processing') return false;
    if (activeTab === 'Failed' && p.status !== 'Failed') return false;
    if (activeTab === 'MSME' && p.type !== 'MSME') return false;
    
    return p.vendor.toLowerCase().includes(search.toLowerCase()) || 
           p.id.toLowerCase().includes(search.toLowerCase()) ||
           p.invoice.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Payment Audit & Ledger</h1>
          <p className={styles.subtitle}>Audit payouts, track UTR confirmations, and resolve banking exceptions</p>
        </div>
        <Button variant="outline" icon={<Download size={16} />}>Export Payments Log</Button>
      </header>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        {(['All', 'Completed', 'Processing', 'Failed', 'MSME'] as const).map(tab => (
          <button
            key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} Payments
          </button>
        ))}
      </div>

      <Card className={styles.tableCard}>
        {/* Controls */}
        <div className={styles.tableControls}>
          <div className={styles.searchWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search vendor name, payment ID or invoice ref..."
              className={styles.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" icon={<Filter size={16} />}>Advanced Filters</Button>
        </div>

        {/* Custom Data Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Vendor Name</th>
                <th>Invoice Ref</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>UTR Reference</th>
                <th>Scheduled Date</th>
                <th>Processed Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(p => (
                <tr key={p.id}>
                  <td className={styles.paymentId}>{p.id}</td>
                  <td>
                    <div className={styles.vendorNameCell}>
                      <span className={styles.vendorName}>{p.vendor}</span>
                      {p.type === 'MSME' && <span className={styles.msmeText}>MSME</span>}
                    </div>
                  </td>
                  <td>{p.invoice}</td>
                  <td className={styles.amount}>₹{p.amount.toLocaleString('en-IN')}</td>
                  <td>{p.mode}</td>
                  <td className={styles.utrCell}>{p.utr}</td>
                  <td>{p.sched}</td>
                  <td>{p.processed}</td>
                  <td>
                    <Badge 
                      variant={
                        p.status === 'Completed' ? 'success' : 
                        p.status === 'Processing' ? 'warning' : 'danger'
                      }
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      {p.status === 'Completed' && (
                        <button className={styles.actionBtn}>
                          <Download size={14} /> Advice
                        </button>
                      )}
                      {p.status === 'Failed' && (
                        <button className={styles.actionBtn} style={{ color: '#dc2626' }}>
                          Retry Payout
                        </button>
                      )}
                      {p.status === 'Processing' && (
                        <button className={styles.actionBtn}>
                          Track Node
                        </button>
                      )}
                    </div>
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
