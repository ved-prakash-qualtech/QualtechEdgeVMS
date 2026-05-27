import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, UserCheck, Plus, Check } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './UserRoleManagement.module.css';

const rolesList = [
  { name: 'Super Admin', desc: 'Full root tenant administrative rights' },
  { name: 'Procurement Manager', desc: 'Approves PO requisitions, modifies SLAs' },
  { name: 'Finance Manager', desc: 'Releases payouts, manages tax logs' },
  { name: 'Compliance Officer', desc: 'Performs sanctions and PEP audits' },
  { name: 'Vendor Portal User', desc: 'Uploads invoices, views PO notifications' }
];

const permissionsMatrix = [
  { module: 'Vendors Master', superAdmin: true, procurement: true, finance: false, compliance: true, vendor: false },
  { module: 'Documents OCR', superAdmin: true, procurement: true, finance: false, compliance: true, vendor: true },
  { module: 'Contracts Signature', superAdmin: true, procurement: true, finance: false, compliance: false, vendor: false },
  { module: 'Purchase Requisitions', superAdmin: true, procurement: true, finance: false, compliance: false, vendor: false },
  { module: 'Invoice Match Gates', superAdmin: true, procurement: false, finance: true, compliance: false, vendor: true },
  { module: 'Treasury Payout Release', superAdmin: true, procurement: false, finance: true, compliance: false, vendor: false },
  { module: 'Reports & MIS export', superAdmin: true, procurement: true, finance: true, compliance: true, vendor: false },
  { module: 'System Configurations', superAdmin: true, procurement: false, finance: false, compliance: false, vendor: false },
];

const activeUsers = [
  { name: 'Neha Sharma', email: 'neha.sharma@qualtech.in', role: 'Super Admin', status: 'Active', unit: 'Noida HQ' },
  { name: 'Suresh Kumar', email: 'suresh.kumar@qualtech.in', role: 'Finance Manager', status: 'Active', unit: 'Mumbai Hub' },
  { name: 'Amit Singh', email: 'amit.singh@qualtech.in', role: 'Procurement Manager', status: 'Active', unit: 'Noida HQ' },
  { name: 'Rajesh Patel', email: 'rajesh.patel@qualtech.in', role: 'Compliance Officer', status: 'Active', unit: 'Bangalore Hub' },
];

export const UserRoleManagement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/settings/dashboard')}>
            <ChevronLeft size={16} /> Back to Settings
          </button>
          <h1 className={styles.title}>User & Role Access Management (RBAC)</h1>
          <p className={styles.subtitle}>Define role access permissions, establish segregation of duties, and monitor user logins</p>
        </div>
        <Button icon={<Plus size={16} />}>Create User</Button>
      </header>

      <div className={styles.grid}>
        {/* Roles List */}
        <Card className={styles.card}>
          <div className={styles.cardHeader}>
            <Shield size={18} className={styles.icon} />
            <h3>Organizational Role Catalog</h3>
          </div>
          <div className={styles.rolesList}>
            {rolesList.map(role => (
              <div key={role.name} className={styles.roleItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={styles.roleName}>{role.name}</span>
                  <Badge variant="info">Active</Badge>
                </div>
                <p className={styles.roleDesc}>{role.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Access Matrix Heatmap */}
        <Card className={styles.matrixCard}>
          <div className={styles.cardHeader} style={{ padding: '20px 24px 12px 24px' }}>
            <UserCheck size={18} className={styles.icon} />
            <h3>Granular Permission Access Matrix</h3>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Sourcing Module</th>
                  <th>Super Admin</th>
                  <th>Procurement</th>
                  <th>Finance</th>
                  <th>Compliance</th>
                  <th>Vendor</th>
                </tr>
              </thead>
              <tbody>
                {permissionsMatrix.map(row => (
                  <tr key={row.module}>
                    <td className={styles.moduleName}>{row.module}</td>
                    <td>{row.superAdmin && <Check size={16} className={styles.checkIcon} />}</td>
                    <td>{row.procurement && <Check size={16} className={styles.checkIcon} />}</td>
                    <td>{row.finance && <Check size={16} className={styles.checkIcon} />}</td>
                    <td>{row.compliance && <Check size={16} className={styles.checkIcon} />}</td>
                    <td>{row.vendor && <Check size={16} className={styles.checkIcon} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* User Directory */}
      <Card className={styles.usersCard}>
        <div className={styles.usersHeader}>
          <h3>Active Administrative Users</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email Address</th>
                <th>Assigned Role</th>
                <th>Business Unit</th>
                <th>Account Status</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.map(user => (
                <tr key={user.email}>
                  <td className={styles.userName}>{user.name}</td>
                  <td>{user.email}</td>
                  <td style={{ fontWeight: 600 }}>{user.role}</td>
                  <td>{user.unit}</td>
                  <td>
                    <Badge variant="success">{user.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
