import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronRight, CheckCircle2, XCircle, Send, AlertCircle } from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './DocumentApprovals.module.css';

interface Document {
  documentId: string;
  documentType: string;
  documentName: string;
  documentCategory: string;
  vendor: {
    vendorId: string;
    vendorName: string;
  };
  documentNumber: string;
  issueDate: string | null;
  expiryDate: string | null;
  issuedBy: string;
  remarks: string;
  verificationStatus: string;
  approvalStatus: string;
  uploadedAt: string;
  uploadedBy: {
    userId: string;
    userName: string;
  };
  fileDetails: {
    originalFileName: string;
    storedFileName: string;
    filePath: string;
    fileType: string;
    fileSizeKB: number;
    fileExtension: string;
  };
}

export const DocumentApprovals: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [remarks, setRemarks] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/documents?status=Pending Verification');
      const pendingDocs = res.data;
      setDocuments(pendingDocs);
      
      // Auto-select first item or maintain selection if it still exists in the pending list
      if (pendingDocs.length > 0) {
        setSelectedDoc((prevSelected) => {
          if (prevSelected) {
            const stillExists = pendingDocs.find((d: Document) => d.documentId === prevSelected.documentId);
            if (stillExists) return stillExists;
          }
          return pendingDocs[0];
        });
      } else {
        setSelectedDoc(null);
      }
    } catch (err) {
      console.error('Error fetching pending verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const handleSelectDoc = (doc: Document) => {
    setSelectedDoc(doc);
    setRemarks('');
  };

  const handleAction = async (action: 'Approve' | 'Reject' | 'Send Back') => {
    if (!selectedDoc) return;
    
    const verb = action === 'Approve' ? 'approve' : action === 'Reject' ? 'reject' : 'send back';
    if (!window.confirm(`Are you sure you want to ${verb} document ${selectedDoc.documentId}?`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        documentId: selectedDoc.documentId,
        action,
        remarks,
        performedBy: 'Saurabh Anand' // Simulated Maker/Checker User
      };

      const res = await axios.post('/api/documents/verify', payload);
      if (res.data.success) {
        alert(`Document ${selectedDoc.documentId} has been successfully ${action === 'Approve' ? 'approved' : action === 'Reject' ? 'rejected' : 'sent back'}.`);
        setRemarks('');
        await fetchPendingDocuments();
      } else {
        alert(res.data.message || 'Verification action failed.');
      }
    } catch (err: any) {
      console.error('Error verifying document:', err);
      alert(err.response?.data?.message || 'Error occurred during verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter list by searchQuery
  const filteredDocs = documents.filter(doc => {
    const q = searchQuery.toLowerCase();
    return (
      doc.documentId.toLowerCase().includes(q) ||
      doc.documentName.toLowerCase().includes(q) ||
      doc.vendor.vendorName.toLowerCase().includes(q) ||
      (doc.documentNumber && doc.documentNumber.toLowerCase().includes(q))
    );
  });

  const renderPreview = (doc: Document) => {
    // If it's a seed document (whose file is not uploaded physically to disk)
    const isSeed = doc.documentId.startsWith('DOC-2025-') || doc.documentId === 'DOC-2026-0001';
    
    if (isSeed) {
      if (doc.documentName === 'PAN Card') {
        return (
          <div className={styles.mockPanCard}>
            <div className={styles.panHeader}>
              <span>आयकर विभाग</span>
              <span>INCOME TAX DEPARTMENT</span>
              <span>भारत सरकार</span>
              <span>GOVT. OF INDIA</span>
            </div>
            <div className={styles.panBody}>
              <div className={styles.panPhoto}>PHOTO</div>
              <div className={styles.panDetails}>
                <small>Permanent Account Number Card</small>
                <strong>{doc.documentNumber}</strong>
                <p className={styles.panNameLabel}>Name</p>
                <p className={styles.panName}>{doc.vendor.vendorName.toUpperCase()}</p>
                <p className={styles.panDateLabel}>Date of Incorporation</p>
                <p className={styles.panDate}>{doc.issueDate || '15/06/2015'}</p>
              </div>
            </div>
          </div>
        );
      }
      
      if (doc.documentName === 'GST Certificate') {
        return (
          <div className={styles.mockGstCard}>
            <div className={styles.gstHeader}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>GOVERNMENT OF INDIA</h4>
              <span style={{ fontSize: '0.7rem' }}>FORM GST REG-06</span>
              <small style={{ display: 'block', fontSize: '0.65rem', color: '#475569' }}>REGISTRATION CERTIFICATE</small>
            </div>
            <div className={styles.gstBody} style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <span style={{ color: '#475569' }}>Registration Number: </span>
                <strong>{doc.documentNumber}</strong>
              </div>
              <div>
                <span style={{ color: '#475569' }}>Legal Name: </span>
                <strong>{doc.vendor.vendorName}</strong>
              </div>
              <div>
                <span style={{ color: '#475569' }}>Jurisdiction: </span>
                <span>State Tax Authority</span>
              </div>
              <div>
                <span style={{ color: '#475569' }}>Date of Issue: </span>
                <span>{doc.issueDate || 'N/A'}</span>
              </div>
              <div style={{ marginTop: '8px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', textAlign: 'center', fontSize: '0.65rem', color: '#16a34a', fontWeight: 'bold' }}>
                ✓ RBI OUTSOURCING COMPLIANT
              </div>
            </div>
          </div>
        );
      }
      
      if (doc.documentName === 'MSME Certificate') {
        return (
          <div className={styles.mockMsmeCard}>
            <div className={styles.msmeHeader}>
              <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#047857', fontWeight: 700 }}>MINISTRY OF MSME</h4>
              <span style={{ fontSize: '0.65rem', color: '#065f46' }}>GOVERNMENT OF INDIA</span>
            </div>
            <div className={styles.msmeBody} style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#047857', fontSize: '0.8rem', margin: '4px 0' }}>
                UDYAM REGISTRATION CERTIFICATE
              </div>
              <div>
                <span style={{ color: '#475569' }}>Udyam Number: </span>
                <strong>{doc.documentNumber}</strong>
              </div>
              <div>
                <span style={{ color: '#475569' }}>Enterprise Name: </span>
                <strong>{doc.vendor.vendorName}</strong>
              </div>
              <div>
                <span style={{ color: '#475569' }}>Category: </span>
                <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>Small (Services)</span>
              </div>
              <div>
                <span style={{ color: '#475569' }}>Expiry Date: </span>
                <span>{doc.expiryDate || 'N/A'}</span>
              </div>
            </div>
          </div>
        );
      }
    }

    // Default physical view for actual files uploaded
    if (doc.fileDetails.fileType === 'application/pdf') {
      return (
        <iframe 
          src={`${doc.fileDetails.filePath}#toolbar=0`} 
          title="Document PDF Preview" 
          width="100%" 
          height="100%" 
          style={{ border: 'none', height: '100%', minHeight: '350px' }}
        />
      );
    }
    
    return (
      <img 
        src={doc.fileDetails.filePath} 
        alt="Document Preview" 
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
      />
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Approval Screen (Checker View)</h1>
          <p className={styles.subtitle}>Review and approve pending document verifications.</p>
        </div>
      </header>

      <div className={styles.splitLayout}>
        {/* Left Pane - List */}
        <Card className={styles.listCard}>
          <div className={styles.listHeader}>
            <h3>Pending Verifications</h3>
            <Badge variant="warning">{documents.length}</Badge>
          </div>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className={styles.searchInput} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className={styles.listContainer}>
            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                Loading approvals...
              </div>
            ) : filteredDocs.length > 0 ? (
              filteredDocs.map(item => (
                <div 
                  key={item.documentId} 
                  className={`${styles.listItem} ${selectedDoc?.documentId === item.documentId ? styles.listActive : ''}`}
                  onClick={() => handleSelectDoc(item)}
                >
                  <div className={styles.itemContent}>
                    <span className={styles.itemId}>{item.documentId}</span>
                    <span className={styles.itemName}>{item.documentName}</span>
                    <span className={styles.itemDate}>{item.vendor.vendorName}</span>
                    <span className={styles.itemDate} style={{ marginTop: '2px', fontSize: '0.7rem' }}>
                      Submitted: {new Date(item.uploadedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  {selectedDoc?.documentId === item.documentId && <ChevronRight size={18} color="#1d4ed8" />}
                </div>
              ))
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                No pending verifications.
              </div>
            )}
          </div>
          <div className={styles.pagination}>
            <span>Showing {filteredDocs.length} of {documents.length} pending</span>
          </div>
        </Card>

        {/* Right Pane - Detail */}
        {selectedDoc ? (
          <div className={styles.detailPane}>
            <div className={styles.detailTopRow}>
              {/* Details Card */}
              <Card className={styles.infoCard}>
                <h3 className={styles.detailTitle}>Document Details</h3>
                
                <div className={styles.infoGrid}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Document ID</span>
                    <span className={styles.infoValue}>{selectedDoc.documentId}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Document Type</span>
                    <span className={styles.infoValue}>{selectedDoc.documentType}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Document Name</span>
                    <span className={styles.infoValue}>{selectedDoc.documentName}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Vendor Name</span>
                    <span className={styles.infoValue}>{selectedDoc.vendor.vendorName}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Document Number</span>
                    <span className={styles.infoValue}>{selectedDoc.documentNumber || 'N/A'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Issue Date</span>
                    <span className={styles.infoValue}>{selectedDoc.issueDate || 'N/A'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Expiry Date</span>
                    <span className={styles.infoValue}>{selectedDoc.expiryDate || 'N/A'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Issued By</span>
                    <span className={styles.infoValue}>{selectedDoc.issuedBy || 'N/A'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Submitted By</span>
                    <span className={styles.infoValue}>{selectedDoc.uploadedBy?.userName || 'N/A'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Submitted On</span>
                    <span className={styles.infoValue}>{new Date(selectedDoc.uploadedAt).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className={styles.remarksSection}>
                  <label className={styles.remarksLabel}>Remarks (Optional)</label>
                  <textarea 
                    className={styles.remarksInput} 
                    placeholder="Enter remarks..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    disabled={isSubmitting}
                  ></textarea>
                </div>
              </Card>

              {/* Preview Card */}
              <Card className={styles.previewCard}>
                <h3 className={styles.detailTitle}>Document Preview</h3>
                <div className={styles.previewPlaceholder}>
                  {renderPreview(selectedDoc)}
                </div>
              </Card>
            </div>
            
            <Card className={styles.actionCard}>
              <div className={styles.actionButtons}>
                <Button 
                  className={styles.approveBtn} 
                  icon={<CheckCircle2 size={16} />}
                  onClick={() => handleAction('Approve')}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Approve'}
                </Button>
                <Button 
                  className={styles.rejectBtn} 
                  icon={<XCircle size={16} />}
                  onClick={() => handleAction('Reject')}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Reject'}
                </Button>
                <Button 
                  className={styles.sendBackBtn} 
                  icon={<Send size={16} />}
                  onClick={() => handleAction('Send Back')}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Send Back'}
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--color-border)', minHeight: '400px' }}>
            <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <AlertCircle size={48} style={{ margin: '0 auto 16px', color: 'var(--color-text-tertiary)' }} />
              <h3>No Document Selected</h3>
              <p>Please select a pending verification document from the left list pane.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
