import React, { useEffect, useState } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import { useVendorKyc, useUpdateKyc } from '../../hooks/useVendorPortal';
import s from './vendor.module.css';

export const VendorKYC: React.FC = () => {
  const { data: kyc, isLoading } = useVendorKyc();
  const updateKyc = useUpdateKyc();
  const [form, setForm] = useState({ gstNumber: '', panNumber: '', msmeNumber: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (kyc) setForm({ gstNumber: kyc.gstNumber ?? '', panNumber: kyc.panNumber ?? '', msmeNumber: kyc.msmeNumber ?? '' });
  }, [kyc]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.gstNumber))
      e.gstNumber = 'Enter a valid GST number (15 chars)';
    if (form.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber))
      e.panNumber = 'Enter a valid PAN number (10 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    updateKyc.mutate(form);
  };

  if (isLoading) {
    return (
      <div className={s.page}>
        <div className={s.card}>
          <div className={s.formGrid}>
            {[1, 2, 3].map(i => (
              <div key={i} className={s.formGroup}>
                <div className={s.skeleton} style={{ height: 12, width: '40%' }} />
                <div className={s.skeleton} style={{ height: 38, width: '100%', marginTop: 4 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <div className={s.pageTitle}>KYC Details</div>
          <div className={s.pageSubtitle}>Registration numbers for compliance verification</div>
        </div>
        <div>
          {kyc?.status && (
            kyc.status === 'Verified'
              ? <span className={s.badgeSuccess}><ShieldCheck size={12} /> KYC Verified</span>
              : <span className={s.badgeWarning}>{kyc.status}</span>
          )}
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <div className={s.cardTitle}><ShieldCheck size={15} /> Registration Numbers</div>
        </div>
        <div className={s.formGrid}>
          <div className={s.formGroup}>
            <label className={s.label}>GST Number</label>
            <input className={`${s.input} ${errors.gstNumber ? s.inputError : ''}`}
              value={form.gstNumber} onChange={e => setForm(f => ({ ...f, gstNumber: e.target.value.toUpperCase() }))}
              placeholder="22AAAAA0000A1Z5" maxLength={15} />
            {errors.gstNumber && <div className={s.fieldError}>{errors.gstNumber}</div>}
          </div>
          <div className={s.formGroup}>
            <label className={s.label}>PAN Number</label>
            <input className={`${s.input} ${errors.panNumber ? s.inputError : ''}`}
              value={form.panNumber} onChange={e => setForm(f => ({ ...f, panNumber: e.target.value.toUpperCase() }))}
              placeholder="ABCDE1234F" maxLength={10} />
            {errors.panNumber && <div className={s.fieldError}>{errors.panNumber}</div>}
          </div>
          <div className={s.formGroup}>
            <label className={s.label}>MSME Registration (optional)</label>
            <input className={s.input} value={form.msmeNumber}
              onChange={e => setForm(f => ({ ...f, msmeNumber: e.target.value }))}
              placeholder="UDYAM-XX-00-0000000" />
          </div>
        </div>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
          <button className={s.btnPrimary} onClick={handleSave} disabled={updateKyc.isPending}>
            <Save size={14} /> {updateKyc.isPending ? 'Saving…' : 'Save KYC'}
          </button>
        </div>
      </div>
    </div>
  );
};
