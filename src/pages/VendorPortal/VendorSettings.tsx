import React, { useEffect, useState } from 'react';
import { Bell, Globe, Lock, Moon, Sun, Monitor, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVendorSettings, useSaveVendorSettings } from '../../hooks/useVendorPortal';
import s from './vendor.module.css';

type Theme = 'light' | 'dark' | 'system';

const NOTIF_ITEMS = [
  { key: 'poIssued',       label: 'New Purchase Order Issued',   desc: 'Notify when a new PO is assigned to you' },
  { key: 'invoiceStatus',  label: 'Invoice Status Updates',       desc: 'OCR processed, under review, approved' },
  { key: 'paymentCleared', label: 'Payment Cleared',              desc: 'When a payment is released to your account' },
  { key: 'docExpiry',      label: 'Document Expiry Alerts',       desc: '30-day advance notice for expiring documents' },
  { key: 'ticketUpdate',   label: 'Helpdesk Ticket Updates',      desc: 'Replies and resolutions on your tickets' },
];

export const VendorSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: serverSettings } = useVendorSettings();
  const saveSettings = useSaveVendorSettings();

  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('vms_theme') as Theme) || 'system');
  const [language, setLanguage] = useState<string>(() => localStorage.getItem('vms_language') || 'en');
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    poIssued: true, invoiceStatus: true, paymentCleared: true, docExpiry: true, ticketUpdate: false,
  });
  const [saved, setSaved] = useState(false);

  // Hydrate from server on first load
  useEffect(() => {
    if (serverSettings) {
      if (serverSettings.notifications) setNotifs(prev => ({ ...prev, ...serverSettings.notifications }));
      if (serverSettings.language) {
        setLanguage(serverSettings.language);
        i18n.changeLanguage(serverSettings.language);
      }
    }
  }, [serverSettings, i18n]);

  const applyTheme = (t: Theme) => {
    setTheme(t);
    if (t === 'system') {
      localStorage.removeItem('vms_theme');
      document.documentElement.setAttribute('data-theme',
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } else {
      localStorage.setItem('vms_theme', t);
      document.documentElement.setAttribute('data-theme', t);
    }
  };

  const applyLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('vms_language', lang);
    i18n.changeLanguage(lang);
  };

  const handleSave = async () => {
    await saveSettings.mutateAsync({ notifications: notifs, language, theme });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const THEMES: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: t('settings.light'),  icon: <Sun size={16} /> },
    { value: 'dark',  label: t('settings.dark'),   icon: <Moon size={16} /> },
    { value: 'system',label: t('settings.system'), icon: <Monitor size={16} /> },
  ];

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <div className={s.pageTitle}>{t('settings.title')}</div>
          <div className={s.pageSubtitle}>{t('settings.subtitle')}</div>
        </div>
        <button className={s.btnPrimary} onClick={handleSave} disabled={saveSettings.isPending} aria-label="Save all preferences">
          {saved ? <><CheckCircle size={14} /> Saved!</> : saveSettings.isPending ? t('settings.saving') : t('common.save') + ' Preferences'}
        </button>
      </div>

      {/* Appearance */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <div className={s.cardTitle}><Moon size={15} /> {t('settings.appearance')}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {THEMES.map(th => (
            <button key={th.value} onClick={() => applyTheme(th.value)}
              aria-pressed={theme === th.value}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                border: `2px solid ${theme === th.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 10, background: theme === th.value ? 'var(--color-info-bg)' : 'var(--color-surface-2)',
                color: theme === th.value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
              }}>
              {th.icon} {th.label}
            </button>
          ))}
        </div>
      </div>

      {/* Language (Sprint 4) */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <div className={s.cardTitle}><Globe size={15} /> {t('settings.language')}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[{ code: 'en', label: 'English' }, { code: 'hi', label: 'हिन्दी' }].map(lang => (
            <button key={lang.code}
              onClick={() => applyLanguage(lang.code)}
              aria-pressed={language === lang.code}
              className={language === lang.code ? s.btnPrimary : s.btnOutline}
              style={{ fontSize: 13 }}>
              {lang.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 8 }}>
          Language takes effect immediately across the portal.
        </div>
      </div>

      {/* Notifications */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <div className={s.cardTitle}><Bell size={15} /> {t('settings.notifications')}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} role="group" aria-label="Notification preferences">
          {NOTIF_ITEMS.map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{item.desc}</div>
              </div>
              <button
                role="switch"
                aria-checked={notifs[item.key] ?? false}
                aria-label={`Toggle ${item.label}`}
                onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))}
                style={{
                  width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: notifs[item.key] ? 'var(--color-primary)' : 'var(--color-border-strong)',
                  position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                }}>
                <span style={{
                  position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: 'white',
                  left: notifs[item.key] ? 23 : 3,
                  transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <div className={s.cardTitle}><Lock size={15} /> {t('settings.security')}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Password changes and two-factor authentication are managed by your account administrator.
            Contact <a href="mailto:procurement@axismaxlife.com" style={{ color: 'var(--color-primary)' }}>procurement@axismaxlife.com</a> to reset credentials.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className={s.btnOutline} disabled style={{ opacity: 0.6, fontSize: 12 }} aria-disabled="true">
              Change Password (via Admin)
            </button>
            <button className={s.btnOutline} disabled style={{ opacity: 0.6, fontSize: 12 }} aria-disabled="true">
              Enable 2FA (via Admin)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
