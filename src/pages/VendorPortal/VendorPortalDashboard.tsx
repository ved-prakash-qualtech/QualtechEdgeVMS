import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Send, 
  HelpCircle, 
  Download, 
  Eye, 
  Lock, 
  ArrowRight
} from 'lucide-react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import styles from './VendorPortalDashboard.module.css';

interface PortalDocument {
  id: string;
  name: string;
  type: string;
  status: 'Verified' | 'Pending Verification' | 'Expired' | 'Rejected';
  expiryDate: string;
}

interface PortalPO {
  id: string;
  date: string;
  amount: string;
  status: 'Pending Acknowledgment' | 'Acknowledged' | 'Delivered' | 'Invoiced';
  itemsCount: number;
}

interface PortalInvoice {
  id: string;
  poId: string;
  amount: string;
  submitDate: string;
  status: 'Processing' | '3-Way Match Success' | 'Approved for Payment' | 'Paid' | 'Disputed';
}

interface PortalQuery {
  id: string;
  subject: string;
  category: string;
  status: 'Open' | 'Resolved' | 'Pending Bank';
  lastUpdated: string;
}

export const VendorPortalDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  // Mock Data
  const [documents, setDocuments] = useState<PortalDocument[]>([
    { id: 'DOC-101', name: 'GST Certificate.pdf', type: 'Tax Registration', status: 'Verified', expiryDate: 'N/A' },
    { id: 'DOC-102', name: 'PAN Card Copy.pdf', type: 'Identity Proof', status: 'Verified', expiryDate: 'N/A' },
    { id: 'DOC-103', name: 'MSME Registration Certificate.pdf', type: 'MSME Proof', status: 'Verified', expiryDate: '15 Aug 2028' },
    { id: 'DOC-104', name: 'ISO 27001 InfoSec Certificate.pdf', type: 'Compliance', status: 'Expired', expiryDate: '10 May 2026' }
  ]);

  const [pos, setPos] = useState<PortalPO[]>([
    { id: 'PO-2026-981', date: '18 May 2026', amount: '₹12,45,000.00', status: 'Pending Acknowledgment', itemsCount: 4 },
    { id: 'PO-2026-880', date: '04 May 2026', amount: '₹4,50,000.00', status: 'Acknowledged', itemsCount: 1 },
    { id: 'PO-2026-712', date: '15 Apr 2026', amount: '₹8,90,000.00', status: 'Delivered', itemsCount: 12 },
    { id: 'PO-2026-550', date: '01 Mar 2026', amount: '₹22,10,000.00', status: 'Invoiced', itemsCount: 20 }
  ]);

  const [invoices, setInvoices] = useState<PortalInvoice[]>([
    { id: 'INV-77981', poId: 'PO-2026-550', amount: '₹22,10,000.00', submitDate: '10 Mar 2026', status: 'Paid' },
    { id: 'INV-88192', poId: 'PO-2026-712', amount: '₹8,90,000.00', submitDate: '28 Apr 2026', status: 'Approved for Payment' },
    { id: 'INV-89104', poId: 'PO-2026-880', amount: '₹4,50,000.00', submitDate: '12 May 2026', status: '3-Way Match Success' }
  ]);

  const [queries, setQueries] = useState<PortalQuery[]>([
    { id: 'TKT-901', subject: 'TDS Deduction rate query on INV-77981', category: 'Finance & Tax', status: 'Resolved', lastUpdated: '12 Apr 2026' },
    { id: 'TKT-942', subject: 'API endpoint integration credentials', category: 'Technical Support', status: 'Pending Bank', lastUpdated: '21 May 2026' }
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'pos' | 'invoices' | 'queries'>('overview');

  useEffect(() => {
    if (tabParam && ['overview', 'documents', 'pos', 'invoices', 'queries'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  // Submit invoice modal mock
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ invoiceNo: '', poId: '', amount: '', file: '' });

  const handleAcknowledgePO = (poId: string) => {
    setPos(prev => prev.map(po => po.id === poId ? { ...po, status: 'Acknowledged' } : po));
    alert(`Purchase Order ${poId} acknowledged. Sourcing manager notified.`);
  };

  const handleDocUpload = (docId: string) => {
    alert(`File selector triggered for document update.\nUploading renewal audit evidence...`);
    setDocuments(prev => prev.map(doc => doc.id === docId ? { ...doc, status: 'Pending Verification' } : doc));
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceForm.invoiceNo || !invoiceForm.poId || !invoiceForm.amount) {
      alert("Please fill in all details.");
      return;
    }
    const newInv: PortalInvoice = {
      id: `INV-${invoiceForm.invoiceNo}`,
      poId: invoiceForm.poId,
      amount: `₹${parseFloat(invoiceForm.amount).toLocaleString('en-IN')}.00`,
      submitDate: new Date().toLocaleDateString('en-IN'),
      status: 'Processing'
    };
    setInvoices([newInv, ...invoices]);
    setShowInvoiceModal(false);
    setInvoiceForm({ invoiceNo: '', poId: '', amount: '', file: '' });
    alert("Invoice submitted successfully! Extracted through automated AI OCR pipeline. Status: Processing.");
  };

  const [queryForm, setQueryForm] = useState({ subject: '', category: 'Finance & Tax', message: '' });
  const handleCreateQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryForm.subject || !queryForm.message) {
      alert("Please fill out the ticket form.");
      return;
    }
    const newTkt: PortalQuery = {
      id: `TKT-${Math.floor(Math.random() * 100) + 950}`,
      subject: queryForm.subject,
      category: queryForm.category,
      status: 'Open',
      lastUpdated: new Date().toLocaleDateString('en-IN')
    };
    setQueries([newTkt, ...queries]);
    setQueryForm({ subject: '', category: 'Finance & Tax', message: '' });
    alert("Query ticket registered. Assigned to Procurement Helpdesk agent.");
  };

  return (
    <div className={styles.container}>
      {/* Header alert */}
      <div className={styles.portalBanner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerTitle}>
            <span>Vendor Self-Service Portal</span>
            <Badge variant="success">Verified Partner</Badge>
          </div>
          <p className={styles.bannerSubtitle}>Logged in as: <strong>Acme Cloud Solutions Private Limited (VND-001)</strong></p>
        </div>
        <div className={styles.orgBadge}>
          <Lock size={16} /> Qualtech Edge Bank Security Node
        </div>
      </div>

      {/* Tabs list */}
      <div className={styles.tabBar}>
        <button className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('overview')}>Overview Dashboard</button>
        <button className={`${styles.tabBtn} ${activeTab === 'documents' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('documents')}>Documents & Verification</button>
        <button className={`${styles.tabBtn} ${activeTab === 'pos' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('pos')}>Purchase Orders ({pos.filter(po => po.status === 'Pending Acknowledgment').length})</button>
        <button className={`${styles.tabBtn} ${activeTab === 'invoices' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('invoices')}>Invoices & Payments</button>
        <button className={`${styles.tabBtn} ${activeTab === 'queries' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('queries')}>Queries & Helpdesk</button>
      </div>

      {/* TAB CONTENTS: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className={styles.tabContent}>
          <div className={styles.kpiGrid}>
            <Card className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div>
                  <span className={styles.kpiLabel}>Pending POs</span>
                  <div className={styles.kpiValue} style={{ color: '#F59E0B' }}>
                    {pos.filter(po => po.status === 'Pending Acknowledgment').length} Orders
                  </div>
                </div>
                <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
                  <Clock size={24} />
                </div>
              </div>
              <span className={styles.kpiTrend}>Requires acknowledgement</span>
            </Card>

            <Card className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div>
                  <span className={styles.kpiLabel}>Disbursed Invoices</span>
                  <div className={styles.kpiValue} style={{ color: '#16A34A' }}>1 Paid</div>
                </div>
                <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                  <CheckCircle size={24} />
                </div>
              </div>
              <span className={styles.kpiTrend}>Total amount paid: ₹22,10,000.00</span>
            </Card>

            <Card className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div>
                  <span className={styles.kpiLabel}>Compliance Health</span>
                  <div className={styles.kpiValue} style={{ color: '#dc2626' }}>1 Document Expired</div>
                </div>
                <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                  <AlertTriangle size={24} />
                </div>
              </div>
              <span className={styles.kpiTrend} style={{ color: '#b91c1c' }}>Re-upload required</span>
            </Card>

            <Card className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <div>
                  <span className={styles.kpiLabel}>Support Queries</span>
                  <div className={styles.kpiValue} style={{ color: '#1d4ed8' }}>1 Active Ticket</div>
                </div>
                <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                  <HelpCircle size={24} />
                </div>
              </div>
              <span className={styles.kpiTrend}>Last reply: Yesterday</span>
            </Card>
          </div>

          <div className={styles.overviewGrid}>
            <Card className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Latest Purchase Orders</span>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('pos')}>View All <ArrowRight size={14} /></Button>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>PO Ref</th>
                      <th>Issue Date</th>
                      <th>Order Value</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pos.slice(0, 3).map(po => (
                      <tr key={po.id}>
                        <td style={{ fontWeight: 'bold' }}>{po.id}</td>
                        <td>{po.date}</td>
                        <td>{po.amount}</td>
                        <td>
                          <Badge variant={po.status === 'Pending Acknowledgment' ? 'warning' : po.status === 'Acknowledged' ? 'info' : 'success'}>
                            {po.status}
                          </Badge>
                        </td>
                        <td>
                          {po.status === 'Pending Acknowledgment' ? (
                            <Button size="sm" variant="primary" onClick={() => handleAcknowledgePO(po.id)}>Acknowledge</Button>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#64748b' }}>No Action</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Self-Service Document Health</span>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('documents')}>Verify <ArrowRight size={14} /></Button>
              </div>
              <div className={styles.docMiniList}>
                {documents.map(doc => (
                  <div key={doc.id} className={styles.docMiniRow}>
                    <div>
                      <div className={styles.docMiniName}>{doc.name}</div>
                      <div className={styles.docMiniMeta}>{doc.type} • Expiry: {doc.expiryDate}</div>
                    </div>
                    <div>
                      <Badge variant={doc.status === 'Verified' ? 'success' : doc.status === 'Expired' ? 'danger' : 'warning'}>
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENTS: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className={styles.tabContent}>
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Corporate KYC & Compliance Documents</span>
              <Button variant="primary" icon={<Upload size={16} />} onClick={() => alert("Upload supplemental audit package...")}>
                Upload Document
              </Button>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Doc Ref</th>
                    <th>Document Name</th>
                    <th>Category</th>
                    <th>Validity Expiry</th>
                    <th>Verification Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(doc => (
                    <tr key={doc.id}>
                      <td style={{ fontWeight: 'bold' }}>{doc.id}</td>
                      <td>{doc.name}</td>
                      <td>{doc.type}</td>
                      <td>{doc.expiryDate}</td>
                      <td>
                        <Badge variant={doc.status === 'Verified' ? 'success' : doc.status === 'Expired' ? 'danger' : 'warning'}>
                          {doc.status}
                        </Badge>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button size="sm" variant="outline" onClick={() => handleDocUpload(doc.id)}>
                            {doc.status === 'Expired' ? 'Renew' : 'Re-upload'}
                          </Button>
                          <Button size="sm" variant="ghost" icon={<Download size={14} />} onClick={() => alert(`Downloading ${doc.name}`)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB CONTENTS: POS */}
      {activeTab === 'pos' && (
        <div className={styles.tabContent}>
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Received Purchase Orders</span>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>PO ID</th>
                    <th>Date Issued</th>
                    <th>Total Items</th>
                    <th>Value Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pos.map(po => (
                    <tr key={po.id}>
                      <td style={{ fontWeight: 'bold' }}>{po.id}</td>
                      <td>{po.date}</td>
                      <td>{po.itemsCount} Items</td>
                      <td>{po.amount}</td>
                      <td>
                        <Badge variant={po.status === 'Pending Acknowledgment' ? 'warning' : po.status === 'Acknowledged' ? 'info' : 'success'}>
                          {po.status}
                        </Badge>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {po.status === 'Pending Acknowledgment' && (
                            <Button size="sm" variant="primary" onClick={() => handleAcknowledgePO(po.id)}>
                              Acknowledge
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => alert(`Opening PO details for ${po.id}`)}>
                            View PO
                          </Button>
                          {po.status === 'Acknowledged' && (
                            <Button size="sm" variant="primary" onClick={() => {
                              setInvoiceForm(prev => ({ ...prev, poId: po.id, amount: po.amount.replace(/[^0-9.]/g, '') }));
                              setShowInvoiceModal(true);
                            }}>
                              Submit Invoice
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB CONTENTS: INVOICES */}
      {activeTab === 'invoices' && (
        <div className={styles.tabContent}>
          <Card className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Submitted Invoices & Payment Schedules</span>
              <Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowInvoiceModal(true)}>
                New Invoice Submission
              </Button>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>PO Reference</th>
                    <th>Bill Amount</th>
                    <th>Submit Date</th>
                    <th>Verification Stage</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 'bold' }}>{inv.id}</td>
                      <td>{inv.poId}</td>
                      <td>{inv.amount}</td>
                      <td>{inv.submitDate}</td>
                      <td>
                        <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Processing' ? 'warning' : 'info'}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td>
                        <Button size="sm" variant="ghost" icon={<Eye size={14} />} onClick={() => alert(`Showing invoice timeline for ${inv.id}`)}>
                          Track
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB CONTENTS: QUERIES */}
      {activeTab === 'queries' && (
        <div className={styles.tabContent}>
          <div className={styles.queryLayout}>
            {/* Left: Raise Query Form */}
            <Card className={styles.card}>
              <span className={styles.cardTitle}>Raise Support Ticket</span>
              <form onSubmit={handleCreateQuery} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                <div>
                  <label className={styles.label}>Category</label>
                  <select 
                    className={styles.select}
                    value={queryForm.category}
                    onChange={(e) => setQueryForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="Finance & Tax">Finance & Tax Support</option>
                    <option value="Technical Support">Portal Technical Bug / Credential</option>
                    <option value="Compliance Audit">KYC Verification & Compliance</option>
                    <option value="Sourcing / Contracts">Item pricing & RFP bidding</option>
                  </select>
                </div>
                <div>
                  <label className={styles.label}>Subject</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    placeholder="Short description of your issue"
                    value={queryForm.subject}
                    onChange={(e) => setQueryForm(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={styles.label}>Detailed Description</label>
                  <textarea 
                    className={styles.textarea}
                    placeholder="Provide details of your transaction/problem"
                    rows={4}
                    value={queryForm.message}
                    onChange={(e) => setQueryForm(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>
                <Button variant="primary" type="submit" icon={<Send size={16} />}>Submit Ticket</Button>
              </form>
            </Card>

            {/* Right: Existing Tickets list */}
            <Card className={styles.card}>
              <span className={styles.cardTitle}>Existing Support Tickets</span>
              <div className={styles.ticketList}>
                {queries.map(q => (
                  <div key={q.id} className={styles.ticketRow}>
                    <div className={styles.ticketInfo}>
                      <span className={styles.ticketSubject}>{q.subject}</span>
                      <span className={styles.ticketMeta}>{q.id} • {q.category} • Updated: {q.lastUpdated}</span>
                    </div>
                    <div>
                      <Badge variant={q.status === 'Resolved' ? 'success' : q.status === 'Open' ? 'danger' : 'warning'}>
                        {q.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Invoice Submission Modal */}
      {showInvoiceModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>OCR Invoice Extraction Pipeline</h3>
              <button className={styles.closeBtn} onClick={() => setShowInvoiceModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateInvoice} className={styles.modalBody}>
              <div>
                <label className={styles.label}>Invoice Number</label>
                <input 
                  type="text" 
                  className={styles.input}
                  placeholder="e.g. 77984"
                  value={invoiceForm.invoiceNo}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, invoiceNo: e.target.value }))}
                />
              </div>
              <div>
                <label className={styles.label}>PO Reference</label>
                <select 
                  className={styles.select}
                  value={invoiceForm.poId}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, poId: e.target.value }))}
                >
                  <option value="">Select PO Reference</option>
                  {pos.filter(po => po.status === 'Acknowledged').map(po => (
                    <option key={po.id} value={po.id}>{po.id} ({po.amount})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={styles.label}>Total Invoiced Amount (₹)</label>
                <input 
                  type="number" 
                  className={styles.input}
                  placeholder="e.g. 450000"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div>
                <label className={styles.label}>Upload PDF Invoice Copy</label>
                <div className={styles.fileDropZone} onClick={() => alert("Simulating local file selection...")}>
                  <Upload size={24} style={{ color: '#1D4ED8', marginBottom: '8px' }} />
                  <span>Drag & drop or Click to browse</span>
                  <small>Accepts PDF, JPG, PNG (Max 5MB)</small>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <Button variant="outline" type="button" onClick={() => setShowInvoiceModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit" icon={<Send size={14} />}>Submit for Extraction</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
