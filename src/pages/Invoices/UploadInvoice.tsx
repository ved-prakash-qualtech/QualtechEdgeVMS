import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Upload, FileText, Bot, Check, AlertTriangle, Scale } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import styles from './UploadInvoice.module.css';

const STEPS = [
  'Upload File',
  'OCR & AI Extraction',
  '3-Way Matching',
  'Review & Submit'
];

export const UploadInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNext = () => {
    if (currentStep === 1) {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setCurrentStep(2);
      }, 1500);
    } else if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setIsSubmitted(true);
      }, 1500);
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <CheckCircle2 size={64} color="#16a34a" />
          </div>
          <h2 className={styles.successTitle}>Invoice Uploaded Successfully!</h2>
          <p className={styles.successDesc}>
            Invoice **INV-2026-9908** for **ABC Infotech Pvt Ltd** has been queued for Checker validation and 3-Way Match confirmation.
          </p>
          <div className={styles.successActions}>
            <Button onClick={() => navigate('/invoices/dashboard')}>Go to Dashboard</Button>
            <Button variant="outline" onClick={() => { setIsSubmitted(false); setCurrentStep(1); }}>Upload Another</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/invoices/dashboard')}>
            <ChevronLeft size={16} /> Back to Dashboard
          </button>
          <h1 className={styles.title}>Invoice Intake Pipeline</h1>
        </div>
        <div className={styles.stepperContainer}>
          {STEPS.map((step, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div key={step} className={styles.stepWrapper}>
                <div className={styles.stepIndicator}>
                  <div className={`${styles.stepCircle} ${isActive ? styles.activeCircle : ''} ${isCompleted ? styles.completedCircle : ''}`}>
                    {isCompleted ? <CheckCircle2 size={16} /> : stepNum}
                  </div>
                  <span className={`${styles.stepLabel} ${isActive || isCompleted ? styles.activeLabel : ''}`}>
                    {step}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`${styles.stepLine} ${isCompleted ? styles.completedLine : ''}`} />
                )}
              </div>
            );
          })}
        </div>
      </header>

      <div className={styles.contentArea}>
        {currentStep === 1 && (
          <Card className={styles.formCard}>
            <h3 className={styles.formTitle}>Ingest Digital Invoice</h3>
            
            <div className={styles.dropzone}>
              <Upload size={48} className={styles.uploadIcon} />
              <h4>Drag & drop invoice document here</h4>
              <p>Supports PDF, E-Invoice JSON, XML, JPG, PNG up to 10MB</p>
              <input type="file" style={{ display: 'none' }} id="file-upload" onChange={handleNext} />
              <label htmlFor="file-upload" className={styles.uploadBtnLabel}>
                Browse Files
              </label>
            </div>

            <div className={styles.ingestionGrid}>
              <div className={styles.ingestOption}>
                <FileText size={24} color="#1d4ed8" />
                <div>
                  <h5>Email Auto-Capture</h5>
                  <p>Invoices sent to **ap-inbox@qualtech.com** are parsed automatically.</p>
                </div>
              </div>
              <div className={styles.ingestOption}>
                <Bot size={24} color="#7c3aed" />
                <div>
                  <h5>Vendor Portal Sync</h5>
                  <p>Auto-pull approved bills directly from the connected vendor hubs.</p>
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <Button variant="ghost" onClick={() => navigate('/invoices/dashboard')}>Cancel</Button>
              <Button onClick={handleNext} disabled={isUploading}>
                {isUploading ? 'Ingesting Document...' : 'Next: OCR & AI Extraction \u2192'}
              </Button>
            </div>
          </Card>
        )}

        {currentStep === 2 && (
          <div className={styles.splitLayout}>
            {/* Left - Simulated File Preview */}
            <Card className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <FileText size={18} />
                <span>Simulated_Invoice_ABC.pdf</span>
              </div>
              <div className={styles.simulatedDocument}>
                <div className={styles.docHeader}>
                  <h3>INVOICE</h3>
                  <p>ABC Infotech Pvt Ltd</p>
                  <p>GSTIN: 27AAAAA1111A1Z1</p>
                </div>
                <div className={styles.docDetails}>
                  <p><strong>Invoice No:</strong> INV-2026-9908</p>
                  <p><strong>Date:</strong> 12 May 2026</p>
                  <p><strong>PO Ref:</strong> PO-2026-000789</p>
                </div>
                <hr className={styles.docDivider} />
                <div className={styles.docItems}>
                  <div className={styles.docItemRow}>
                    <span>IT Consulting Services (1 Month)</span>
                    <span>₹12,50,000</span>
                  </div>
                </div>
                <hr className={styles.docDivider} />
                <div className={styles.docFooter}>
                  <p>GST (18%): ₹2,25,000</p>
                  <h4>Total Amount: ₹14,75,000</h4>
                </div>
              </div>
            </Card>

            {/* Right - AI Extracted Data Form */}
            <Card className={styles.extractedCard}>
              <div className={styles.aiExtractionBadge}>
                <Bot size={18} />
                <span>AI OCR confidence: <strong>99.4%</strong> (Extraction Completed)</span>
              </div>

              <h3 className={styles.formTitle} style={{ marginTop: '16px' }}>Verify Extracted Details</h3>
              <div className={styles.formGrid}>
                <Input label="Invoice Number" defaultValue="INV-2026-9908" />
                <Input label="PO Reference" defaultValue="PO-2026-000789" />
                <div className={styles.formGroup}>
                  <label>Vendor Name</label>
                  <select className={styles.select}>
                    <option selected>ABC Infotech Pvt Ltd</option>
                    <option>Secure Facilities Ltd</option>
                  </select>
                </div>
                <Input label="Invoice Date" type="date" defaultValue="2026-05-12" />
                <Input label="Total Amount (₹)" type="number" defaultValue="1475000" />
                <Input label="Tax Amount (₹)" type="number" defaultValue="225000" />
                <Input label="GSTIN" defaultValue="27AAAAA1111A1Z1" />
                <Input label="HSN/SAC Code" defaultValue="998311" />
              </div>

              <div className={styles.formActions} style={{ marginTop: '24px' }}>
                <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
                <Button onClick={handleNext}>Next: Run 3-Way Match &rarr;</Button>
              </div>
            </Card>
          </div>
        )}

        {currentStep === 3 && (
          <Card className={styles.formCard}>
            <h3 className={styles.formTitle}>Simulated 3-Way Matching</h3>
            
            <div className={styles.matchingPanel}>
              <div className={styles.matchingHeader}>
                <Scale size={24} className={styles.scaleIcon} />
                <div>
                  <h4>Automated Comparison Checks</h4>
                  <p>Cross-referencing Purchase Order (PO-2026-000789), Goods Receipt Note (GRN), and Invoice.</p>
                </div>
              </div>

              <div className={styles.matchGrid}>
                <div className={styles.matchHeaderRow}>
                  <span>Check Category</span>
                  <span>Invoice Value</span>
                  <span>PO Value</span>
                  <span>GRN Value</span>
                  <span>Status</span>
                </div>
                
                <div className={styles.matchRow}>
                  <span className={styles.matchCategory}>Unit Price</span>
                  <span>₹12,50,000</span>
                  <span>₹12,50,000</span>
                  <span>₹12,50,000</span>
                  <span className={styles.matchBadgeSuccess}><Check size={14} /> Matched</span>
                </div>

                <div className={styles.matchRow}>
                  <span className={styles.matchCategory}>Quantity</span>
                  <span>1 Unit</span>
                  <span>1 Unit</span>
                  <span>1 Unit</span>
                  <span className={styles.matchBadgeSuccess}><Check size={14} /> Matched</span>
                </div>

                <div className={styles.matchRow}>
                  <span className={styles.matchCategory}>GSTIN Verify</span>
                  <span>27AAAAA1111A1Z1</span>
                  <span>27AAAAA1111A1Z1</span>
                  <span>-</span>
                  <span className={styles.matchBadgeSuccess}><Check size={14} /> Matched</span>
                </div>

                <div className={styles.matchRow}>
                  <span className={styles.matchCategory}>Tax Percentage</span>
                  <span>18%</span>
                  <span>18%</span>
                  <span>-</span>
                  <span className={styles.matchBadgeSuccess}><Check size={14} /> Matched</span>
                </div>
              </div>

              <div className={styles.matchingResultSuccess}>
                <Bot size={18} style={{ color: '#16a34a' }} />
                <span>**AI Validation**: 3-Way Match completed successfully. No variances found in price, quantity, or tax structures.</span>
              </div>
            </div>

            <div className={styles.formActions}>
              <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
              <Button onClick={handleNext}>Next: Final Review &rarr;</Button>
            </div>
          </Card>
        )}

        {currentStep === 4 && (
          <Card className={styles.formCard}>
            <h3 className={styles.formTitle}>Review & Submit to Approvals</h3>

            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Invoice Number</span>
                <span className={styles.summaryValue}>INV-2026-9908</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Vendor Name</span>
                <span className={styles.summaryValue}>ABC Infotech Pvt Ltd</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Associated PO</span>
                <span className={styles.summaryValue}>PO-2026-000789</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Grand Total (with Tax)</span>
                <span className={styles.summaryValue}>₹14,75,000</span>
              </div>
            </div>

            <div className={styles.complianceNotice}>
              <AlertTriangle size={18} className={styles.noticeIcon} />
              <div>
                <h5>TDS Applicable</h5>
                <p>Section 194J (Professional Fees) applies to this invoice. TDS deduction of 10% (₹1,25,000) will be withheld automatically at disbursement.</p>
              </div>
            </div>

            <div className={styles.declaration}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked />
                I confirm that the extracted OCR values match the uploaded invoice PDF, and GSTIN/PAN matching has been verified.
              </label>
            </div>

            <div className={styles.formActions}>
              <Button variant="outline" onClick={() => setCurrentStep(3)}>Back</Button>
              <Button onClick={handleNext} disabled={isUploading}>
                {isUploading ? 'Submitting Invoice...' : 'Submit to Checker Flow'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
