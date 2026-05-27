import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Link2
} from 'lucide-react';
import { CatalogueHeader } from './CatalogueHeader';
import { Button } from '../../components/Button/Button';
import styles from './UomManagement.module.css';

interface UomItem {
  code: string;
  name: string;
  type: string;
}

interface UomConversion {
  id: string;
  fromUnit: string;
  toUnit: string;
  factor: number;
}

export const UomManagement: React.FC = () => {
  const [uoms, setUoms] = useState<UomItem[]>([
    { code: 'Nos', name: 'Numbers / Pieces', type: 'Quantity' },
    { code: 'KG', name: 'Kilograms', type: 'Weight' },
    { code: 'Ltr', name: 'Liters', type: 'Volume' },
    { code: 'Box', name: 'Box Packaging', type: 'Packaging' },
    { code: 'Pack', name: 'Packet (Standard)', type: 'Packaging' },
    { code: 'Hr', name: 'Hours', type: 'Time' },
    { code: 'Mo', name: 'Months', type: 'Time' }
  ]);

  const [conversions, setConversions] = useState<UomConversion[]>([
    { id: '1', fromUnit: 'Box', toUnit: 'Nos', factor: 24 },
    { id: '2', fromUnit: 'Pack', toUnit: 'Nos', factor: 500 },
    { id: '3', fromUnit: 'Mo', toUnit: 'Hr', factor: 160 }
  ]);

  // Form states
  const [fromUnit, setFromUnit] = useState('Box');
  const [toUnit, setToUnit] = useState('Nos');
  const [factor, setFactor] = useState('');

  const handleAddUom = () => {
    const code = prompt("Enter new UOM Code (e.g. Set):");
    const name = prompt("Enter new UOM Name (e.g. Custom Set):");
    if (!code || !name) return;
    setUoms(prev => [...prev, { code, name, type: 'Quantity' }]);
  };

  const handleAddConversion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!factor) return;
    const newConv: UomConversion = {
      id: Math.random().toString(),
      fromUnit,
      toUnit,
      factor: parseFloat(factor)
    };
    setConversions(prev => [...prev, newConv]);
    setFactor('');
  };

  const handleRemoveConversion = (id: string) => {
    setConversions(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className={styles.container}>
      <CatalogueHeader 
        title="UOM CONFIGURATION" 
        subtitle="Specify standard purchasing units, pack sizing, and volumetric conversion ratios"
      />

      <div className={styles.uomGrid}>
        {/* Left Side: Standard Units list */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <span>Master Unit of Measurement (UOM)</span>
            <Button size="sm" icon={<Plus size={14} />} onClick={handleAddUom}>Add Unit</Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {uoms.map(u => (
              <div key={u.code} className={styles.uomRow}>
                <div>
                  <span className={styles.uomCode}>{u.code}</span>
                  <span className={styles.uomName}>{u.name}</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--color-background)' }}>
                  {u.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Conversion Factors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Unit Conversion Form</h3>
            <form onSubmit={handleAddConversion}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>From Unit</label>
                <select className={styles.inputField} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                  {uoms.map(u => (
                    <option key={u.code} value={u.code}>{u.code} ({u.name})</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>To Unit</label>
                <select className={styles.inputField} value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                  {uoms.map(u => (
                    <option key={u.code} value={u.code}>{u.code} ({u.name})</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Multiplication Factor Ratio</label>
                <input 
                  type="number" 
                  className={styles.inputField} 
                  placeholder="e.g. 24" 
                  value={factor}
                  onChange={(e) => setFactor(e.target.value)}
                />
              </div>

              <div style={{ marginTop: '16px' }}>
                <Button type="submit" fullWidth icon={<Link2 size={16} />}>Create Unit Link</Button>
              </div>
            </form>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Active Conversion Relationships</h3>
            <div>
              {conversions.map(c => (
                <div key={c.id} className={styles.conversionItem}>
                  <div>
                    <div className={styles.formula}>1 {c.fromUnit} = {c.factor} {c.toUnit}</div>
                    <div className={styles.formulaDesc}>Mapped for standard inventory calculations</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    icon={<Trash2 size={14} />} 
                    onClick={() => handleRemoveConversion(c.id)}
                    style={{ color: 'var(--color-danger)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
