import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  BrainCircuit
} from 'lucide-react';
import { CatalogueHeader } from './CatalogueHeader';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import styles from './ServiceMaster.module.css';

export const ServiceMaster: React.FC = () => {
  const navigate = useNavigate();
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  // Form states
  const [serviceName, setServiceName] = useState('');
  const [sacCode, setSacCode] = useState('');
  const [category, setCategory] = useState('');
  const [serviceType, setServiceType] = useState('one-time');
  const [slaType, setSlaType] = useState('Standard');
  const [deliverables, setDeliverables] = useState('');
  const [vendorEligibility, setVendorEligibility] = useState('');
  const [coverageArea, setCoverageArea] = useState('National');
  const [pricingModel, setPricingModel] = useState('fixed');
  const [tat, setTat] = useState('');
  const [escalationMatrix, setEscalationMatrix] = useState('');
  const [compliance, setCompliance] = useState('');

  // Load AI recommended SLA template
  const handleLoadSlaTemplate = () => {
    setLoadingTemplate(true);
    setTimeout(() => {
      setSlaType('Premium Business-Critical SLA');
      setTat('Response: <30 mins, Resolution: <4 Hours (24x7)');
      setEscalationMatrix('L1: Helpdesk Coordinator -> L2: Operations Lead (SLA+2h) -> L3: Sourcing Manager (SLA+4h)');
      setDeliverables('Uptime audit logs, Monthly performance scorecard reporting, 24/7 dedicated support representative.');
      setVendorEligibility('Requires ISO 27001 certificate, minimum Dun & Bradstreet risk rating of 3 or better.');
      setCompliance('Compliance: RBI Outsource governance standards compliant (Sec 4a/b)');
      setLoadingTemplate(false);
    }, 1000);
  };

  const handleSave = () => {
    alert("Service Master '"+serviceName+"' has been submitted for approval (Procurement Checker workflow triggered)!");
    navigate('/catalogue/dashboard');
  };

  return (
    <div className={styles.container}>
      <CatalogueHeader 
        title="SERVICE MASTER CREATION" 
        subtitle="Register corporate services, establish SAC codes, pricing schemes, and governance SLAs"
        actions={
          <Button variant="outline" icon={<ArrowLeft size={16} />} onClick={() => navigate('/catalogue/dashboard')}>
            Back to Dashboard
          </Button>
        }
      />

      {/* AI Assistance Panel */}
      <div className={styles.aiPanel}>
        <BrainCircuit size={24} className={styles.aiIcon} />
        <div>
          <div className={styles.aiTitle}>AI Service SLA Architect</div>
          <div className={styles.aiDesc}>
            Let AI build standard compliance and SLA checklists based on banking Outsourcing rules. Click below to load the template.
            <div style={{ marginTop: '8px' }}>
              <Button 
                variant="outline" 
                size="sm" 
                icon={<Sparkles size={14} />} 
                onClick={handleLoadSlaTemplate}
                disabled={loadingTemplate}
                style={{ backgroundColor: 'white', color: '#7c3aed', borderColor: '#d8b4fe' }}
              >
                {loadingTemplate ? "Generating..." : "Load AI SLA Template"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Card className={styles.formCard}>
        <div className={styles.formHeader}>
          <h3 className={styles.sectionTitle}>Service Configuration Form</h3>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>* Mandatory Fields</span>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Service Name *</label>
            <input 
              type="text" 
              className={styles.inputField} 
              placeholder="e.g. Facility Deep Cleaning Service"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>SAC Code (Services Accounting Code) *</label>
            <input 
              type="text" 
              className={styles.inputField} 
              placeholder="e.g. 998713 (IT Services)"
              value={sacCode}
              onChange={(e) => setSacCode(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Service Category *</label>
            <select className={styles.inputField} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              <option value="IT Services">IT Services</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Facility Management">Facility Management</option>
              <option value="Logistics Services">Logistics Services</option>
              <option value="Marketing & Advisory">Marketing & Advisory</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Service Cadence / Type</label>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxItem}>
                <input 
                  type="radio" 
                  name="serviceType" 
                  checked={serviceType === 'one-time'} 
                  onChange={() => setServiceType('one-time')} 
                />
                One-time Ad-hoc Project
              </label>
              <label className={styles.checkboxItem}>
                <input 
                  type="radio" 
                  name="serviceType" 
                  checked={serviceType === 'recurring'} 
                  onChange={() => setServiceType('recurring')} 
                />
                Recurring Retainer SLA
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Pricing Model *</label>
            <select className={styles.inputField} value={pricingModel} onChange={(e) => setPricingModel(e.target.value)}>
              <option value="fixed">Fixed Cost (Lump-sum)</option>
              <option value="time-material">Time & Materials (Hourly/Daily)</option>
              <option value="monthly-retainer">Monthly Retainer</option>
              <option value="unit-rate">Unit Rate (e.g. per delivery/per user)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Service Coverage Area</label>
            <select className={styles.inputField} value={coverageArea} onChange={(e) => setCoverageArea(e.target.value)}>
              <option value="National">National (All Branches)</option>
              <option value="Regional">Regional (East/West/North/South)</option>
              <option value="Local">Local (Single Office/Branch)</option>
            </select>
          </div>

          <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
            <label className={styles.formLabel}>Detailed Scope & Deliverables *</label>
            <textarea 
              className={styles.textareaField} 
              placeholder="State explicit deliverables, outputs, and service scopes..."
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
            />
          </div>

          <div className={styles.formHeader} style={{ gridColumn: 'span 2', marginTop: '16px' }}>
            <h3 className={styles.sectionTitle}>SLA, Turnaround Time & Governance Settings</h3>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>SLA SLA/KPI Category *</label>
            <input 
              type="text" 
              className={styles.inputField} 
              placeholder="e.g. 99.9% Application Uptime"
              value={slaType}
              onChange={(e) => setSlaType(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Turnaround Time (TAT) Commitments *</label>
            <input 
              type="text" 
              className={styles.inputField} 
              placeholder="e.g. 4 Hour response time"
              value={tat}
              onChange={(e) => setTat(e.target.value)}
            />
          </div>

          <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
            <label className={styles.formLabel}>Escalation Matrix Setup</label>
            <textarea 
              className={styles.textareaField} 
              placeholder="Level 1: Support Desk -> Level 2: Project Manager -> Level 3: Vice President Sourcing"
              value={escalationMatrix}
              onChange={(e) => setEscalationMatrix(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Vendor Eligibility Criteria</label>
            <input 
              type="text" 
              className={styles.inputField} 
              placeholder="e.g. Must have active ISO 9001 certifications"
              value={vendorEligibility}
              onChange={(e) => setVendorEligibility(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Regulatory Compliances Mapping</label>
            <input 
              type="text" 
              className={styles.inputField} 
              placeholder="e.g. RBI outsourcing guidelines section 5 compliant"
              value={compliance}
              onChange={(e) => setCompliance(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footerActions}>
          <Button variant="ghost" onClick={() => navigate('/catalogue/dashboard')} style={{ marginRight: '12px' }}>
            Cancel
          </Button>
          <Button variant="primary" icon={<Save size={16} />} onClick={handleSave}>
            Submit Service
          </Button>
        </div>
      </Card>
    </div>
  );
};
