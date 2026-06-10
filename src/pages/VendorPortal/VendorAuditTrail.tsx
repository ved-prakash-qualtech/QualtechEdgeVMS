import React from 'react';
import { ClipboardList, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVendorAuditTrail } from '../../hooks/useVendorPortal';
import s from './vendor.module.css';

const actionColor = (action: string): string => {
  if (action.toLowerCase().includes('upload') || action.toLowerCase().includes('submit')) return 'var(--color-primary)';
  if (action.toLowerCase().includes('update') || action.toLowerCase().includes('profile')) return 'var(--color-info)';
  if (action.toLowerCase().includes('acknowledge')) return 'var(--color-success)';
  if (action.toLowerCase().includes('complete')) return '#7c3aed';
  return 'var(--color-text-tertiary)';
};

export const VendorAuditTrail: React.FC = () => {
  useTranslation();
  const { data: logs = [], isLoading } = useVendorAuditTrail();

  if (isLoading) {
    return (
      <div className={s.page}>
        <div className={s.card}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div className={s.skeleton} style={{ width: 10, height: 10, borderRadius: '50%', marginTop: 4, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className={s.skeleton} style={{ height: 12, width: '60%' }} />
                <div className={s.skeleton} style={{ height: 10, width: '35%', marginTop: 5 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <div className={s.pageTitle}><ShieldCheck size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Audit Trail</div>
          <div className={s.pageSubtitle}>Complete log of all actions on your vendor account</div>
        </div>
        <span className={s.badgeInfo}>{logs.length} entries</span>
      </div>

      <div className={s.card}>
        {logs.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}><ClipboardList size={28} /></div>
            <div className={s.emptyTitle}>No audit events yet</div>
            <div className={s.emptyText}>Actions like document uploads, PO acknowledgements, and profile updates will appear here.</div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: 9, top: 8, bottom: 8, width: 2, background: 'var(--color-border)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {logs.map((log, i) => (
                <div key={log.auditId ?? i} style={{ display: 'flex', gap: 16, paddingBottom: 18, position: 'relative' }}>
                  {/* Timeline dot */}
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: 'var(--color-surface)', border: `3px solid ${actionColor(log.action)}`,
                    zIndex: 1,
                  }} />
                  <div style={{ flex: 1, background: 'var(--color-surface-2)', borderRadius: 8, padding: '10px 14px', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-text-primary)' }}>{log.action}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>
                        {log.timestamp ? new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2, display: 'flex', gap: 12 }}>
                      {log.referenceId && <span>Ref: <strong>{log.referenceId}</strong></span>}
                      <span>By: {log.performedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
