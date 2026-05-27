import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Shield, 
  GitBranch, 
  Link, 
  CheckSquare, 
  AlertTriangle, 
  CheckCircle, 
  Cpu, 
  Bell, 
  Activity, 
  ArrowRight,
  UserPlus,
  Settings2,
  RefreshCw,
  Sparkles,
  Bot
} from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './SettingsDashboard.module.css';

const steps = [
  'Configuration Setup',
  'Role Assignment',
  'Workflow Config',
  'Validation Rules',
  'Security Controls',
  'AI Config',
  'Integration Setup',
  'Compliance Mapping',
  'Testing & Preview',
  'Publish & Activate'
];

const kpiCards = [
  { name: 'Total Users', val: '587', icon: Users, status: 'active', desc: 'Enterprise accounts' },
  { name: 'Active Roles', val: '9', icon: Shield, status: 'active', desc: 'Super admin down to Vendor' },
  { name: 'Active Workflows', val: '12', icon: GitBranch, status: 'active', desc: 'Dual-pane visual route' },
  { name: 'Enabled Integrations', val: '8/10', icon: Link, status: 'active', desc: 'SAP, Oracle, GSTN active' },
  { name: 'Pending Approvals', val: '3', icon: CheckSquare, status: 'warning', desc: 'Maker-checker gate' },
  { name: 'Security Alerts', val: '0', icon: AlertTriangle, status: 'success', desc: 'Zero threats logged' },
  { name: 'Compliance Policies', val: '15', icon: CheckCircle, status: 'active', desc: 'MSME, TDS & KYC rules' },
  { name: 'AI Automations', val: '4', icon: Cpu, status: 'active', desc: 'OCR & risk scorers' },
  { name: 'Active Notifications', val: '2', icon: Bell, status: 'active', desc: 'Alert triggers active' },
  { name: 'System Health', val: '99.8%', icon: Activity, status: 'success', desc: 'All microservices normal' }
];

export const SettingsDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Settings & Configuration Dashboard</h1>
          <p className={styles.subtitle}>Configure organizational policies, manage RBAC privileges, orchestrate integrations, and trigger version publishes</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" icon={<RefreshCw size={16} />}>Diagnostics</Button>
          <Button icon={<Settings2 size={16} />} onClick={() => navigate('/settings/publish')}>Publish Config</Button>
        </div>
      </header>

      {/* 10-step horizontal configuration stepper */}
      <Card className={styles.stepperCard}>
        <h3 className={styles.sectionTitle}>Global Configuration Lifecycle</h3>
        <div className={styles.stepperScroll}>
          <div className={styles.stepperContainer}>
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <div className={styles.stepItem}>
                  <div className={`${styles.stepCircle} ${index === 0 ? styles.stepCircleActive : ''}`}>
                    {index + 1}
                  </div>
                  <span className={styles.stepLabel}>{step}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight size={14} className={styles.stepArrow} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Card>

      {/* 10 KPI Cards */}
      <div className={styles.kpiGrid}>
        {kpiCards.map(card => {
          const IconComp = card.icon;
          return (
            <Card key={card.name} className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span>{card.name}</span>
                <IconComp size={16} className={card.status === 'success' ? styles.iconGreen : card.status === 'warning' ? styles.iconOrange : styles.iconBlue} />
              </div>
              <div className={styles.kpiValue}>{card.val}</div>
              <div className={styles.kpiDesc}>
                {card.desc}
              </div>
            </Card>
          );
        })}
      </div>

      <div className={styles.bottomGrid}>
        {/* Quick Actions Panel */}
        <Card className={styles.actionCard}>
          <h3 className={styles.sectionTitle}>Administrative Action Center</h3>
          <div className={styles.actionGrid}>
            <button className={styles.actionBtn} onClick={() => navigate('/settings/roles')}>
              <div className={styles.actionIconBox}><UserPlus size={18} /></div>
              <div className={styles.actionText}>
                <strong>Add User / Role</strong>
                <p>Register identity parameters</p>
              </div>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/settings/workflow')}>
              <div className={styles.actionIconBox}><GitBranch size={18} /></div>
              <div className={styles.actionText}>
                <strong>Orchestrate Workflow</strong>
                <p>Map approvals routing</p>
              </div>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/settings/integrations')}>
              <div className={styles.actionIconBox}><Link size={18} /></div>
              <div className={styles.actionText}>
                <strong>Test Integration APIs</strong>
                <p>Poll middleware connections</p>
              </div>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/settings/org')}>
              <div className={styles.actionIconBox}><Settings2 size={18} /></div>
              <div className={styles.actionText}>
                <strong>Branding & Profile</strong>
                <p>Modify logos & units</p>
              </div>
            </button>
          </div>
        </Card>

        {/* AI Admin Intelligence Recommendations */}
        <Card className={styles.aiCard}>
          <div className={styles.aiHeader}>
            <Bot size={20} className={styles.aiHeaderIcon} />
            <h3 className={styles.sectionTitle} style={{ margin: 0 }}>AI Intelligence Insights</h3>
          </div>
          <div className={styles.aiList}>
            <div className={styles.aiItem}>
              <Sparkles size={16} className={styles.aiIconBlue} />
              <div>
                <p className={styles.aiText}><strong>Workflow Bottleneck Alert</strong>: Invoice approvals for Facilities are averaging 4.5 days under level 2 review. AI suggests enabling auto-escalations.</p>
                <button className={styles.aiLink} onClick={() => navigate('/settings/workflow')}>Optimize Invoice Route</button>
              </div>
            </div>
            <div className={styles.aiItem}>
              <AlertTriangle size={16} className={styles.aiIconOrange} />
              <div>
                <p className={styles.aiText}><strong>Security Compliance Warning</strong>: 12 inactive vendor portal roles have been identified. Revoking unused credentials will strengthen SOC2 compliance.</p>
                <button className={styles.aiLink} onClick={() => navigate('/settings/roles')}>Prune Inactive Accounts</button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* System Health Status table */}
      <Card className={styles.healthCard}>
        <div className={styles.healthHeader}>
          <h3>Core Integration & System Health Status</h3>
          <Badge variant="success">All Services Operational</Badge>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>API Uptime</th>
                <th>Sync Status</th>
                <th>Security Level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.serviceName}>SAP ERP S/4HANA Middleware</td>
                <td>Enterprise Resource Planning</td>
                <td>99.98%</td>
                <td><Badge variant="success">Synced</Badge></td>
                <td>AES-256 Encrypted</td>
              </tr>
              <tr>
                <td className={styles.serviceName}>GSTN Validation Validator</td>
                <td>Regulatory & Compliance</td>
                <td>99.95%</td>
                <td><Badge variant="success">Active</Badge></td>
                <td>TLS 1.3 Secure</td>
              </tr>
              <tr>
                <td className={styles.serviceName}>HDFC Bank Disbursal API</td>
                <td>Treasury Payment Gateway</td>
                <td>99.99%</td>
                <td><Badge variant="success">Synced</Badge></td>
                <td>Maker-Checker Managed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
