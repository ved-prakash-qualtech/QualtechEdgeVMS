import React, { useRef, useState } from 'react';
import { Upload, RefreshCw, History, ChevronDown, ChevronRight, X, FileText } from 'lucide-react';
import { useVendorDocuments, useUploadDocument } from '../../hooks/useVendorPortal';
import type { VendorDocument } from '../../services/vendorPortalService';
import s from './vendor.module.css';

const TYPES = ['GST Certificate', 'PAN Card', 'MSME Certificate', 'Bank Statement', 'Incorporation Certificate', 'Other'];

const statusBadge = (status: string) => {
  if (status === 'Verified') return <span className={s.badgeSuccess}>{status}</span>;
  if (status === 'Expired' || status === 'Rejected') return <span className={s.badgeDanger}>{status}</span>;
  return <span className={s.badgeWarning}>{status}</span>;
};

interface UploadModalProps { doc?: VendorDocument | null; onClose: () => void; }

const UploadModal: React.FC<UploadModalProps> = ({ doc, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [docType, setDocType] = useState(doc?.documentType ?? '');
  const [docName, setDocName] = useState(doc?.documentName ?? '');
  const [expiry, setExpiry] = useState(doc?.expiryDate ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadDoc = useUploadDocument();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!file) e.file = 'Please select a file';
    if (!docType) e.docType = 'Select a document type';
    if (!docName.trim()) e.docName = 'Document name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !file) return;
    await uploadDoc.mutateAsync({ file, type: docType, name: docName, expiry: expiry || null, docId: doc?.documentId });
    onClose();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) setFile(f);
  };

  return (
    <div className={s.modalBackdrop}>
      <div className={s.modal}>
        <div className={s.modalHeader}>
          <div className={s.modalTitle}>{doc ? `Renew — ${doc.documentName}` : 'Upload Document'}</div>
          <button className={s.modalClose} onClick={onClose}><X size={18} /></button>
        </div>
        <div className={s.modalBody}>
          <div
            className={`${s.dropZone} ${dragging ? s.dropZoneActive : ''}`}
            style={errors.file ? { borderColor: 'var(--color-danger)' } : undefined}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={26} style={{ color: 'var(--color-primary)' }} />
            <div className={s.dropZoneText}>{file ? file.name : 'Drop file here or click to browse'}</div>
            <div className={s.dropZoneHint}>PDF, JPG, PNG · Max 10 MB</div>
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && setFile(e.target.files[0])} />
          {errors.file && <div className={s.fieldError}>{errors.file}</div>}

          <div className={s.formGrid}>
            <div className={s.formGroup}>
              <label className={s.label}>Document Type *</label>
              <select className={`${s.select} ${errors.docType ? s.inputError : ''}`} value={docType}
                onChange={e => setDocType(e.target.value)}>
                <option value="">Select type…</option>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.docType && <div className={s.fieldError}>{errors.docType}</div>}
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Document Name *</label>
              <input className={`${s.input} ${errors.docName ? s.inputError : ''}`} value={docName}
                onChange={e => setDocName(e.target.value)} placeholder="E.g. GST Certificate 2024" />
              {errors.docName && <div className={s.fieldError}>{errors.docName}</div>}
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Expiry Date (optional)</label>
              <input type="date" className={s.input} value={expiry} onChange={e => setExpiry(e.target.value)} />
            </div>
          </div>
        </div>
        <div className={s.modalFooter}>
          <button className={s.btnOutline} onClick={onClose}>Cancel</button>
          <button className={s.btnPrimary} onClick={handleSubmit} disabled={uploadDoc.isPending}>
            {uploadDoc.isPending ? 'Uploading…' : doc ? 'Renew Document' : 'Upload Document'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const VendorDocuments: React.FC = () => {
  const { data: docs = [], isLoading } = useVendorDocuments();
  const [showModal, setShowModal] = useState(false);
  const [renewDoc, setRenewDoc] = useState<VendorDocument | null>(null);
  const [expandedHistory, setExpandedHistory] = useState<Set<string>>(new Set());

  const toggleHistory = (id: string) => setExpandedHistory(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  if (isLoading) {
    return (
      <div className={s.page}>
        <div className={s.card}>
          {[1, 2, 3].map(i => (
            <div key={i} className={s.skeleton} style={{ height: 44, marginBottom: 8, borderRadius: 8 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      {(showModal || renewDoc) && (
        <UploadModal doc={renewDoc} onClose={() => { setShowModal(false); setRenewDoc(null); }} />
      )}

      <div className={s.pageHeader}>
        <div>
          <div className={s.pageTitle}>Compliance Documents</div>
          <div className={s.pageSubtitle}>Upload and manage your KYC and compliance documents</div>
        </div>
        <button className={s.btnPrimary} onClick={() => setShowModal(true)}>
          <Upload size={15} /> Upload Document
        </button>
      </div>

      <div className={s.card}>
        {docs.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}><FileText size={28} /></div>
            <div className={s.emptyTitle}>No documents yet</div>
            <div className={s.emptyText}>Upload your compliance documents to begin verification.</div>
            <button className={s.btnPrimary} style={{ marginTop: 10 }} onClick={() => setShowModal(true)}>
              <Upload size={14} /> Upload First Document
            </button>
          </div>
        ) : (
          <div className={s.tableWrapper}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Document Name</th><th>Type</th><th>Uploaded</th>
                  <th>Expiry</th><th>Status</th><th>History</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.map(doc => (
                  <React.Fragment key={doc.documentId}>
                    <tr>
                      <td>{doc.documentName}</td>
                      <td>{doc.documentType}</td>
                      <td>{doc.uploadDate}</td>
                      <td>{doc.expiryDate || '—'}</td>
                      <td>{statusBadge(doc.status)}</td>
                      <td>
                        {(doc.versions?.length ?? 0) > 0 && (
                          <button className={s.btnGhost} style={{ padding: '4px 8px' }}
                            onClick={() => toggleHistory(doc.documentId)}>
                            <History size={13} /> {doc.versions!.length}
                            {expandedHistory.has(doc.documentId) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          </button>
                        )}
                      </td>
                      <td>
                        {(doc.status === 'Expired' || doc.status === 'Rejected') && (
                          <button className={s.btnOutline} style={{ padding: '5px 10px', fontSize: 11 }}
                            onClick={() => setRenewDoc(doc)}>
                            <RefreshCw size={12} /> Renew
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedHistory.has(doc.documentId) && doc.versions?.map((v, i) => (
                      <tr key={v.fileId} style={{ background: 'var(--color-surface-2)' }}>
                        <td colSpan={2} style={{ paddingLeft: 32, color: 'var(--color-text-tertiary)', fontSize: 12 }}>
                          Version {doc.versions!.length - i} (replaced)
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{v.uploadDate}</td>
                        <td colSpan={4} style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                          {v.uploadedBy ? `Uploaded by ${v.uploadedBy}` : 'Previous version'}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
