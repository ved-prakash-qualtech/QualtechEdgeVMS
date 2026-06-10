import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertTriangle, HelpCircle, ArrowRight, Bell, Package, FileText } from 'lucide-react';
import {
  useVendorDashboard, useVendorPOs, useVendorDocuments,
  useVendorNotifications, useAcknowledgePO, useMarkNotificationsRead,
} from '../../hooks/useVendorPortal';
import { VendorOnboarding } from './VendorOnboarding';
import { useVendorProfile } from '../../hooks/useVendorPortal';
import s from './vendor.module.css';

const statusBadge = (status: string) => {
  if (['Verified', 'Delivered', 'Invoiced'].includes(status)) return <span className={s.badgeSuccess}>{status}</span>;
  if (['Expired', 'Rejected'].includes(status)) return <span className={s.badgeDanger}>{status}</span>;
  if (status === 'Acknowledged') return <span className={s.badgeInfo}>{status}</span>;
  return <span className={s.badgeWarning}>{status}</span>;
};

export const VendorOverview: React.FC = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { data: profile } = useVendorProfile();
  const { data: stats, isLoading: statsLoading } = useVendorDashboard();
  const { data: pos = [], isLoading: posLoading } = useVendorPOs();
  const { data: docs = [] } = useVendorDocuments();
  const { data: notifs = [] } = useVendorNotifications();

  const ackMutation = useAcknowledgePO();
  const readMutation = useMarkNotificationsRead();

  // Show onboarding wizard if not yet completed
  React.useEffect(() => {
    if (profile && profile.onboardingComplete === false) {
      setShowOnboarding(true);
    }
  }, [profile]);

  const unreadNotifs = notifs.filter(n => !n.read);

  if (statsLoading || posLoading) {
    return (
      <div className={s.page}>
        <div className={s.kpiGrid}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={s.kpiCard}>
              <div className={s.kpiIcon} style={{ background: 'var(--color-surface-2)' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className={s.skeleton} style={{ height: 10, width: '60%' }} />
                <div className={s.skeleton} style={{ height: 22, width: '40%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {showOnboarding && <VendorOnboarding onClose={() => setShowOnboarding(false)} />}

      <div className={s.page}>
        {/* KPI Cards */}
        <div className={s.kpiGrid}>
          <div className={s.kpiCard}>
            <div className={s.kpiIcon} style={{ background: '#fef3c7', color: '#d97706' }}><Clock size={22} /></div>
            <div className={s.kpiBody}>
              <div className={s.kpiLabel}>Pending POs</div>
              <div className={s.kpiValue} style={{ color: '#d97706' }}>{stats?.pendingPOs ?? 0}</div>
              <div className={s.kpiSub}>Require acknowledgement</div>
            </div>
          </div>

          <div className={s.kpiCard}>
            <div className={s.kpiIcon} style={{ background: 'var(--color-success-bg)', color: 'var(--color-success-text)' }}><CheckCircle size={22} /></div>
            <div className={s.kpiBody}>
              <div className={s.kpiLabel}>Paid Invoices</div>
              <div className={s.kpiValue} style={{ color: 'var(--color-success)' }}>{stats?.paidInvoices ?? 0}</div>
              <div className={s.kpiSub}>Cleared this cycle</div>
            </div>
          </div>

          <div className={s.kpiCard}>
            <div className={s.kpiIcon} style={{
              background: (stats?.expiredDocuments ?? 0) > 0 ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
              color: (stats?.expiredDocuments ?? 0) > 0 ? 'var(--color-danger)' : 'var(--color-success)',
            }}><AlertTriangle size={22} /></div>
            <div className={s.kpiBody}>
              <div className={s.kpiLabel}>Compliance Health</div>
              <div className={s.kpiValue} style={{ color: (stats?.expiredDocuments ?? 0) > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                {stats?.expiredDocuments ?? 0} Expired
              </div>
              <div className={s.kpiSub}>Documents need renewal</div>
            </div>
          </div>

          <div className={s.kpiCard}>
            <div className={s.kpiIcon} style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}><HelpCircle size={22} /></div>
            <div className={s.kpiBody}>
              <div className={s.kpiLabel}>Open Tickets</div>
              <div className={s.kpiValue} style={{ color: 'var(--color-info)' }}>{stats?.activeTickets ?? 0}</div>
              <div className={s.kpiSub}>Awaiting response</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
          {/* Recent POs */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <div className={s.cardTitle}><Package size={16} /> Latest Purchase Orders</div>
              <button className={s.btnGhost} onClick={() => navigate('/vendor/purchase-orders')}>View All <ArrowRight size={13} /></button>
            </div>
            {pos.length === 0 ? (
              <div className={s.emptyState}>
                <div className={s.emptyIcon}><Package size={24} /></div>
                <div className={s.emptyTitle}>No purchase orders yet</div>
                <div className={s.emptyText}>POs issued to you will appear here.</div>
              </div>
            ) : (
              <div className={s.tableWrapper}>
                <table className={s.table}>
                  <thead><tr><th>PO Ref</th><th>Date</th><th>Value</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {pos.slice(0, 4).map(po => (
                      <tr key={po.poId}>
                        <td>{po.poId}</td>
                        <td>{po.issueDate}</td>
                        <td>₹{po.value.toLocaleString('en-IN')}</td>
                        <td>{statusBadge(po.status)}</td>
                        <td>
                          {(po.status === 'Pending Acknowledgement' || po.status === 'Pending Acknowledgment') ? (
                            <button
                              className={s.btnPrimary}
                              style={{ padding: '5px 10px', fontSize: 11 }}
                              disabled={ackMutation.isPending}
                              onClick={() => ackMutation.mutate(po.poId)}
                            >
                              Acknowledge
                            </button>
                          ) : <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Doc health */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <div className={s.cardTitle}><FileText size={16} /> Compliance Documents</div>
              <button className={s.btnGhost} onClick={() => navigate('/vendor/documents')}>Manage <ArrowRight size={13} /></button>
            </div>
            {docs.length === 0 ? (
              <div className={s.emptyState}>
                <div className={s.emptyIcon}><FileText size={24} /></div>
                <div className={s.emptyTitle}>No documents uploaded</div>
                <div className={s.emptyText}>Upload compliance documents to get verified.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {docs.map(doc => (
                  <div key={doc.documentId} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px', border: '1px solid var(--color-border)',
                    borderRadius: 8, background: 'var(--color-surface-2)',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{doc.documentName}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                        {doc.documentType} · Expiry: {doc.expiryDate || 'N/A'}
                      </div>
                    </div>
                    {statusBadge(doc.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        {notifs.length > 0 && (
          <div className={s.card}>
            <div className={s.cardHeader}>
              <div className={s.cardTitle}>
                <Bell size={16} /> Notifications & Alerts
                {unreadNotifs.length > 0 && (
                  <span style={{ background: '#dc2626', color: 'white', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 10, marginLeft: 4 }}>
                    {unreadNotifs.length} new
                  </span>
                )}
              </div>
              {unreadNotifs.length > 0 && (
                <button
                  className={s.btnOutline}
                  style={{ fontSize: 12, padding: '5px 12px' }}
                  disabled={readMutation.isPending}
                  onClick={() => readMutation.mutate()}
                >
                  Mark All Read
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
              {notifs.slice(0, 8).map(n => (
                <div key={n.notificationId} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  padding: '10px 14px', borderRadius: 8, fontSize: 13,
                  background: n.read ? 'var(--color-surface-2)' : 'var(--color-info-bg)',
                  borderLeft: n.read ? '3px solid var(--color-border)' : '3px solid var(--color-primary)',
                }}>
                  <span style={{ color: 'var(--color-text-primary)' }}>{n.message}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap', marginLeft: 12 }}>{n.createdDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
