import React, { useState } from 'react';
import { HelpCircle, Plus, X, ChevronDown, ChevronRight, Send, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVendorTickets, useSubmitTicket, useReplyToTicket } from '../../hooks/useVendorPortal';
import type { VendorTicket } from '../../services/vendorPortalService';
import s from './vendor.module.css';

const CATEGORIES = ['Invoice Query', 'Payment Issue', 'PO Clarification', 'Document Rejection', 'KYC Issue', 'Other'];

const NewTicketModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const submitTicket = useSubmitTicket();
  const [form, setForm] = useState({ category: '', subject: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.category) e.category = 'Select a category';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.description.trim()) e.description = 'Describe your issue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await submitTicket.mutateAsync(form);
    onClose();
  };

  return (
    <div className={s.modalBackdrop}>
      <div className={s.modal}>
        <div className={s.modalHeader}>
          <div className={s.modalTitle}>Raise a Support Ticket</div>
          <button className={s.modalClose} onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className={s.modalBody}>
          <div className={s.formGroup}>
            <label className={s.label}>{t('helpdesk.category')} *</label>
            <select className={`${s.select} ${errors.category ? s.inputError : ''}`}
              value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="">Select category…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <div className={s.fieldError}>{errors.category}</div>}
          </div>
          <div className={s.formGroup}>
            <label className={s.label}>{t('helpdesk.subject')} *</label>
            <input className={`${s.input} ${errors.subject ? s.inputError : ''}`}
              value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="Brief summary of your issue" />
            {errors.subject && <div className={s.fieldError}>{errors.subject}</div>}
          </div>
          <div className={s.formGroup}>
            <label className={s.label}>{t('helpdesk.description')} *</label>
            <textarea className={`${s.textarea} ${errors.description ? s.inputError : ''}`}
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Provide details about the issue…" rows={4} />
            {errors.description && <div className={s.fieldError}>{errors.description}</div>}
          </div>
        </div>
        <div className={s.modalFooter}>
          <button className={s.btnOutline} onClick={onClose}>{t('common.cancel')}</button>
          <button className={s.btnPrimary} onClick={handleSubmit} disabled={submitTicket.isPending}>
            {submitTicket.isPending ? 'Submitting…' : t('helpdesk.submit')}
          </button>
        </div>
      </div>
    </div>
  );
};

const TicketCard: React.FC<{ ticket: VendorTicket }> = ({ ticket: t }) => {
  const [expanded, setExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState(false);
  const replyMutation = useReplyToTicket();

  const handleReply = async () => {
    if (!replyText.trim()) return;
    await replyMutation.mutateAsync({ ticketId: t.ticketId, message: replyText });
    setReplyText('');
    setShowReply(false);
  };

  const replyCount = t.replies?.length ?? 0;

  return (
    <div style={{
      border: '1px solid var(--color-border)', borderRadius: 10,
      borderLeft: `4px solid ${t.status === 'Open' ? 'var(--color-primary)' : 'var(--color-success)'}`,
      background: 'var(--color-surface-2)', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-text-primary)' }}>{t.subject}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{t.ticketId}</span>
            {t.status === 'Open'
              ? <span className={s.badgeWarning}>Open</span>
              : <span className={s.badgeSuccess}>Resolved</span>}
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8 }}>{t.description}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
            Category: {t.category} · Created: {t.createdDate}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {replyCount > 0 && (
              <button className={s.btnGhost} style={{ padding: '4px 10px', fontSize: 11 }}
                onClick={() => setExpanded(e => !e)}
                aria-expanded={expanded} aria-label="Toggle replies">
                <MessageSquare size={12} /> {replyCount} {expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              </button>
            )}
            {t.status === 'Open' && (
              <button className={s.btnOutline} style={{ padding: '4px 10px', fontSize: 11 }}
                onClick={() => setShowReply(r => !r)}>
                <Send size={11} /> Reply
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Thread */}
      {expanded && replyCount > 0 && (
        <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>
            Replies
          </div>
          {t.replies!.map(r => (
            <div key={r.replyId} style={{
              padding: '10px 12px', borderRadius: 8, fontSize: 12,
              background: r.author === 'Vendor User' ? 'var(--color-info-bg)' : 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              alignSelf: r.author === 'Vendor User' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
            }}>
              <div style={{ fontWeight: 600, fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 3 }}>
                {r.author} · {new Date(r.createdDate).toLocaleDateString('en-IN')}
              </div>
              <div style={{ color: 'var(--color-text-primary)' }}>{r.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* Reply composer */}
      {showReply && (
        <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8, borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
          <textarea className={s.textarea} value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Type your reply…" rows={2} style={{ flex: 1, minHeight: 60 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'flex-end' }}>
            <button className={s.btnPrimary} style={{ padding: '7px 12px', fontSize: 12 }}
              disabled={replyMutation.isPending || !replyText.trim()} onClick={handleReply}>
              {replyMutation.isPending ? '…' : <Send size={13} />}
            </button>
            <button className={s.btnGhost} style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => setShowReply(false)}>
              <X size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const VendorHelpdesk: React.FC = () => {
  const { t } = useTranslation();
  const { data: tickets = [], isLoading } = useVendorTickets();
  const [showModal, setShowModal] = useState(false);

  if (isLoading) {
    return (
      <div className={s.page}>
        <div className={s.card}>
          {[1, 2].map(i => <div key={i} className={s.skeleton} style={{ height: 80, marginBottom: 10, borderRadius: 10 }} />)}
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      {showModal && <NewTicketModal onClose={() => setShowModal(false)} />}

      <div className={s.pageHeader}>
        <div>
          <div className={s.pageTitle}>{t('helpdesk.title')}</div>
          <div className={s.pageSubtitle}>{tickets.filter(tk => tk.status === 'Open').length} open tickets</div>
        </div>
        <button className={s.btnPrimary} onClick={() => setShowModal(true)} aria-label="Raise new support ticket">
          <Plus size={15} /> {t('helpdesk.raise')}
        </button>
      </div>

      <div className={s.card}>
        {tickets.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}><HelpCircle size={28} /></div>
            <div className={s.emptyTitle}>{t('helpdesk.noTickets')}</div>
            <div className={s.emptyText}>{t('helpdesk.noTicketsDesc')}</div>
            <button className={s.btnPrimary} style={{ marginTop: 10 }} onClick={() => setShowModal(true)}>
              <Plus size={14} /> Raise First Ticket
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tickets.map(tk => <TicketCard key={tk.ticketId} ticket={tk} />)}
          </div>
        )}
      </div>
    </div>
  );
};
