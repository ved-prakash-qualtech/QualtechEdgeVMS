import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, Building2, Globe, Heart, Shield } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import styles from './OrgBrandingSettings.module.css';

export const OrgBrandingSettings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/settings/dashboard')}>
            <ChevronLeft size={16} /> Back to Settings
          </button>
          <h1 className={styles.title}>Organization Profile & Branding</h1>
          <p className={styles.subtitle}>Configure global tenant parameters, local currency units, and custom portal styling</p>
        </div>
        <Button>Save Configuration</Button>
      </header>

      <div className={styles.grid}>
        {/* Left Side: Forms */}
        <div className={styles.leftCol}>
          {/* Profile Form */}
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <Building2 size={18} className={styles.icon} />
              <h3>Tenant Profile Details</h3>
            </div>
            <div className={styles.formGrid}>
              <Input label="Company Name" defaultValue="Qualtech - Future-ready engineering" />
              <Input label="Corporate Identity Number (CIN)" defaultValue="U72200DL2002PTC118121" />
              <Input label="Primary Sourcing Email" defaultValue="procurement@qualtech.in" />
              <Input label="Contact Number" defaultValue="+91 120 4567 890" />
              <div className={styles.formGroupFull}>
                <label className={styles.label}>Registered Head Office Address</label>
                <textarea className={styles.textarea} defaultValue="4th Floor, Tower B, Logix Techno Park, Sector 127, Noida, Uttar Pradesh 201301" />
              </div>
            </div>
          </Card>

          {/* Regional Preferences */}
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <Globe size={18} className={styles.icon} />
              <h3>Regional & Currency Rules</h3>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Base Currency</label>
                <select className={styles.select} defaultValue="INR">
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Default Timezone</label>
                <select className={styles.select} defaultValue="IST">
                  <option value="IST">Asia/Kolkata (IST - UTC+5:30)</option>
                  <option value="EST">America/New_York (EST - UTC-5)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Fiscal Calendar Year</label>
                <select className={styles.select} defaultValue="Apr">
                  <option value="Apr">April to March (Indian Standard)</option>
                  <option value="Jan">January to December</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Default Sourcing Language</label>
                <select className={styles.select} defaultValue="EN">
                  <option value="EN">English (US/UK)</option>
                  <option value="HI">Hindi (हिंदी)</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Branding preview and organization hierarchy tree */}
        <div className={styles.rightCol}>
          {/* Logo and Brand Setup */}
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <Heart size={18} className={styles.icon} />
              <h3>Portal Theme & Logo</h3>
            </div>
            <div className={styles.brandingWrapper}>
              <div className={styles.logoDropzone}>
                <Upload size={24} className={styles.uploadIcon} />
                <p>Drag vendor portal logo here</p>
                <span>PNG, SVG max 2MB (200x50px)</span>
              </div>

              <div className={styles.colorPickerGroup}>
                <label className={styles.label}>Brand Identity Primary Color</label>
                <div className={styles.colorInputRow}>
                  <div className={styles.colorSquare} style={{ backgroundColor: '#0B1F5F' }}></div>
                  <input type="text" className={styles.colorInput} defaultValue="#0B1F5F" />
                </div>
              </div>
            </div>
          </Card>

          {/* Org Tree Hierarchy */}
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <Shield size={18} className={styles.icon} />
              <h3>Tenant Organization Hierarchy</h3>
            </div>
            <div className={styles.orgTree}>
              <div className={styles.treeNode}>
                <strong>🏢 Qualtech HQ (Parent Corporate)</strong>
                <div className={styles.treeBranches}>
                  <div className={styles.treeNode}>
                    <span>🏬 Noida Sourcing Hub (Business Unit 1)</span>
                  </div>
                  <div className={styles.treeNode}>
                    <span>🏬 Mumbai Finance Shared Services (Business Unit 2)</span>
                  </div>
                  <div className={styles.treeNode}>
                    <span>🏬 Bangalore IT Operations (Business Unit 3)</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
