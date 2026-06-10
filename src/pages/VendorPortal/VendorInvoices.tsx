import React, { useState } from 'react';
import { Receipt, Plus } from 'lucide-react';
import { useVendorInvoices, useVendorPOs } from '../../hooks/useVendorPortal';
import { VendorInvoiceModal } from './VendorInvoiceModal';
import s from './vendor.module.css';

const stageBadge = (stage: string) => {
  if (stage === 'Payment Released' || stage === 'Paid') return <span className={s.badgeSuccess}>{stage}</span>;
  if (stage === 'Rejected') return <span className={s.badgeDanger}>{stage}</span>;
  if (stage === 'OCR Completed' || stage === 'Under Review') return <span className={s.badgeInfo}>{stage}</span>;
  return <span className={s.badgeWarning}>{stage}</span>;
};

export const VendorInvoices: React.FC = () => {
  const { data: invoices = [], isLoading, refetch: refetchInvoices } = useVendorInvoices();
  const { data: pos = [] } = useVendorPOs();
  const [showModal, setShowModal] = useState(false);

  const acknowledgedPOs = pos.filter(p => p.status === 'Acknowledged' || p.status === 'Delivered');

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
      {showModal && <VendorInvoiceModal po={null} allPOs={acknowledgedPOs} onClose={() => setShowModal(false)} onSuccess={() => { refetchInvoices(); setShowModal(false); }} />}

      <div className={s.pageHeader}>
        <div>
          <div className={s.pageTitle}>Invoices</div>
          <div className={s.pageSubtitle}>{invoices.length} invoices submitted</div>
        </div>
        <button className={s.btnPrimary} onClick={() => setShowModal(true)}>
          <Plus size={15} /> Submit Invoice
        </button>
      </div>

      <div className={s.card}>
        {invoices.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}><Receipt size={28} /></div>
            <div className={s.emptyTitle}>No invoices yet</div>
            <div className={s.emptyText}>Submit an invoice against an acknowledged PO to start the payment process.</div>
            <button className={s.btnPrimary} style={{ marginTop: 10 }} onClick={() => setShowModal(true)}>
              <Plus size={14} /> Submit First Invoice
            </button>
          </div>
        ) : (
          <div className={s.tableWrapper}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Invoice ID</th><th>PO Ref</th><th>Amount (₹)</th>
                  <th>Submit Date</th><th>Verification Stage</th><th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.invoiceId}>
                    <td>{inv.invoiceId}</td>
                    <td>{inv.poId}</td>
                    <td>₹{inv.amount.toLocaleString('en-IN')}</td>
                    <td>{inv.submitDate}</td>
                    <td>{stageBadge(inv.verificationStage)}</td>
                    <td>
                      {inv.paymentStatus === 'Paid'
                        ? <span className={s.badgeSuccess}>{inv.paymentStatus}</span>
                        : <span className={s.badgeWarning}>{inv.paymentStatus}</span>}
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
