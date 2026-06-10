import React, { useState } from 'react';
import { FileSignature, Download, AlertTriangle, PenLine, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVendorContracts, useSubmitTicket } from '../../hooks/useVendorPortal';
import s from './vendor.module.css';

const statusBadge = (status: string) => {
  if (status === 'Active') return <span className={s.badgeSuccess}>{status}</span>;
  if (status === 'Expired' || status === 'Terminated') return <span className={s.badgeDanger}>{status}</span>;
  return <span className={s.badgeWarning}>{status}</span>;
};

const riskBadge = (risk: string) => {
  if (risk === 'Low') return <span className={s.badgeSuccess}>{risk}</span>;
  if (risk === 'High') return <span className={s.badgeDanger}>{risk}</span>;
  return <span className={s.badgeWarning}>{risk}</span>;
};

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export const VendorContracts: React.FC = () => {
  const { t } = useTranslation();
  const { data: contracts = [], isLoading } = useVendorContracts();
  const submitTicket = useSubmitTicket();
  const [requestedRenewal, setRequestedRenewal] = useState<Set<string>>(new Set());

  const handleRequestRenewal = async (contractId: string, contractName: string) => {
    await submitTicket.mutateAsync({
      category: 'Other',
      subject: `Contract Renewal Request — ${contractName}`,
      description: `Please initiate renewal for contract ID ${contractId} (${contractName}). It is expiring soon.`,
    });
    setRequestedRenewal(prev => new Set(prev).add(contractId));
  };

  if (isLoading) {
    return (
      <div className={s.page}>
        <div className={s.card}>
          {[1, 2].map(i => <div key={i} className={s.skeleton} style={{ height: 100, marginBottom: 12, borderRadius: 10 }} />)}
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <div className={s.pageTitle}>{t('contracts.title')}</div>
          <div className={s.pageSubtitle}>
            {contracts.length} contracts — {contracts.filter(c => c.status === 'Active').length} active
          </div>
        </div>
      </div>

      <div className={s.card}>
        {contracts.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}><FileSignature size={28} /></div>
            <div className={s.emptyTitle}>{t('contracts.noContracts')}</div>
            <div className={s.emptyText}>{t('contracts.noContractsDesc')}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {contracts.map(c => {
              const days = c.expiryDate ? daysUntil(c.expiryDate) : null;
              const expiringSoon = days !== null && days <= 30 && days > 0;
              const expired = days !== null && days <= 0;
              const renewed = requestedRenewal.has(c.contractId);

              return (
                <div key={c.contractId} style={{
                  border: `1px solid ${expiringSoon || expired ? 'var(--color-warning)' : 'var(--color-border)'}`,
                  borderRadius: 10,
                  background: expiringSoon || expired ? 'var(--color-warning-bg)' : 'var(--color-surface-2)',
                  overflow: 'hidden',
                }}>
                  {/* Expiry alert banner */}
                  {(expiringSoon || expired) && (
                    <div style={{
                      padding: '8px 18px', background: expired ? 'var(--color-danger-bg)' : '#fef3c7',
                      display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
                      color: expired ? 'var(--color-danger)' : 'var(--color-warning)',
                      borderBottom: '1px solid var(--color-border)', fontWeight: 600,
                    }}>
                      <AlertTriangle size={14} />
                      {expired
                        ? `Contract expired ${Math.abs(days!)} day${Math.abs(days!) !== 1 ? 's' : ''} ago`
                        : `${t('contracts.expiresIn')} ${days} ${t('contracts.days')}`}
                    </div>
                  )}

                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                          {c.contractName}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                          <span>{c.contractType}</span>
                          <span>Dept: {c.department}</span>
                          <span>{c.effectiveDate} → {c.expiryDate}</span>
                          <span>₹{(c.contractValue ?? 0).toLocaleString('en-IN')} {c.currency}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {riskBadge(c.riskLevel)}
                        {statusBadge(c.status)}
                        {(c.uploadedFiles?.length ?? 0) > 0 && (
                          <button className={s.btnGhost} style={{ padding: '5px 10px', fontSize: 12 }} aria-label="View contract document">
                            <Download size={13} /> {t('contracts.viewDoc')}
                          </button>
                        )}
                        {/* Sprint 5: E-sign stub */}
                        {c.status === 'Active' && (
                          <button className={s.btnOutline} style={{ padding: '5px 10px', fontSize: 12 }}
                            aria-label="E-sign this contract"
                            onClick={() => alert('E-signature integration (SignDesk) coming in Sprint 5')}>
                            <PenLine size={12} /> {t('contracts.esign')}
                          </button>
                        )}
                        {/* Renewal request */}
                        {(expiringSoon || expired) && (
                          <button
                            className={s.btnPrimary}
                            style={{ padding: '5px 12px', fontSize: 12 }}
                            disabled={submitTicket.isPending || renewed}
                            onClick={() => handleRequestRenewal(c.contractId, c.contractName)}>
                            <RefreshCw size={12} />
                            {renewed ? 'Renewal Requested' : t('contracts.requestRenewal')}
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 20, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                      <span>Payment: {c.paymentTerms}</span>
                      <span>Billing: {c.billingFrequency}</span>
                      {days !== null && days > 0 && <span style={{ color: expiringSoon ? 'var(--color-warning)' : 'inherit' }}>Expires: {days} days</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
