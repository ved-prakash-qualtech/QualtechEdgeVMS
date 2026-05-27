import React, { useState } from 'react';
import { 
  Globe, 
  Database, 
  ShieldCheck, 
  Layers, 
  Play, 
  Settings,
  Plus
} from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './AdminDashboard.module.css';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  status: 'Active' | 'Maintenance' | 'Suspended';
  brandingColor: string;
  onboardedDate: string;
}

interface IntegrationNode {
  id: string;
  name: string;
  type: string;
  status: 'Connected' | 'Degraded' | 'Offline';
  latency: string;
}

export const AdminDashboard: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([
    { id: 'T-01', name: 'State Bank of India (SBI)', subdomain: 'sbi.vms.qualtech.com', status: 'Active', brandingColor: '#006699', onboardedDate: '10 Jan 2025' },
    { id: 'T-02', name: 'HDFC Corporate Banking', subdomain: 'hdfc.vms.qualtech.com', status: 'Active', brandingColor: '#1D4ED8', onboardedDate: '24 Feb 2025' },
    { id: 'T-03', name: 'ICICI Prudential Dev', subdomain: 'icici.vms.qualtech.com', status: 'Maintenance', brandingColor: '#FF6600', onboardedDate: '15 Mar 2025' },
    { id: 'T-04', name: 'Axis Finance Sourcing', subdomain: 'axis.vms.qualtech.com', status: 'Active', brandingColor: '#970030', onboardedDate: '01 Apr 2025' }
  ]);

  const [integrations, setIntegrations] = useState<IntegrationNode[]>([
    { id: 'INT-01', name: 'GSTN Gateway API', type: 'Tax Identification', status: 'Connected', latency: '42ms' },
    { id: 'INT-02', name: 'PAN / NSDL Verify', type: 'KYC Checker', status: 'Connected', latency: '65ms' },
    { id: 'INT-03', name: 'MCA21 Database Registrar', type: 'Company Details', status: 'Connected', latency: '120ms' },
    { id: 'INT-04', name: 'UIDAI Aadhaar OTP Portal', type: 'Identity Verification', status: 'Degraded', latency: '450ms' },
    { id: 'INT-05', name: 'Core CBS Webhook Router', type: 'ERP / GL Posting', status: 'Offline', latency: '0ms' }
  ]);

  const [sessionTimeout, setSessionTimeout] = useState(15); // Minutes
  const [mfaForced, setMfaForced] = useState(true);
  const [activeTab, setActiveTab] = useState<'tenants' | 'security' | 'integrations'>('tenants');

  const handlePing = (id: string, name: string) => {
    alert(`Pinging gateway node: ${name} (${id})...`);
    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.id === 'INT-05' ? 'Connected' : item.status,
          latency: item.id === 'INT-05' ? '180ms' : `${Math.floor(Math.random() * 50) + 30}ms`
        };
      }
      return item;
    }));
    if (id === 'INT-05') {
      alert("CBS Webhook Node recovered. Status restored to Connected.");
    }
  };

  const handleCreateTenant = () => {
    const tenantName = window.prompt("Enter new Tenant Name:");
    if (!tenantName) return;
    const cleanSub = tenantName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const newTenant: Tenant = {
      id: `T-0${tenants.length + 1}`,
      name: tenantName,
      subdomain: `${cleanSub}.vms.qualtech.com`,
      status: 'Active',
      brandingColor: '#1D4ED8',
      onboardedDate: new Date().toLocaleDateString('en-IN')
    };
    setTenants([...tenants, newTenant]);
    alert(`Tenant ${tenantName} provisioned successfully with isolated database schemas.`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>SYSTEM ADMINISTRATION & TENANCY CONSOLE</h1>
          <p className={styles.breadcrumbs}>Home / Admin / Settings Dashboard</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" icon={<Settings size={16} />} onClick={() => alert("Opening general system properties registry...")}>
            Configuration Properties
          </Button>
          <Button variant="primary" icon={<Plus size={16} />} onClick={handleCreateTenant}>
            Provision Tenant
          </Button>
        </div>
      </header>

      {/* KPI Cards Section */}
      <div className={styles.kpiGrid}>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>Active Orgs / Tenants</span>
              <div className={styles.kpiValue} style={{ color: '#071B3B' }}>{tenants.length} Managed Banks</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
              <Layers size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend}>Subdomain resolution active</span>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>Integrations Gateway</span>
              <div className={styles.kpiValue} style={{ color: '#16A34A' }}>
                {integrations.filter(i => i.status === 'Connected').length} / {integrations.length} Connected
              </div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <Database size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend} style={{ color: '#b91c1c' }}>CBS integration needs ping check</span>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>Host Subdomains</span>
              <div className={styles.kpiValue} style={{ color: '#006699' }}>*.vms.qualtech.com</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
              <Globe size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend}>SSL Certificates verified</span>
        </Card>

        <Card className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div>
              <span className={styles.kpiLabel}>Security Enforcements</span>
              <div className={styles.kpiValue} style={{ color: '#16a34a' }}>MFA + Session Locks</div>
            </div>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <ShieldCheck size={24} />
            </div>
          </div>
          <span className={styles.kpiTrend}>RBI CyberSecurity Compliant</span>
        </Card>
      </div>

      {/* Tabs */}
      <div className={styles.tabBar}>
        <button className={`${styles.tabBtn} ${activeTab === 'tenants' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('tenants')}>Tenant & Subdomains</button>
        <button className={`${styles.tabBtn} ${activeTab === 'security' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('security')}>Session & Security Rules</button>
        <button className={`${styles.tabBtn} ${activeTab === 'integrations' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('integrations')}>Integrations Hub Status</button>
      </div>

      <div className={styles.tabContent}>
        {/* TAB 1: Tenants List */}
        {activeTab === 'tenants' && (
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Managed Banking Organizations (Tenants)</span>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tenant ID</th>
                    <th>Organization Legal Name</th>
                    <th>Resolved URL Subdomain</th>
                    <th>Branding Palette Key</th>
                    <th>Onboarded Date</th>
                    <th>State Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map(tenant => (
                    <tr key={tenant.id}>
                      <td style={{ fontWeight: 'bold' }}>{tenant.id}</td>
                      <td><strong>{tenant.name}</strong></td>
                      <td><code>{tenant.subdomain}</code></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={styles.colorIndicator} style={{ backgroundColor: tenant.brandingColor }}></span>
                          <code>{tenant.brandingColor}</code>
                        </div>
                      </td>
                      <td>{tenant.onboardedDate}</td>
                      <td>
                        <Badge variant={tenant.status === 'Active' ? 'success' : tenant.status === 'Maintenance' ? 'warning' : 'danger'}>
                          {tenant.status}
                        </Badge>
                      </td>
                      <td>
                        <Button size="sm" variant="ghost" onClick={() => alert(`Configuring custom workflows for tenant: ${tenant.name}`)}>
                          Edit Workflows
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 2: Session & Security Policy */}
        {activeTab === 'security' && (
          <div className={styles.securityLayout}>
            <Card className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Active Session & Authentication Rules</span>
              </div>
              <div className={styles.configForm}>
                <div className={styles.formRow}>
                  <div className={styles.formMeta}>
                    <strong>Auto Logout Session Timeout</strong>
                    <p>Forcefully terminates user session token after inactivity. Required under RBI compliance rules.</p>
                  </div>
                  <div className={styles.formInput}>
                    <input 
                      type="number" 
                      className={styles.input} 
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                    />
                    <span>Minutes</span>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formMeta}>
                    <strong>Enforce Multi-Factor Authentication (MFA)</strong>
                    <p>Forces all bank and vendor users to supply TOTP/Email verification codes upon logging in.</p>
                  </div>
                  <div className={styles.formInput}>
                    <input 
                      type="checkbox" 
                      checked={mfaForced}
                      onChange={(e) => setMfaForced(e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span>Enforced</span>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formMeta}>
                    <strong>Maximum Auth Attempts Lockout</strong>
                    <p>Blocks IP source for 2 hours if user triggers multiple authentication check failures.</p>
                  </div>
                  <div className={styles.formInput}>
                    <select className={styles.select}>
                      <option value="3">3 Attempts</option>
                      <option value="5">5 Attempts</option>
                      <option value="10">10 Attempts</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <Button variant="primary" onClick={() => alert("Security parameters updated. Force-updating session rules on next check-in cycle.")}>
                    Apply Policy Update
                  </Button>
                </div>
              </div>
            </Card>

            <Card className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Global Whitelist Subnets</span>
              </div>
              <div className={styles.subnetList}>
                <div className={styles.subnetRow}>
                  <span>HDFC HQ Corporate subnet</span>
                  <code>192.168.1.0/24</code>
                </div>
                <div className={styles.subnetRow}>
                  <span>Qualtech Cloud Router endpoint</span>
                  <code>10.0.4.0/22</code>
                </div>
                <div className={styles.subnetRow}>
                  <span>SBI Core clearing node IP</span>
                  <code>203.0.113.12</code>
                </div>
                <Button variant="outline" size="sm" onClick={() => alert("Enter CIDR block pattern to grant access...")} style={{ marginTop: '8px' }}>
                  Add Network Rule
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: Integrations Hub */}
        {activeTab === 'integrations' && (
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Active Enterprise API Endpoints</span>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Integration ID</th>
                    <th>Target Endpoint Service</th>
                    <th>Classification Type</th>
                    <th>Current Connection Latency</th>
                    <th>Integration Status</th>
                    <th>Diagnostic Check</th>
                  </tr>
                </thead>
                <tbody>
                  {integrations.map(node => (
                    <tr key={node.id}>
                      <td style={{ fontWeight: 'bold' }}>{node.id}</td>
                      <td><strong>{node.name}</strong></td>
                      <td>{node.type}</td>
                      <td>
                        <code>{node.latency}</code>
                      </td>
                      <td>
                        <Badge variant={node.status === 'Connected' ? 'success' : node.status === 'Degraded' ? 'warning' : 'danger'}>
                          {node.status}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          icon={<Play size={12} />} 
                          onClick={() => handlePing(node.id, node.name)}
                        >
                          Check Ping
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
