import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, CheckCircle2, UploadCloud, FileText, Trash2, Info, Check } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import styles from './UploadDocument.module.css';

const STEPS = ['Select Type', 'Document Details', 'Upload & Preview', 'Review'];

const DOC_CATEGORIES = [
  { id: 'kyc', name: 'KYC Documents', desc: '(PAN, Aadhaar, etc.)', icon: '👤', value: 'KYC Documents' },
  { id: 'tax', name: 'Tax Documents', desc: '(GST, TDS, etc.)', icon: '📄', value: 'Tax Documents' },
  { id: 'legal', name: 'Legal Documents', desc: '(Incorporation, Agreements)', icon: '⚖️', value: 'Legal Documents' },
  { id: 'finance', name: 'Financial Documents', desc: '(Bank, Statements)', icon: '🏦', value: 'Financial Documents' },
  { id: 'compliance', name: 'Compliance Documents', desc: '(MSME, ISO, Others)', icon: '🛡️', value: 'Compliance Documents' },
  { id: 'other', name: 'Others', desc: '(Any Other Document)', icon: '📁', value: 'Others' },
];

const CATEGORY_MAP: Record<string, string[]> = {
  'KYC Documents': ['PAN Card', 'Aadhaar', 'Passport'],
  'Tax Documents': ['GST Certificate', 'TDS Certificate'],
  'Legal Documents': ['COI', 'Agreements'],
  'Financial Documents': ['Cancelled Cheque', 'Bank Statement'],
  'Compliance Documents': ['MSME', 'ISO Certificates'],
  'Others': ['Others']
};

const DETAIL_MAP: Record<string, string> = {
  'PAN Card': 'Identity Proof',
  'Aadhaar': 'Address Proof',
  'Passport': 'Identity Proof',
  'GST Certificate': 'Tax Registration',
  'TDS Certificate': 'Tax Deduction',
  'COI': 'Incorporation Proof',
  'Agreements': 'Contract Proof',
  'Cancelled Cheque': 'Financial Proof',
  'Bank Statement': 'Financial Proof',
  'MSME': 'Compliance Proof',
  'ISO Certificates': 'Quality Compliance',
  'Others': 'Others'
};

interface Vendor {
  vendorId: string;
  basicDetails?: {
    legalName: string;
  };
}

export const UploadDocument: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form States
  const [documentType, setDocumentType] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [documentCategory, setDocumentCategory] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [issuedBy, setIssuedBy] = useState('');
  const [remarks, setRemarks] = useState('');
  
  // File States
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  // Success API response state
  const [uploadedDocInfo, setUploadedDocInfo] = useState<{ id: string; timestamp: string } | null>(null);

  // Fetch Vendor List
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const res = await axios.get('/api/vendors');
        setVendors(res.data);
        if (res.data.length > 0) {
          setVendorId(res.data[0].vendorId);
          setVendorName(res.data[0].basicDetails?.legalName || '');
        }
      } catch (err) {
        console.error('Error fetching vendors:', err);
        // Fallback mock vendor
        const mockVendors = [
          { vendorId: 'VND-2025-00029', basicDetails: { legalName: 'ABC Infotech Private Limited' } },
          { vendorId: 'VND-2026-88001', basicDetails: { legalName: 'HDFC Bank Limited' } }
        ];
        setVendors(mockVendors);
        setVendorId(mockVendors[0].vendorId);
        setVendorName(mockVendors[0].basicDetails.legalName);
      }
    };
    loadVendors();
  }, []);

  // Update dynamic defaults on type select
  const handleSelectTypeCard = (typeValue: string) => {
    setSelectedType(typeValue);
    setDocumentType(typeValue);
    
    // Default document name selection
    const names = CATEGORY_MAP[typeValue] || ['Others'];
    const defaultName = names[0];
    setDocumentName(defaultName);
    
    // Default document category
    const defaultCat = DETAIL_MAP[defaultName] || 'Others';
    setDocumentCategory(defaultCat);
    
    setCurrentStep(2);
  };

  // Keep type, names and category synced
  const handleDocumentNameChange = (name: string) => {
    setDocumentName(name);
    setDocumentCategory(DETAIL_MAP[name] || 'Others');
  };

  const handleVendorChange = (id: string) => {
    setVendorId(id);
    const selected = vendors.find(v => v.vendorId === id);
    setVendorName(selected?.basicDetails?.legalName || '');
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (selectedFile: File) => {
    setErrorMessage(null);
    const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setErrorMessage('Invalid file type! Only PDF, JPG, JPEG, and PNG are allowed.');
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit.');
      return;
    }
    
    setFile(selectedFile);
    const previewUrl = URL.createObjectURL(selectedFile);
    setFilePreviewUrl(previewUrl);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
  };

  const handleNext = () => {
    if (currentStep === 2) {
      // Step 2 Validations
      if (!vendorId) {
        setErrorMessage('Please select a valid Vendor.');
        return;
      }
      setErrorMessage(null);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Step 3 Validations
      if (!file) {
        setErrorMessage('Please upload a document file to proceed.');
        return;
      }
      setErrorMessage(null);
      setCurrentStep(4);
    } else if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('documentName', documentName);
    formData.append('documentCategory', documentCategory);
    formData.append('vendorId', vendorId);
    formData.append('vendorName', vendorName);
    formData.append('documentNumber', documentNumber);
    formData.append('issueDate', issueDate);
    formData.append('expiryDate', expiryDate);
    formData.append('issuedBy', issuedBy);
    formData.append('remarks', remarks);
    formData.append('uploadedByUserName', 'Saurabh Anand');
    formData.append('uploadedByUserId', 'USR-001');

    try {
      const res = await axios.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setUploadedDocInfo({
          id: res.data.document.documentId,
          timestamp: new Date(res.data.document.uploadedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        });
        setIsSubmitted(true);
      }
    } catch (err: any) {
      console.error('Error uploading document:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setErrorMessage(null);
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/documents');
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSelectedType(null);
    setFile(null);
    setFilePreviewUrl(null);
    setDocumentNumber('');
    setIssueDate('');
    setExpiryDate('');
    setIssuedBy('');
    setRemarks('');
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  if (isSubmitted && uploadedDocInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <CheckCircle2 size={64} color="#16a34a" />
          </div>
          <h2 className={styles.successTitle}>Document Uploaded Successfully!</h2>
          <p className={styles.successDesc}>Your document has been submitted for verification.</p>
          
          <div className={styles.refBox}>
            <div className={styles.refItem}>
              <span>Document ID</span>
              <strong style={{ color: 'var(--color-primary)' }}>{uploadedDocInfo.id}</strong>
            </div>
            <div className={styles.refItem}>
              <span>Submitted On</span>
              <strong>{uploadedDocInfo.timestamp}</strong>
            </div>
          </div>
          
          <div className={styles.successActions}>
            <Button onClick={() => navigate('/documents')}>Go to Document List</Button>
            <Button variant="outline" onClick={resetWizard}>Upload Another Document</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Upload Document</h1>
          <p className={styles.breadcrumbs}>Home / Documents / Upload</p>
        </div>
      </header>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-3">
          <Info size={20} className="text-red-500 shrink-0" />
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}

      <Card className={styles.wizardCard}>
        {/* Stepper */}
        <div className={styles.stepperContainer}>
          {STEPS.map((step, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isPassed = stepNum < currentStep;
            
            return (
              <div key={step} className={styles.stepWrapper}>
                <div className={styles.stepIndicator}>
                  <div className={`${styles.stepCircle} ${isActive ? styles.activeCircle : ''} ${isPassed ? styles.passedCircle : ''}`}>
                    {isPassed ? <Check size={16} /> : stepNum}
                  </div>
                  <span className={`${styles.stepLabel} ${isActive ? styles.activeLabel : ''}`}>{step}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`${styles.stepLine} ${isPassed ? styles.passedLine : ''}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.formContainer}>
          {currentStep === 1 && (
            <div className={styles.selectTypeStep}>
              <h3 className={styles.stepTitle}>Select Document Type</h3>
              
              <div className={styles.categoryGrid}>
                {DOC_CATEGORIES.map(cat => (
                  <div 
                    key={cat.id} 
                    className={`${styles.categoryCard} ${selectedType === cat.value ? styles.selectedCategory : ''}`}
                    onClick={() => handleSelectTypeCard(cat.value)}
                  >
                    <div className={styles.catIcon}>{cat.icon}</div>
                    <div className={styles.catDetails}>
                      <h4>{cat.name}</h4>
                      <p>{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.guidelinesBox}>
                <h4 className="font-semibold text-slate-800"><FileText size={16} className="text-royal-blue inline mr-1"/> Document Upload Guidelines</h4>
                <ul className="text-slate-600 mt-2 list-disc pl-5 grid grid-cols-2 gap-2 text-xs">
                  <li>Allowed file types: PDF, JPG, PNG, JPEG</li>
                  <li>Maximum file size: 10 MB</li>
                  <li>File name should not contain special characters</li>
                  <li>Ensure document is clear and legible</li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.detailsStep}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Document Type *</label>
                  <select 
                    className={styles.selectInput} 
                    value={documentType}
                    onChange={(e) => {
                      setDocumentType(e.target.value);
                      const names = CATEGORY_MAP[e.target.value] || ['Others'];
                      handleDocumentNameChange(names[0]);
                    }}
                  >
                    {Object.keys(CATEGORY_MAP).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Document Name *</label>
                  <select 
                    className={styles.selectInput} 
                    value={documentName}
                    onChange={(e) => handleDocumentNameChange(e.target.value)}
                  >
                    {(CATEGORY_MAP[documentType] || ['Others']).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Document Category *</label>
                  <input 
                    type="text" 
                    className={styles.selectInput} 
                    value={documentCategory}
                    readOnly
                    style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Vendor Mapping *</label>
                  <select 
                    className={styles.selectInput}
                    value={vendorId}
                    onChange={(e) => handleVendorChange(e.target.value)}
                  >
                    <option value="">Select Vendor...</option>
                    {vendors.map(v => (
                      <option key={v.vendorId} value={v.vendorId}>
                        {v.basicDetails?.legalName || v.vendorId}
                      </option>
                    ))}
                  </select>
                </div>

                <Input 
                  label="Document Number" 
                  placeholder="Enter Document Number (e.g. GSTIN, PAN)" 
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                />
                
                <Input 
                  label="Issue Date" 
                  type="date" 
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
                
                <Input 
                  label="Expiry Date (If applicable)" 
                  type="date" 
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />

                <Input 
                  label="Issued By" 
                  placeholder="Government Authority (e.g. Income Tax Dept)" 
                  value={issuedBy}
                  onChange={(e) => setIssuedBy(e.target.value)}
                />
              </div>
              
              <div className={styles.remarksBox}>
                <label className={styles.inputLabel}>Remarks (Optional)</label>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Enter remarks or notes if any..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                ></textarea>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.uploadStep}>
              <div className={styles.uploadCol}>
                <h3 className={styles.stepTitle}>Upload Document</h3>
                
                <div 
                  className={`${styles.dragDropArea} ${dragOver ? styles.selectedCategory : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                  <UploadCloud size={48} color="#1d4ed8" />
                  <p>Drag & drop file here or <span className="underline font-bold">click to browse</span></p>
                  <span className={styles.subText}>Supports PDF, JPG, JPEG, PNG (Max 10MB)</span>
                </div>

                {file && (
                  <div className={styles.uploadedFileCard}>
                    <div className={styles.fileInfo}>
                      <div className={styles.fileIconPdf}>
                        {file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase()}
                      </div>
                      <div>
                        <p>{file.name}</p>
                        <span>{Math.round(file.size / 1024)} KB</span>
                      </div>
                    </div>
                    <button className={styles.deleteBtn} onClick={handleRemoveFile}><Trash2 size={18} /></button>
                  </div>
                )}
              </div>

              <div className={styles.previewCol}>
                <h3 className={styles.stepTitle}>Document Preview</h3>
                <div className={styles.previewBox}>
                  {filePreviewUrl ? (
                    file?.type === 'application/pdf' ? (
                      <iframe 
                        src={`${filePreviewUrl}#toolbar=0`} 
                        title="PDF Preview" 
                        width="100%" 
                        height="100%" 
                        className="border-none"
                      />
                    ) : (
                      <img src={filePreviewUrl} alt="Upload Preview" className={styles.mockPanImg} />
                    )
                  ) : (
                    <div className="text-slate-400 text-sm flex flex-col items-center gap-2">
                      <FileText size={40} className="text-slate-300" />
                      <span>Upload a file to display interactive preview</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className={styles.reviewStep}>
              <div className={styles.reviewGrid}>
                <div className={styles.reviewLeft}>
                  <h3 className={styles.stepTitle}>Document Summary</h3>
                  <div className={styles.reviewData}>
                    <div><span>Document Type</span><strong>{documentType}</strong></div>
                    <div><span>Document Name</span><strong>{documentName}</strong></div>
                    <div><span>Document Category</span><strong>{documentCategory}</strong></div>
                    <div><span>Vendor Name</span><strong>{vendorName}</strong></div>
                    <div><span>Document Number</span><strong>{documentNumber || 'N/A'}</strong></div>
                    <div><span>Issue Date</span><strong>{issueDate || 'N/A'}</strong></div>
                    <div><span>Expiry Date</span><strong>{expiryDate || 'N/A'}</strong></div>
                    <div><span>Issued By</span><strong>{issuedBy || 'N/A'}</strong></div>
                  </div>

                  <div className={styles.declaration}>
                    <label className={styles.checkbox}>
                      <input type="checkbox" defaultChecked /> 
                      I confirm that the uploaded document details and attached files are true, correct and valid.
                    </label>
                  </div>
                </div>

                <div className={styles.reviewRight}>
                  <h3 className={styles.stepTitle}>Uploaded File</h3>
                  {file && (
                    <div className={styles.uploadedFileCard}>
                      <div className={styles.fileInfo}>
                        <div className={styles.fileIconPdf}>
                          {file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="truncate max-w-[150px]">{file.name}</p>
                          <span>{Math.round(file.size / 1024)} KB</span>
                          {filePreviewUrl && (
                            <a 
                              href={filePreviewUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className={styles.viewLink}
                            >
                              Open Preview
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.formFooter}>
          <Button variant="outline" onClick={handleBack} icon={<ChevronLeft size={16}/>}>
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          <div className={styles.footerRight}>
            {currentStep > 1 && (
              <Button variant="ghost" onClick={() => navigate('/documents')}>Save as Draft</Button>
            )}
            {currentStep === 4 ? (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={currentStep === 1 && !selectedType}>
                Next <ChevronRight size={16}/>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
