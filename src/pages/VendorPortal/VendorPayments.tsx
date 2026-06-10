import React from 'react';
import { CreditCard, TrendingUp } from 'lucide-react';
import { useVendorPayments } from '../../hooks/useVendorPortal';
import s from './vendor.module.css';

export const VendorPayments: React.FC = () => {
  const { data: payments = [], isLoading } = useVendorPayments();

  const totalPaid = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);

  if (isLoading) {
    return (
      <div className={s.page}>
        <div className={s.card}>
          {[1, 2, 3].map(i => <div key={i} className={s.skeleton} style={{ height: 44, marginBottom: 8, borderRadius: 8 }} />)}
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <div className={s.pageTitle}>Payment History</div>
          <div className={s.pageSubtitle}>{payments.length} payments — ₹{totalPaid.toLocaleString('en-IN')} total received</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-success)' }}>
          <TrendingUp size={16} /> Total Paid: ₹{totalPaid.toLocaleString('en-IN')}
        </div>
      </div>

      <div className={s.card}>
        {payments.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}><CreditCard size={28} /></div>
            <div className={s.emptyTitle}>No payments yet</div>
            <div className={s.emptyText}>Cleared payments will appear here once your invoices are processed.</div>
          </div>
        ) : (
          <div className={s.tableWrapper}>
            <table className={s.table}>
              <thead>
                <tr><th>Payment ID</th><th>Invoice Ref</th><th>Amount (₹)</th><th>Payment Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.paymentId}>
                    <td>{p.paymentId}</td>
                    <td>{p.invoiceId}</td>
                    <td>₹{p.amount.toLocaleString('en-IN')}</td>
                    <td>{p.paymentDate}</td>
                    <td>
                      {p.status === 'Completed'
                        ? <span className={s.badgeSuccess}>{p.status}</span>
                        : p.status === 'Failed'
                          ? <span className={s.badgeDanger}>{p.status}</span>
                          : <span className={s.badgeWarning}>{p.status}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
