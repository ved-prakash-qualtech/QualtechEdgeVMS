import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import { DataTable } from '../../components/DataTable/DataTable';
import { getRenewalContracts } from '../../services/contractService';
import type { RenewalRecord } from '../../services/contractService';
import styles from './Renewals.module.css';

export const Renewals: React.FC = () => {
  const navigate = useNavigate();
  const [renewals, setRenewals] = useState<RenewalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRenewals() {
      try {
        const list = await getRenewalContracts();
        setRenewals(list);
      } catch (err) {
        console.error('Failed to load renewals data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRenewals();
  }, []);

  const handleNotifyOwner = (row: RenewalRecord) => {
    alert(`Renewal notification email successfully sent to ${row.owner} for Contract ${row.contractId}.`);
  };

  const handleInitiateRenewal = (row: RenewalRecord) => {
    alert(`Initiating contract amendment & renewal wizard for ${row.contractId} (${row.vendorName}).`);
    navigate('/contracts/create');
  };

  const columns = [
    { header: 'Contract ID', accessor: 'contractId' as keyof RenewalRecord },
    { header: 'Vendor Name', accessor: 'vendorName' as keyof RenewalRecord },
    { header: 'Contract Type', accessor: 'contractType' as keyof RenewalRecord },
    { header: 'Expiry Date', accessor: 'expiryDate' as keyof RenewalRecord },
    { header: 'Owner', accessor: 'owner' as keyof RenewalRecord },
    { 
      header: 'Action / Status', 
      accessor: (row: any) => {
        let variant: 'success' | 'warning' | 'info' | 'default' = 'default';
        if (row.status === 'Auto-Renew') variant = 'success';
        if (row.status === 'In Review') variant = 'warning';
        if (row.status === 'Pending') variant = 'info';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    },
    {
      header: 'Operations',
      align: 'center' as const,
      accessor: (row: RenewalRecord) => (
        <div className={styles.actionsCell}>
          <Button 
            variant="outline" 
            size="sm" 
            icon={<Send size={12} />} 
            onClick={() => handleNotifyOwner(row)}
            title="Notify Owner"
          >
            Notify
          </Button>
          <Button 
            size="sm" 
            icon={<RefreshCw size={12} />} 
            onClick={() => handleInitiateRenewal(row)}
            title="Initiate Renewal"
          >
            Initiate
          </Button>
        </div>
      )
    }
  ];

  const expiringCount = renewals.filter(r => r.status === 'Pending').length;

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Renewals Tracker</h1>
          <p className={styles.breadcrumbs}>Home / Contracts / Renewals</p>
        </div>
      </header>

      {expiringCount > 0 && (
        <Card className={styles.alertCard}>
          <AlertTriangle size={24} className={styles.alertIcon} />
          <div className={styles.alertContent}>
            <h3>Attention Needed: {expiringCount} Expiries Pending Action</h3>
            <p>There are {expiringCount} active contracts expiring in the next 30 days. Please trigger renewal alerts or execute amendments to avoid compliance gap issues.</p>
          </div>
        </Card>
      )}

      <Card className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>Contract Renewal Pipeline</h3>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading expiring contracts list...
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={renewals} 
            keyExtractor={(row) => row.contractId} 
          />
        )}
      </Card>
    </div>
  );
};
