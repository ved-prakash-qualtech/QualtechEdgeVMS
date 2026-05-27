import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Save, Download, Plus, Trash } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import styles from './CustomReportBuilder.module.css';

const SOURCING_SCHEMAS = {
  Vendors: ['Vendor ID', 'Legal Name', 'Onboarding Date', 'Compliance Score', 'Risk Level', 'MSME Status'],
  Contracts: ['Contract ID', 'Vendor', 'Start Date', 'End Date', 'Total Value', 'SLA Adherence'],
  Payments: ['Payment ID', 'UTR Reference', 'Invoice ID', 'Amount', 'Date Processed', 'Status'],
};

export const CustomReportBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSchema, setSelectedSchema] = useState<'Vendors' | 'Contracts' | 'Payments'>('Vendors');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(SOURCING_SCHEMAS.Vendors.slice(0, 4));
  const [filters, setFilters] = useState([{ field: 'Status', operator: 'Equals', value: 'Active' }]);

  const handleColumnToggle = (col: string) => {
    setSelectedColumns(prev => 
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const handleSchemaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const schema = e.target.value as 'Vendors' | 'Contracts' | 'Payments';
    setSelectedSchema(schema);
    setSelectedColumns(SOURCING_SCHEMAS[schema].slice(0, 4));
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/reports/dashboard')}>
            <ChevronLeft size={16} /> Back to MIS
          </button>
          <h1 className={styles.title}>Custom Report Builder</h1>
          <p className={styles.subtitle}>Construct custom analytics templates, apply query filters, and export data models without SQL</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" icon={<Save size={16} />}>Save Template</Button>
          <Button icon={<Play size={16} />}>Execute Sourcing Query</Button>
        </div>
      </header>

      <div className={styles.builderGrid}>
        {/* Left Side: Columns & Filters controls */}
        <Card className={styles.controlCard}>
          <h3 className={styles.panelTitle}>Sourcing Data Source</h3>
          <div className={styles.formGroup}>
            <label>Select Sourcing Schema</label>
            <select className={styles.select} value={selectedSchema} onChange={handleSchemaChange}>
              <option value="Vendors">Vendor Master Records</option>
              <option value="Contracts">Contracts & SLAs</option>
              <option value="Payments">Treasury & Payments Log</option>
            </select>
          </div>

          <h3 className={styles.panelTitle} style={{ marginTop: '24px' }}>Query Columns</h3>
          <div className={styles.columnsList}>
            {SOURCING_SCHEMAS[selectedSchema].map(col => (
              <label key={col} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col)}
                  onChange={() => handleColumnToggle(col)}
                />
                {col}
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            <h3 className={styles.panelTitle} style={{ margin: 0 }}>Sourcing Query Filters</h3>
            <button className={styles.addFilterBtn} onClick={() => setFilters(prev => [...prev, { field: 'Status', operator: 'Equals', value: '' }])}>
              <Plus size={14} /> Add
            </button>
          </div>

          <div className={styles.filterList}>
            {filters.map((filter, index) => (
              <div key={index} className={styles.filterRow}>
                <select className={styles.filterSelect}>
                  {SOURCING_SCHEMAS[selectedSchema].map(f => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
                <select className={styles.filterSelect} style={{ width: '100px' }}>
                  <option>Equals</option>
                  <option>Contains</option>
                  <option>Greater than</option>
                </select>
                <input type="text" className={styles.filterInput} defaultValue={filter.value} />
                <button className={styles.deleteBtn} onClick={() => setFilters(prev => prev.filter((_, i) => i !== index))}>
                  <Trash size={14} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Side: Data Preview Canvas */}
        <Card className={styles.canvasCard}>
          <div className={styles.canvasHeader}>
            <h3>Live Preview (First 5 records matching filters)</h3>
            <div className={styles.canvasActions}>
              <Button variant="ghost" icon={<Download size={14} />}>Export CSV</Button>
            </div>
          </div>

          <div className={styles.previewTableWrapper}>
            <table className={styles.previewTable}>
              <thead>
                <tr>
                  {selectedColumns.map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {selectedColumns.includes('Vendor ID') && <td>VND-2026-9001</td>}
                  {selectedColumns.includes('Legal Name') && <td>ABC Infotech Pvt Ltd</td>}
                  {selectedColumns.includes('Onboarding Date') && <td>12 Jan 2026</td>}
                  {selectedColumns.includes('Compliance Score') && <td>96%</td>}
                  {selectedColumns.includes('Risk Level') && <td>Low</td>}
                  {selectedColumns.includes('MSME Status') && <td>MSME</td>}

                  {selectedColumns.includes('Contract ID') && <td>CON-2026-0012</td>}
                  {selectedColumns.includes('Vendor') && <td>ABC Infotech Pvt Ltd</td>}
                  {selectedColumns.includes('Start Date') && <td>15 Jan 2026</td>}
                  {selectedColumns.includes('End Date') && <td>14 Jan 2027</td>}
                  {selectedColumns.includes('Total Value') && <td>₹1.4 Cr</td>}
                  {selectedColumns.includes('SLA Adherence') && <td>96%</td>}

                  {selectedColumns.includes('Payment ID') && <td>PAY-2026-0087</td>}
                  {selectedColumns.includes('UTR Reference') && <td>HDFCR520260512001</td>}
                  {selectedColumns.includes('Invoice ID') && <td>INV-2026-9908</td>}
                  {selectedColumns.includes('Amount') && <td>₹14.7 L</td>}
                  {selectedColumns.includes('Date Processed') && <td>12 May 2026</td>}
                  {selectedColumns.includes('Status') && <td>Completed</td>}
                </tr>
                <tr>
                  {selectedColumns.includes('Vendor ID') && <td>VND-2026-9002</td>}
                  {selectedColumns.includes('Legal Name') && <td>Secure Facilities Ltd</td>}
                  {selectedColumns.includes('Onboarding Date') && <td>18 Jan 2026</td>}
                  {selectedColumns.includes('Compliance Score') && <td>88%</td>}
                  {selectedColumns.includes('Risk Level') && <td>Medium</td>}
                  {selectedColumns.includes('MSME Status') && <td>Non-MSME</td>}

                  {selectedColumns.includes('Contract ID') && <td>CON-2026-0013</td>}
                  {selectedColumns.includes('Vendor') && <td>Secure Facilities Ltd</td>}
                  {selectedColumns.includes('Start Date') && <td>20 Jan 2026</td>}
                  {selectedColumns.includes('End Date') && <td>19 Jan 2027</td>}
                  {selectedColumns.includes('Total Value') && <td>₹53 L</td>}
                  {selectedColumns.includes('SLA Adherence') && <td>88%</td>}

                  {selectedColumns.includes('Payment ID') && <td>PAY-2026-0088</td>}
                  {selectedColumns.includes('UTR Reference') && <td>HDFCR520260512002</td>}
                  {selectedColumns.includes('Invoice ID') && <td>INV-2026-9907</td>}
                  {selectedColumns.includes('Amount') && <td>₹5.3 L</td>}
                  {selectedColumns.includes('Date Processed') && <td>12 May 2026</td>}
                  {selectedColumns.includes('Status') && <td>Completed</td>}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
