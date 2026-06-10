import React, { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, X, Building2, FileCheck, Upload, Sparkles } from 'lucide-react';
import { useCompleteOnboarding, useUpdateProfile, useUpdateKyc, useUploadDocument } from '../../hooks/useVendorPortal';
import s from './vendor.module.css';

interface Props { onClose: () => void; }

const STEPS = [
  { id: 1, title: 'Welcome', icon: Sparkles },
  { id: 2, title: 'Company Info', icon: Building2 },
  { id: 3, title: 'KYC Details', icon: FileCheck },
  { id: 4, title: 'Upload Document', icon: Upload },
  { id: 5, title: 'All Done!', icon: CheckCircle },
];

export const VendorOnboarding: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState(1);

  const [companyForm, setCompanyForm] = useState({ contactPerson: '', phone: '', address: '' });
  const [kycForm, setKycForm] = useState({ gstNumber: '', panNumber: '', msmeNumber: '' });
  const [docFile, setDocFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const updateProfile = useUpdateProfile();
  const updateKyc = useUpdateKyc();
  const uploadDoc = useUploadDocument();
  const completeOnboarding = useCompleteOnboarding();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setDocFile(f);
  };

  const next = async () => {
    if (step === 2) {
      await updateProfile.mutateAsync(companyForm);
    }
    if (step === 3) {
      await updateKyc.mutateAsync(kycForm);
    }
    if (step === 4 && docFile) {
      await uploadDoc.mutateAsync({ file: docFile, type: 'Other', name: docFile.name });
    }
    if (step === 5) {
      await completeOnboarding.mutateAsync();
      onClose();
      return;
    }
    setStep(s => s + 1);
  };

  const isPending = updateProfile.isPending || updateKyc.isPending || uploadDoc.isPending || completeOnboarding.isPending;

  return (
    <div className={s.modalBackdrop} style={{ zIndex: 2000 }}>
      <div className={s.modal} style={{ width: 600 }}>
        {/* Header */}
        <div className={s.modalHeader}>
          <div className={s.modalTitle}>Welcome to Vendor Portal — Let's get you set up</div>
          <button className={s.modalClose} onClick={onClose}><X size={18} /></button>
        </div>

        {/* Step indicator */}
        <div style={{ padding: '16px 24px 0', display: 'flex', gap: 0, alignItems: 'center' }}>
          {STEPS.map((st, i) => {
            const done = step > st.id;
            const active = step === st.id;
            return (
              <React.Fragment key={st.id}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, minWidth: 72 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: done ? 'var(--color-success)' : active ? 'var(--color-primary)' : 'var(--color-surface-2)',
                    color: done || active ? 'white' : 'var(--color-text-tertiary)',
                    fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
                  }}>
                    {done ? <CheckCircle size={16} /> : st.id}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: active ? 'var(--color-primary)' : 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>
                    {st.title}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: done ? 'var(--color-success)' : 'var(--color-border)', marginBottom: 18, transition: 'background 0.2s' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Body */}
        <div className={s.modalBody}>
          {step === 1 && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}>Welcome aboard!</div>
              <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', maxWidth: 380, margin: '0 auto', lineHeight: 1.6 }}>
                This quick 5-step wizard will help you complete your vendor profile, add KYC details, and upload your first compliance document.
                It only takes a few minutes.
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={s.formGrid}>
              <div className={s.formGroup}>
                <label className={s.label}>Contact Person *</label>
                <input className={s.input} value={companyForm.contactPerson}
                  onChange={e => setCompanyForm(f => ({ ...f, contactPerson: e.target.value }))}
                  placeholder="Full name" />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Phone Number</label>
                <input className={s.input} value={companyForm.phone}
                  onChange={e => setCompanyForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210" />
              </div>
              <div className={s.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label className={s.label}>Registered Address</label>
                <textarea className={s.textarea} value={companyForm.address}
                  onChange={e => setCompanyForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Full registered address" rows={3} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={s.formGrid}>
              <div className={s.formGroup}>
                <label className={s.label}>GST Number</label>
                <input className={s.input} value={kycForm.gstNumber}
                  onChange={e => setKycForm(f => ({ ...f, gstNumber: e.target.value }))}
                  placeholder="22AAAAA0000A1Z5" />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>PAN Number</label>
                <input className={s.input} value={kycForm.panNumber}
                  onChange={e => setKycForm(f => ({ ...f, panNumber: e.target.value }))}
                  placeholder="ABCDE1234F" />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>MSME Registration (optional)</label>
                <input className={s.input} value={kycForm.msmeNumber}
                  onChange={e => setKycForm(f => ({ ...f, msmeNumber: e.target.value }))}
                  placeholder="UDYAM-XX-00-0000000" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
                Upload at least one compliance document (e.g., GST Certificate, PAN Card, MSME Certificate) to begin verification.
              </p>
              <div
                className={`${s.dropZone} ${dragging ? s.dropZoneActive : ''}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('ob-file-input')?.click()}
              >
                <Upload size={28} style={{ color: 'var(--color-primary)', marginBottom: 4 }} />
                <div className={s.dropZoneText}>{docFile ? docFile.name : 'Drop a file or click to browse'}</div>
                <div className={s.dropZoneHint}>PDF, JPG, PNG · Max 10 MB</div>
              </div>
              <input id="ob-file-input" type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && setDocFile(e.target.files[0])} />
              {docFile && (
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <CheckCircle size={14} /> {docFile.name} ready to upload
                </div>
              )}
              <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 8 }}>
                You can skip this step and upload documents later from the Documents section.
              </p>
            </div>
          )}

          {step === 5 && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}>You're all set!</div>
              <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>
                Your profile has been set up. Our team will verify your KYC and documents shortly.
                You can now start accepting Purchase Orders and submitting Invoices.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={s.modalFooter}>
          {step > 1 && step < 5 && (
            <button className={s.btnOutline} onClick={() => setStep(s => s - 1)} disabled={isPending}>
              <ArrowLeft size={14} /> Back
            </button>
          )}
          {step === 4 && !docFile && (
            <button className={s.btnGhost} onClick={() => setStep(s => s + 1)}>Skip for now</button>
          )}
          <button className={s.btnPrimary} onClick={next} disabled={isPending}>
            {isPending ? 'Saving…' : step === 5 ? 'Go to Dashboard' : step === 4 ? 'Upload & Continue' : 'Continue'}
            {!isPending && <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};
