import React, { useState, useEffect, useRef } from 'react';
import {
  Building2, Globe, Upload, CheckCircle, RefreshCw,
  Palette, MapPin, Phone, Mail, Hash, Calendar, Languages
} from 'lucide-react';
import { getSettings, saveSettings, uploadSettingsFile } from '../../services/settingsService';
import type { Organization } from '../../services/settingsService';
import styles from './GeneralSettings.module.css';

export const GeneralSettings: React.FC = () => {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getSettings();
      setOrg(data.organization);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Organization, value: string) => {
    setOrg(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSave = async () => {
    if (!org) return;
    setSaving(true);
    try {
      await saveSettings({ organization: org, updatedBy: 'Saurabh Anand' });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadSettingsFile(file, 'logoUrl');
      setOrg(prev => prev ? { ...prev, logoUrl: url } : prev);
    } catch (err) {
      console.error('Logo upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', padding: '40px' }}>
          <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
          Loading settings…
        </div>
      </div>
    );
  }

  if (!org) return null;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <span className={styles.badge}><Building2 size={12} /> Organization Profile</span>
          <h1 className={styles.title}>General Settings</h1>
          <p className={styles.subtitle}>Configure organizational profile, branding, regional preferences and business unit hierarchy</p>
        </div>
        <div className={styles.headerActions}>
          {saved && (
            <span className={styles.savedBanner}>
              <CheckCircle size={14} /> Saved successfully
            </span>
          )}
          <button className={styles.secondaryBtn} onClick={fetchData}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={14} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        {/* LEFT COLUMN */}
        <div>
          {/* Org Profile */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Building2 size={16} className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Organization Profile</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.formGrid}>
                <div>
                  <label className={styles.label}><Building2 size={10} /> Company Name</label>
                  <input className={styles.input} value={org.companyName} onChange={e => handleChange('companyName', e.target.value)} />
                </div>
                <div>
                  <label className={styles.label}><Hash size={10} /> CIN Number</label>
                  <input className={styles.input} value={org.cin} onChange={e => handleChange('cin', e.target.value)} />
                </div>
                <div>
                  <label className={styles.label}><Mail size={10} /> Primary Email</label>
                  <input className={styles.input} type="email" value={org.primaryEmail} onChange={e => handleChange('primaryEmail', e.target.value)} />
                </div>
                <div>
                  <label className={styles.label}><Phone size={10} /> Contact Number</label>
                  <input className={styles.input} value={org.contactNumber} onChange={e => handleChange('contactNumber', e.target.value)} />
                </div>
                <div>
                  <label className={styles.label}><Globe size={10} /> Website</label>
                  <input className={styles.input} value={org.website || ''} onChange={e => handleChange('website', e.target.value)} />
                </div>
                <div>
                  <label className={styles.label}><Hash size={10} /> GSTIN</label>
                  <input className={styles.input} value={org.gstin || ''} onChange={e => handleChange('gstin', e.target.value)} />
                </div>
                <div>
                  <label className={styles.label}><Hash size={10} /> PAN Number</label>
                  <input className={styles.input} value={org.panNumber || ''} onChange={e => handleChange('panNumber', e.target.value)} />
                </div>
                <div className={styles.formGroupFull}>
                  <label className={styles.label}><MapPin size={10} /> Registered Address</label>
                  <textarea className={styles.textarea} value={org.registeredAddress} onChange={e => handleChange('registeredAddress', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Globe size={16} className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Regional & Financial Preferences</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.formGrid}>
                <div>
                  <label className={styles.label}><Globe size={10} /> Base Currency</label>
                  <select className={styles.select} value={org.currency} onChange={e => handleChange('currency', e.target.value)}>
                    <option value="INR">Indian Rupee (₹ INR)</option>
                    <option value="USD">US Dollar ($ USD)</option>
                    <option value="EUR">Euro (€ EUR)</option>
                    <option value="GBP">British Pound (£ GBP)</option>
                  </select>
                </div>
                <div>
                  <label className={styles.label}><Globe size={10} /> Default Timezone</label>
                  <select className={styles.select} value={org.timezone} onChange={e => handleChange('timezone', e.target.value)}>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST UTC+5:30)</option>
                    <option value="America/New_York">America/New_York (EST UTC-5)</option>
                    <option value="Europe/London">Europe/London (GMT UTC+0)</option>
                  </select>
                </div>
                <div>
                  <label className={styles.label}><Calendar size={10} /> Fiscal Year</label>
                  <select className={styles.select} value={org.fiscalYear} onChange={e => handleChange('fiscalYear', e.target.value)}>
                    <option value="Apr-Mar">April – March (Indian Standard)</option>
                    <option value="Jan-Dec">January – December (Calendar Year)</option>
                  </select>
                </div>
                <div>
                  <label className={styles.label}><Languages size={10} /> Platform Language</label>
                  <select className={styles.select} value={org.language} onChange={e => handleChange('language', e.target.value)}>
                    <option value="EN">English (US/UK)</option>
                    <option value="HI">Hindi (हिंदी)</option>
                  </select>
                </div>
                <div>
                  <label className={styles.label}><Calendar size={10} /> Date Format</label>
                  <select className={styles.select} value={org.dateFormat} onChange={e => handleChange('dateFormat', e.target.value)}>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Branding */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Palette size={16} className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Portal Branding & Logo</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.logoSection}>
                <div className={styles.logoPreview}>
                  {org.logoUrl ? (
                    <img src={`http://localhost:5000${org.logoUrl}`} alt="Logo" className={styles.logoImg} />
                  ) : (
                    <div className={styles.logoPlaceholder}>
                      <Upload size={22} />
                      <p>No logo uploaded</p>
                    </div>
                  )}
                </div>
                <button
                  className={`${styles.uploadBtn} ${uploading ? styles.uploading : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload size={14} />
                  {uploading ? 'Uploading…' : 'Upload Logo'}
                </button>
                {org.logoUrl && (
                  <span className={styles.uploadedUrl}>✓ Logo saved on server</span>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className={styles.hiddenInput}
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleLogoUpload}
                />
              </div>

              <div style={{ marginTop: 20 }}>
                <label className={styles.label}><Palette size={10} /> Brand Primary Color</label>
                <div className={styles.colorRow}>
                  <div className={styles.colorSwatch} style={{ backgroundColor: org.primaryColor }} />
                  <input
                    className={styles.colorInput}
                    value={org.primaryColor}
                    onChange={e => handleChange('primaryColor', e.target.value)}
                    placeholder="#0B1F5F"
                  />
                  <input
                    type="color"
                    className={styles.colorPicker}
                    value={org.primaryColor}
                    onChange={e => handleChange('primaryColor', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <label className={styles.label}><Palette size={10} /> Accent / Action Color</label>
                <div className={styles.colorRow}>
                  <div className={styles.colorSwatch} style={{ backgroundColor: org.accentColor }} />
                  <input
                    className={styles.colorInput}
                    value={org.accentColor}
                    onChange={e => handleChange('accentColor', e.target.value)}
                    placeholder="#2563EB"
                  />
                  <input
                    type="color"
                    className={styles.colorPicker}
                    value={org.accentColor}
                    onChange={e => handleChange('accentColor', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Org Hierarchy */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Building2 size={16} className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Business Unit Hierarchy</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.orgTree}>
                <div className={styles.treeRoot}>
                  🏢 {org.companyName} (Corporate)
                </div>
                <div className={styles.treeBranches}>
                  {org.businessUnits.map((unit, i) => (
                    <div key={i} className={styles.treeLeaf}>
                      🏬 {unit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#94a3b8' }}>Last updated</span>
                  <span style={{ color: '#475569', fontWeight: 600 }}>
                    {org.lastUpdated ? new Date(org.lastUpdated).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#94a3b8' }}>Updated by</span>
                  <span style={{ color: '#475569', fontWeight: 600 }}>{org.updatedBy || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
