import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Scale, 
  ShieldCheck, 
  Award,
  Truck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { CatalogueHeader } from './CatalogueHeader';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './VendorComparison.module.css';

interface VendorCompareMetric {
  vendorId: string;
  vendorName: string;
  price: number;
  leadTimeDays: number;
  capacityPerMonth: number;
  qualityScore: number;
  slaAdherence: number;
  riskClass: 'Low' | 'Medium' | 'High';
  kycStatus: 'Verified' | 'Pending' | 'Expired';
  isMsme: boolean;
  isAiPreferred: boolean;
  remarks: string;
}

interface ItemComparisonData {
  itemId: string;
  itemName: string;
  vendors: VendorCompareMetric[];
}

const COMPARISON_MOCK: ItemComparisonData[] = [
  {
    itemId: 'CAT-001',
    itemName: 'Dell Latitude 5420 Laptop',
    vendors: [
      {
        vendorId: 'VND-084',
        vendorName: 'ABC Infotech Pvt Ltd',
        price: 72500,
        leadTimeDays: 8,
        capacityPerMonth: 150,
        qualityScore: 96,
        slaAdherence: 95,
        riskClass: 'Low',
        kycStatus: 'Verified',
        isMsme: true,
        isAiPreferred: true,
        remarks: 'Lowest price matching quality parameters, fast dispatch times.'
      },
      {
        vendorId: 'VND-105',
        vendorName: 'Tech Solutions Ltd',
        price: 74900,
        leadTimeDays: 5,
        capacityPerMonth: 200,
        qualityScore: 98,
        slaAdherence: 98,
        riskClass: 'Low',
        kycStatus: 'Verified',
        isMsme: false,
        isAiPreferred: false,
        remarks: 'Faster delivery but 3.3% higher unit cost than L1 bidder.'
      },
      {
        vendorId: 'VND-192',
        vendorName: 'Global Distributors Co',
        price: 76000,
        leadTimeDays: 14,
        capacityPerMonth: 50,
        qualityScore: 88,
        slaAdherence: 89,
        riskClass: 'Medium',
        kycStatus: 'Verified',
        isMsme: true,
        isAiPreferred: false,
        remarks: 'Higher price and extended lead time. Alternate supply only.'
      }
    ]
  },
  {
    itemId: 'CAT-003',
    itemName: 'Ergonomic Office Chair',
    vendors: [
      {
        vendorId: 'VND-022',
        vendorName: 'Office Supplies Co',
        price: 8400,
        leadTimeDays: 3,
        capacityPerMonth: 500,
        qualityScore: 84,
        slaAdherence: 90,
        riskClass: 'Low',
        kycStatus: 'Verified',
        isMsme: true,
        isAiPreferred: true,
        remarks: 'Local supplier, BIFMA certified, excellent logistics connectivity.'
      },
      {
        vendorId: 'VND-119',
        vendorName: 'Comfort Seating Systems',
        price: 8900,
        leadTimeDays: 7,
        capacityPerMonth: 300,
        qualityScore: 92,
        slaAdherence: 94,
        riskClass: 'Low',
        kycStatus: 'Verified',
        isMsme: true,
        isAiPreferred: false,
        remarks: 'Higher build quality score but delivery takes 4 additional days.'
      }
    ]
  }
];

export const VendorComparison: React.FC = () => {
  const navigate = useNavigate();
  const [selectedItemId, setSelectedItemId] = useState(COMPARISON_MOCK[0].itemId);

  const selectedData = COMPARISON_MOCK.find(item => item.itemId === selectedItemId) || COMPARISON_MOCK[0];

  const chartData = selectedData.vendors.map(vendor => ({
    name: vendor.vendorName.substring(0, 15) + '...',
    'Price (INR)': vendor.price,
    'Lead Time (Days)': vendor.leadTimeDays * 5000 // scaling lead time to display on same bar chart logically
  }));

  return (
    <div className={styles.container}>
      <CatalogueHeader 
        title="VENDOR CATALOGUE COMPARISON" 
        subtitle="Perform side-by-side analysis of vendor pricing, capacity, lead times, SLA compliance, and MSME/Risk indicators"
        actions={
          <Button variant="outline" icon={<ArrowLeft size={16} />} onClick={() => navigate('/catalogue/dashboard')}>
            Back to Dashboard
          </Button>
        }
      />

      {/* Item Selector Section */}
      <div className={styles.selectorCard}>
        <div className={styles.selectorRow}>
          <div className={styles.selectorGroup}>
            <label className={styles.selectorLabel}>Select Catalogue Item for Sourcing Analysis</label>
            <select 
              className={styles.selectInput}
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
            >
              {COMPARISON_MOCK.map(item => (
                <option key={item.itemId} value={item.itemId}>
                  {item.itemName} ({item.itemId})
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ flexGrow: 1 }} />
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <Badge variant="success" icon={<ShieldCheck size={12} />}>RBI KYC Compliant</Badge>
            <Badge variant="info" icon={<Scale size={12} />}>L1 Sourcing Optimization active</Badge>
          </div>
        </div>

        {/* AI Insight Box */}
        {selectedData.vendors.some(v => v.isAiPreferred) && (
          <div className={styles.recommendationBox}>
            <Sparkles size={20} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
            <div className={styles.recText}>
              <span>AI Recommendation Engine: </span>
              We recommend routing this purchase to <strong>{selectedData.vendors.find(v => v.isAiPreferred)?.vendorName}</strong>. 
              They offer L1 pricing at <strong>₹{selectedData.vendors.find(v => v.isAiPreferred)?.price.toLocaleString()}</strong>, 
              meeting all quality standards (Score: {selectedData.vendors.find(v => v.isAiPreferred)?.qualityScore}%) 
              with low delivery risk indicators (SLA Compliance: {selectedData.vendors.find(v => v.isAiPreferred)?.slaAdherence}%).
            </div>
          </div>
        )}
      </div>

      {/* Side-by-side Comparison Matrix */}
      <div className={styles.comparisonMatrix}>
        {selectedData.vendors.map((vendor, idx) => (
          <div 
            key={vendor.vendorId} 
            className={`${styles.vendorCard} ${vendor.isAiPreferred ? styles.vendorCardBest : ''}`}
          >
            <div className={styles.vendorHeader}>
              <div>
                <span className={styles.vendorCode}>{vendor.vendorId}</span>
                <h3 className={styles.vendorName}>{vendor.vendorName}</h3>
              </div>
              <Badge variant={vendor.isAiPreferred ? 'success' : 'default'}>
                Rank {idx + 1}
              </Badge>
            </div>

            <div className={styles.metricList}>
              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Ref Unit Price</span>
                <span className={styles.metricValue} style={{ color: 'var(--color-primary)', fontSize: '15px' }}>
                  ₹{vendor.price.toLocaleString()}
                </span>
              </div>

              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Expected Lead Time</span>
                <span className={styles.metricValue} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Truck size={14} /> {vendor.leadTimeDays} Days
                </span>
              </div>

              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Monthly Capacity</span>
                <span className={styles.metricValue}>{vendor.capacityPerMonth} Units</span>
              </div>

              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>SLA Compliance</span>
                <span className={styles.metricValue} style={{ color: vendor.slaAdherence >= 95 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                  {vendor.slaAdherence}%
                </span>
              </div>

              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Quality Score</span>
                <span className={styles.metricValue} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={14} style={{ color: '#f59e0b' }} /> {vendor.qualityScore}/100
                </span>
              </div>

              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Risk Level</span>
                <span className={styles.metricValue}>
                  <Badge variant={vendor.riskClass === 'Low' ? 'success' : vendor.riskClass === 'Medium' ? 'warning' : 'danger'}>
                    {vendor.riskClass} Risk
                  </Badge>
                </span>
              </div>

              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>KYC Status</span>
                <span className={styles.metricValue}>
                  <Badge variant={vendor.kycStatus === 'Verified' ? 'success' : 'warning'}>
                    {vendor.kycStatus}
                  </Badge>
                </span>
              </div>

              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>MSME Classification</span>
                <span className={styles.metricValue}>
                  {vendor.isMsme ? 'Yes (Micro/Small)' : 'No (Large Enterprise)'}
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', fontSize: '12px', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
              <strong>L1 Analyst Review:</strong> {vendor.remarks}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
              <Button fullWidth variant={vendor.isAiPreferred ? 'primary' : 'outline'} onClick={() => alert(`Sourcing transaction initialized with ${vendor.vendorName}`)}>
                Select for Purchase Requisition
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Chart Comparison */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Unit Cost vs Lead Time Comparison Chart</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#1D4ED8" label={{ value: 'Unit Price (₹)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#16A34A" label={{ value: 'Lead Time (Days)', angle: 90, position: 'insideRight' }} />
              <Tooltip formatter={(value: any, name: any) => {
                if (name === 'Price (INR)') return [`₹${value.toLocaleString()}`, name];
                return [`${Number(value) / 5000} Days`, name];
              }} />
              <Legend />
              <Bar yAxisId="left" dataKey="Price (INR)" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="Lead Time (Days)" fill="#16A34A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
