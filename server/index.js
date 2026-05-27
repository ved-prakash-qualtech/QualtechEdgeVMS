import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import {
  readJsonFile,
  writeJsonFile,
  appendJsonData,
  updateJsonData,
  deleteJsonData
} from './services/jsonService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Resolve database paths
const VENDORS_PATH = path.join(__dirname, 'data', 'vendors.json');
const DOCUMENTS_PATH = path.join(__dirname, 'data', 'documents.json');
const APPROVALS_PATH = path.join(__dirname, 'data', 'approvals.json');
const AUDIT_LOGS_PATH = path.join(__dirname, 'data', 'audit-logs.json');
const DOC_TYPES_PATH = path.join(__dirname, 'data', 'document-types.json');
const DOC_CATEGORIES_PATH = path.join(__dirname, 'data', 'document-categories.json');
const DOC_VERIFICATION_PATH = path.join(__dirname, 'data', 'document-verification.json');
const DOC_AUDIT_LOGS_PATH = path.join(__dirname, 'data', 'document-audit-logs.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DOC_UPLOADS_DIR = path.join(UPLOADS_DIR, 'documents');

// Catalogue database paths
const CAT_ITEMS_PATH = path.join(__dirname, 'data', 'catalogue', 'items.json');
const CAT_CATEGORIES_PATH = path.join(__dirname, 'data', 'catalogue', 'categories.json');
const CAT_VENDORS_PATH = path.join(__dirname, 'data', 'catalogue', 'vendors.json');
const CAT_HSN_CODES_PATH = path.join(__dirname, 'data', 'catalogue', 'hsn-sac-codes.json');
const CAT_UOMS_PATH = path.join(__dirname, 'data', 'catalogue', 'uom.json');
const CAT_APPROVALS_PATH = path.join(__dirname, 'data', 'catalogue', 'item-approvals.json');
const CAT_ACTIVITY_PATH = path.join(__dirname, 'data', 'catalogue', 'item-activity.json');
const CAT_DASHBOARD_PATH = path.join(__dirname, 'data', 'catalogue', 'item-dashboard.json');
const CAT_UPLOADED_FILES_PATH = path.join(__dirname, 'data', 'catalogue', 'uploaded-files.json');

// Auth database paths
const AUTH_DIR = path.join(__dirname, 'data', 'auth');
const AUTH_USERS_PATH = path.join(AUTH_DIR, 'users.json');
const AUTH_ROLES_PATH = path.join(AUTH_DIR, 'roles.json');
const AUTH_PERMISSIONS_PATH = path.join(AUTH_DIR, 'permissions.json');
const AUTH_AUDIT_PATH = path.join(AUTH_DIR, 'login-audit.json');
const AUTH_SESSIONS_PATH = path.join(AUTH_DIR, 'sessions.json');
const AUTH_OTP_STORE_PATH = path.join(AUTH_DIR, 'otp-store.json');

const CAT_UPLOADS_DIR = path.join(UPLOADS_DIR, 'catalogue');
const CAT_SPECS_DIR = path.join(CAT_UPLOADS_DIR, 'specifications');
const CAT_IMAGES_DIR = path.join(CAT_UPLOADS_DIR, 'images');
const CAT_COMPLIANCE_DIR = path.join(CAT_UPLOADS_DIR, 'compliance');
const CAT_TEMP_DIR = path.join(CAT_UPLOADS_DIR, 'temp');

// Ensure directories exist
async function ensureDirectories() {
  await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
  await fs.mkdir(path.join(__dirname, 'data', 'catalogue'), { recursive: true });
  await fs.mkdir(AUTH_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.mkdir(DOC_UPLOADS_DIR, { recursive: true });
  await fs.mkdir(CAT_SPECS_DIR, { recursive: true });
  await fs.mkdir(CAT_IMAGES_DIR, { recursive: true });
  await fs.mkdir(CAT_COMPLIANCE_DIR, { recursive: true });
  await fs.mkdir(CAT_TEMP_DIR, { recursive: true });
}
ensureDirectories().catch(console.error);

// Static files for uploads (allows downloading files)
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Configure Multer for VMS Documents
const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DOC_UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const origName = file.originalname;
    const ext = path.extname(origName).toLowerCase();
    
    // Default fallback to docName
    const docName = req.body.documentName || 'DOC';
    const cleanSlug = docName.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 10);
    
    cb(null, `DOC_${year}_${rand}_${cleanSlug}${ext}`);
  }
});

const docUpload = multer({
  storage: docStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed!'));
  }
});

// Helper to write document audit logs
async function logDocAction(documentId, documentName, action, performedBy, remarks = '') {
  const newLog = {
    id: `AUD-DOC-${Math.floor(Math.random() * 90000) + 10000}`,
    timestamp: new Date().toISOString(),
    documentId,
    documentName,
    action,
    performedBy: performedBy || 'Saurabh Anand',
    remarks
  };
  await appendJsonData(DOC_AUDIT_LOGS_PATH, newLog);
  return newLog;
}

// Helper to write audit logs
async function logAction(actor, role, action, status, severity, ipAddress = '127.0.0.1') {
  const newLog = {
    id: `AUD-${Math.floor(Math.random() * 90000) + 10000}`,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    actor,
    role,
    tenant: 'Qualtech Corporate',
    action,
    ipAddress,
    status,
    severity
  };
  await appendJsonData(AUDIT_LOGS_PATH, newLog);
  return newLog;
}

// REST APIs

// 1. File Upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileInfo = {
      id: `DOC-${Math.floor(Math.random() * 90000) + 10000}`,
      documentType: req.body.documentType || 'Other',
      fileName: req.file.originalname,
      savedFileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
      sizeBytes: req.file.size,
      status: 'Uploaded',
      uploadedAt: new Date().toISOString()
    };

    await appendJsonData(DOCUMENTS_PATH, fileInfo);

    res.json({
      success: true,
      fileInfo
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// DOCUMENTS MODULE APIS
// ==========================================

// GET /api/documents/master/types
app.get('/api/documents/master/types', async (req, res) => {
  try {
    const types = await readJsonFile(DOC_TYPES_PATH);
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/documents/master/categories
app.get('/api/documents/master/categories', async (req, res) => {
  try {
    const categories = await readJsonFile(DOC_CATEGORIES_PATH);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/documents/expiring
app.get('/api/documents/expiring', async (req, res) => {
  try {
    const docs = await readJsonFile(DOCUMENTS_PATH);
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const expiringSoon = [];
    const expired = [];

    docs.forEach(doc => {
      if (doc.expiryDate) {
        const expDate = new Date(doc.expiryDate);
        if (expDate < now) {
          expired.push(doc);
        } else if (expDate <= thirtyDaysFromNow) {
          expiringSoon.push(doc);
        }
      }
    });

    res.json({
      expiringSoon,
      expired
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/documents/vendor/:vendorId
app.get('/api/documents/vendor/:vendorId', async (req, res) => {
  try {
    const docs = await readJsonFile(DOCUMENTS_PATH);
    const vendorDocs = docs.filter(doc => doc.vendor?.vendorId === req.params.vendorId);
    res.json(vendorDocs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/documents
app.get('/api/documents', async (req, res) => {
  try {
    const docs = await readJsonFile(DOCUMENTS_PATH);
    const { status, type, search } = req.query;
    
    let filtered = [...docs];
    
    if (status && status !== 'All' && status !== 'Status: All') {
      filtered = filtered.filter(doc => doc.verificationStatus === status || doc.approvalStatus === status);
    }
    
    if (type && type !== 'All' && type !== 'Document Type: All') {
      filtered = filtered.filter(doc => doc.documentType === type || doc.documentCategory === type);
    }
    
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.documentName.toLowerCase().includes(q) ||
        doc.documentNumber?.toLowerCase().includes(q) ||
        doc.vendor?.vendorName.toLowerCase().includes(q) ||
        doc.documentId.toLowerCase().includes(q)
      );
    }
    
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/documents/:id
app.get('/api/documents/:id', async (req, res) => {
  try {
    const docs = await readJsonFile(DOCUMENTS_PATH);
    const doc = docs.find(d => d.documentId === req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/documents/upload
app.post('/api/documents/upload', docUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file was uploaded' });
    }

    const {
      documentType,
      documentName,
      documentCategory,
      vendorId,
      vendorName,
      documentNumber,
      issueDate,
      expiryDate,
      issuedBy,
      remarks,
      uploadedByUserName,
      uploadedByUserId
    } = req.body;

    // Validate duplicates
    const docs = await readJsonFile(DOCUMENTS_PATH);
    if (documentNumber) {
      const isDuplicate = docs.some(d => 
        d.documentNumber === documentNumber && 
        d.documentName === documentName && 
        d.vendor?.vendorId === vendorId
      );
      if (isDuplicate) {
        // Remove uploaded file to clean up
        await fs.unlink(req.file.path).catch(console.error);
        return res.status(400).json({ 
          success: false, 
          message: `A document with number ${documentNumber} already exists for this vendor.` 
        });
      }
    }

    // Generate Document ID
    const year = new Date().getFullYear();
    const docsThisYear = docs.filter(d => d.documentId.startsWith(`DOC-${year}`));
    const nextNum = docsThisYear.length + 1;
    const documentId = `DOC-${year}-${String(nextNum).padStart(4, '0')}`;

    const originalFileName = req.file.originalname;
    const storedFileName = req.file.filename;
    const filePath = `/uploads/documents/${storedFileName}`;
    const fileExtension = path.extname(originalFileName).toLowerCase();
    const fileSizeKB = Math.round(req.file.size / 1024);

    const userName = uploadedByUserName || 'Saurabh Anand';
    const userId = uploadedByUserId || 'USR-001';

    const newDoc = {
      documentId,
      documentType: documentType || 'Others',
      documentName: documentName || 'Other Document',
      documentCategory: documentCategory || 'Others',
      vendor: {
        vendorId: vendorId || 'VND-UNKNOWN',
        vendorName: vendorName || 'Unknown Vendor'
      },
      documentNumber: documentNumber || '',
      issueDate: issueDate || null,
      expiryDate: expiryDate || null,
      issuedBy: issuedBy || '',
      remarks: remarks || '',
      verificationStatus: 'Pending Verification',
      approvalStatus: 'Pending',
      uploadedBy: {
        userId,
        userName
      },
      uploadedAt: new Date().toISOString(),
      fileDetails: {
        originalFileName,
        storedFileName,
        filePath,
        fileType: req.file.mimetype,
        fileSizeKB,
        fileExtension
      },
      previewImage: null,
      documentUsage: {
        usedInKYC: documentType === 'KYC Documents',
        usedInVendorOnboarding: true,
        usedInCompliance: documentType === 'Compliance Documents',
        usedInContracts: false,
        usedInInvoiceVerification: false
      },
      versionHistory: [
        {
          version: 1,
          uploadedAt: new Date().toISOString(),
          uploadedBy: userName,
          status: 'Initial Upload'
        }
      ],
      auditTrail: [
        {
          action: 'Document Uploaded',
          performedBy: userName,
          timestamp: new Date().toISOString()
        }
      ]
    };

    await appendJsonData(DOCUMENTS_PATH, newDoc);
    await logDocAction(documentId, documentName, 'Document Uploaded', userName, 'Initial submission.');

    // Also update vendor profile documents mapping if vendor exists
    const vendors = await readJsonFile(VENDORS_PATH);
    const vendorIndex = vendors.findIndex(v => v.vendorId === vendorId);
    if (vendorIndex !== -1) {
      const vendorDocs = vendors[vendorIndex].documents || [];
      vendorDocs.push({
        documentType: documentName,
        fileName: originalFileName,
        status: 'Pending',
        expiryDate: expiryDate || null,
        documentId
      });
      await updateJsonData(VENDORS_PATH, 'vendorId', vendorId, { documents: vendorDocs });
    }

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: newDoc
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/documents/:id
app.put('/api/documents/:id', docUpload.single('file'), async (req, res) => {
  try {
    const docs = await readJsonFile(DOCUMENTS_PATH);
    const docIndex = docs.findIndex(d => d.documentId === req.params.id);
    if (docIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    const existingDoc = docs[docIndex];
    const updateData = { ...req.body };
    
    // If a new physical file is uploaded
    if (req.file) {
      // Delete old file if exists
      const oldFilePath = path.join(__dirname, existingDoc.fileDetails.filePath);
      await fs.unlink(oldFilePath).catch(err => console.log('Old file not deleted/not found:', err.message));
      
      const originalFileName = req.file.originalname;
      const storedFileName = req.file.filename;
      const filePath = `/uploads/documents/${storedFileName}`;
      const fileExtension = path.extname(originalFileName).toLowerCase();
      const fileSizeKB = Math.round(req.file.size / 1024);
      
      const newVersionNum = existingDoc.versionHistory.length + 1;
      const userName = req.body.uploadedByUserName || 'Saurabh Anand';
      
      existingDoc.fileDetails = {
        originalFileName,
        storedFileName,
        filePath,
        fileType: req.file.mimetype,
        fileSizeKB,
        fileExtension
      };
      
      existingDoc.versionHistory.push({
        version: newVersionNum,
        uploadedAt: new Date().toISOString(),
        uploadedBy: userName,
        status: `Replaced File (v${newVersionNum})`
      });
    }
    
    // Update text fields
    if (updateData.documentName) existingDoc.documentName = updateData.documentName;
    if (updateData.documentNumber) existingDoc.documentNumber = updateData.documentNumber;
    if (updateData.issueDate) existingDoc.issueDate = updateData.issueDate;
    if (updateData.expiryDate) existingDoc.expiryDate = updateData.expiryDate;
    if (updateData.issuedBy) existingDoc.issuedBy = updateData.issuedBy;
    if (updateData.remarks) existingDoc.remarks = updateData.remarks;
    
    existingDoc.auditTrail.push({
      action: 'Document Details Updated',
      performedBy: req.body.uploadedByUserName || 'Saurabh Anand',
      timestamp: new Date().toISOString()
    });
    
    await updateJsonData(DOCUMENTS_PATH, 'documentId', req.params.id, existingDoc);
    await logDocAction(req.params.id, existingDoc.documentName, 'Document Details Updated', req.body.uploadedByUserName);
    
    res.json({
      success: true,
      message: 'Document updated successfully',
      document: existingDoc
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/documents/:id
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const docs = await readJsonFile(DOCUMENTS_PATH);
    const doc = docs.find(d => d.documentId === req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Physically delete file
    const filePath = path.join(__dirname, doc.fileDetails.filePath);
    await fs.unlink(filePath).catch(err => console.log('File delete err:', err.message));
    
    // Remove from documents.json
    await deleteJsonData(DOCUMENTS_PATH, 'documentId', req.params.id);
    await logDocAction(req.params.id, doc.documentName, 'Document Deleted', 'Saurabh Anand');
    
    // Remove from vendor document mapping
    const vendors = await readJsonFile(VENDORS_PATH);
    const vendorIndex = vendors.findIndex(v => v.vendorId === doc.vendor?.vendorId);
    if (vendorIndex !== -1) {
      const vendorDocs = vendors[vendorIndex].documents || [];
      const filteredVendorDocs = vendorDocs.filter(d => d.documentId !== req.params.id);
      await updateJsonData(VENDORS_PATH, 'vendorId', doc.vendor?.vendorId, { documents: filteredVendorDocs });
    }
    
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/documents/verify
app.post('/api/documents/verify', async (req, res) => {
  try {
    const { documentId, action, remarks, performedBy } = req.body;
    
    const docs = await readJsonFile(DOCUMENTS_PATH);
    const doc = docs.find(d => d.documentId === documentId);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    const verStatus = action === 'Approve' ? 'Verified' : action === 'Reject' ? 'Rejected' : 'Sent Back';
    const appStatus = action === 'Approve' ? 'Approved' : action === 'Reject' ? 'Rejected' : 'Sent Back';
    
    const userName = performedBy || 'Saurabh Anand';
    
    // Update document status
    const updatedDoc = await updateJsonData(DOCUMENTS_PATH, 'documentId', documentId, {
      verificationStatus: verStatus,
      approvalStatus: appStatus,
      remarks: remarks || doc.remarks,
      auditTrail: [
        ...(doc.auditTrail || []),
        {
          action: `Verification ${action}d`,
          performedBy: userName,
          timestamp: new Date().toISOString(),
          remarks
        }
      ]
    });
    
    // Log verification action details
    const verificationLog = {
      id: `VRF-${Math.floor(Math.random() * 90000) + 10000}`,
      documentId,
      documentName: doc.documentName,
      vendorName: doc.vendor.vendorName,
      vendorId: doc.vendor.vendorId,
      performedBy: userName,
      action,
      remarks,
      timestamp: new Date().toISOString()
    };
    await appendJsonData(DOC_VERIFICATION_PATH, verificationLog);
    
    // Log to master VMS audit trail
    await logAction(
      userName,
      'Procurement Checker',
      `Verification ${action}d for document ${documentId} (${doc.documentName}) of vendor ${doc.vendor.vendorName}`,
      'Success',
      'High'
    );
    
    await logDocAction(documentId, doc.documentName, `Verification ${action}d`, userName, remarks);
    
    // Update document status inside vendor registry
    const vendors = await readJsonFile(VENDORS_PATH);
    const vendorIndex = vendors.findIndex(v => v.vendorId === doc.vendor?.vendorId);
    if (vendorIndex !== -1) {
      const vendorDocs = vendors[vendorIndex].documents || [];
      const matchDocIndex = vendorDocs.findIndex(d => d.documentId === documentId || d.documentType === doc.documentName);
      if (matchDocIndex !== -1) {
        vendorDocs[matchDocIndex].status = verStatus;
        await updateJsonData(VENDORS_PATH, 'vendorId', doc.vendor?.vendorId, { documents: vendorDocs });
      }
    }
    
    res.json({
      success: true,
      message: `Document verification ${action}d successfully.`,
      document: updatedDoc
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/documents/audit-logs
app.get('/api/documents/audit-logs', async (req, res) => {
  try {
    const logs = await readJsonFile(DOC_AUDIT_LOGS_PATH);
    res.json(logs.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Vendors APIs
app.get('/api/vendors', async (req, res) => {
  try {
    const vendors = await readJsonFile(VENDORS_PATH);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/vendors/:id', async (req, res) => {
  try {
    const vendors = await readJsonFile(VENDORS_PATH);
    const vendor = vendors.find(v => v.vendorId === req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vendors', async (req, res) => {
  try {
    const vendorData = req.body;
    
    // Auto-generate Vendor ID if not provided
    if (!vendorData.vendorId) {
      const year = new Date().getFullYear();
      const num = Math.floor(Math.random() * 90000) + 10000;
      vendorData.vendorId = `VND-${year}-${num}`;
    }

    vendorData.createdAt = vendorData.createdAt || new Date().toISOString();
    
    await appendJsonData(VENDORS_PATH, vendorData);

    // Write audit trail log
    await logAction(
      vendorData.approvalWorkflow?.submittedBy || 'Saurabh Anand',
      'Procurement Maker',
      `Created Vendor registration ${vendorData.vendorId} (${vendorData.basicDetails?.legalName})`,
      'Success',
      'Low'
    );

    res.status(201).json(vendorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/vendors/:id', async (req, res) => {
  try {
    const updated = await updateJsonData(VENDORS_PATH, 'vendorId', req.params.id, req.body);
    
    await logAction(
      req.body.approvalWorkflow?.submittedBy || 'Saurabh Anand',
      'Procurement Maker',
      `Updated Vendor registration ${req.params.id} (${updated.basicDetails?.legalName})`,
      'Success',
      'Low'
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/vendors/:id', async (req, res) => {
  try {
    const vendors = await readJsonFile(VENDORS_PATH);
    const vendor = vendors.find(v => v.vendorId === req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    await deleteJsonData(VENDORS_PATH, 'vendorId', req.params.id);

    await logAction(
      'Saurabh Anand',
      'Procurement Maker',
      `Deleted Vendor registration ${req.params.id} (${vendor.basicDetails?.legalName})`,
      'Success',
      'Medium'
    );

    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vendor Checker Approvals (Approve / Reject / Send Back)
app.post('/api/vendors/:id/approve', async (req, res) => {
  try {
    const { remarks, performedBy } = req.body;
    const vendors = await readJsonFile(VENDORS_PATH);
    const vendor = vendors.find(v => v.vendorId === req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const updatedWorkflow = {
      ...vendor.approvalWorkflow,
      approvalStatus: 'Approved',
      currentStage: 'Approved',
      approverRemarks: remarks,
      approvedBy: performedBy || 'Saurabh Anand',
      approvedDate: new Date().toISOString()
    };

    const updated = await updateJsonData(VENDORS_PATH, 'vendorId', req.params.id, {
      status: 'Active',
      approvalWorkflow: updatedWorkflow,
      auditTrail: [
        ...(vendor.auditTrail || []),
        {
          action: 'Vendor Approved',
          performedBy: performedBy || 'Saurabh Anand',
          timestamp: new Date().toISOString(),
          remarks
        }
      ]
    });

    // Save history to approvals.json
    const approvalHistory = {
      id: `APP-${Math.floor(Math.random() * 90000) + 10000}`,
      vendorId: req.params.id,
      vendorName: vendor.basicDetails.legalName,
      performedBy: performedBy || 'Saurabh Anand',
      action: 'Approved',
      remarks,
      timestamp: new Date().toISOString()
    };
    await appendJsonData(APPROVALS_PATH, approvalHistory);

    await logAction(
      performedBy || 'Saurabh Anand',
      'Procurement Checker',
      `Approved Vendor onboarding for ${req.params.id} (${vendor.basicDetails?.legalName})`,
      'Success',
      'High'
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vendors/:id/reject', async (req, res) => {
  try {
    const { remarks, performedBy } = req.body;
    const vendors = await readJsonFile(VENDORS_PATH);
    const vendor = vendors.find(v => v.vendorId === req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const updatedWorkflow = {
      ...vendor.approvalWorkflow,
      approvalStatus: 'Rejected',
      currentStage: 'Rejected',
      approverRemarks: remarks,
      approvedBy: performedBy || 'Saurabh Anand',
      approvedDate: new Date().toISOString()
    };

    const updated = await updateJsonData(VENDORS_PATH, 'vendorId', req.params.id, {
      status: 'Rejected',
      approvalWorkflow: updatedWorkflow,
      auditTrail: [
        ...(vendor.auditTrail || []),
        {
          action: 'Vendor Rejected',
          performedBy: performedBy || 'Saurabh Anand',
          timestamp: new Date().toISOString(),
          remarks
        }
      ]
    });

    const approvalHistory = {
      id: `APP-${Math.floor(Math.random() * 90000) + 10000}`,
      vendorId: req.params.id,
      vendorName: vendor.basicDetails.legalName,
      performedBy: performedBy || 'Saurabh Anand',
      action: 'Rejected',
      remarks,
      timestamp: new Date().toISOString()
    };
    await appendJsonData(APPROVALS_PATH, approvalHistory);

    await logAction(
      performedBy || 'Saurabh Anand',
      'Procurement Checker',
      `Rejected Vendor onboarding for ${req.params.id} (${vendor.basicDetails?.legalName})`,
      'Success',
      'High'
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vendors/:id/sendback', async (req, res) => {
  try {
    const { remarks, performedBy } = req.body;
    const vendors = await readJsonFile(VENDORS_PATH);
    const vendor = vendors.find(v => v.vendorId === req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const updatedWorkflow = {
      ...vendor.approvalWorkflow,
      approvalStatus: 'Sent Back',
      currentStage: 'Vendor Amendment',
      approverRemarks: remarks,
      approvedBy: performedBy || 'Saurabh Anand',
      approvedDate: new Date().toISOString()
    };

    const updated = await updateJsonData(VENDORS_PATH, 'vendorId', req.params.id, {
      status: 'Pending Amendment',
      approvalWorkflow: updatedWorkflow,
      auditTrail: [
        ...(vendor.auditTrail || []),
        {
          action: 'Sent Back for Clarification',
          performedBy: performedBy || 'Saurabh Anand',
          timestamp: new Date().toISOString(),
          remarks
        }
      ]
    });

    const approvalHistory = {
      id: `APP-${Math.floor(Math.random() * 90000) + 10000}`,
      vendorId: req.params.id,
      vendorName: vendor.basicDetails.legalName,
      performedBy: performedBy || 'Saurabh Anand',
      action: 'Sent Back',
      remarks,
      timestamp: new Date().toISOString()
    };
    await appendJsonData(APPROVALS_PATH, approvalHistory);

    await logAction(
      performedBy || 'Saurabh Anand',
      'Procurement Checker',
      `Sent Back Vendor ${req.params.id} (${vendor.basicDetails?.legalName}) to Maker for clarification`,
      'Success',
      'Medium'
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Security Approvals queue APIs (Checker Queue in Zero-Trust Audit page)
app.get('/api/approvals', async (req, res) => {
  try {
    const approvals = await readJsonFile(APPROVALS_PATH);
    res.json(approvals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/approvals/:id/resolve', async (req, res) => {
  try {
    const { action, performedBy } = req.body;
    const approvals = await readJsonFile(APPROVALS_PATH);
    const item = approvals.find(a => a.id === req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Approval item not found' });
    }

    // Resolve or delete from active pending queue
    await deleteJsonData(APPROVALS_PATH, 'id', req.params.id);

    await logAction(
      performedBy || 'Saurabh.S',
      'Security Checker',
      `Four-eye checker ${action} executed for security action: ${item.changeDetails}`,
      'Success',
      'High'
    );

    res.json({ success: true, message: `Action ${action} for ${req.params.id} logged.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Audit Logs API
app.get('/api/audit-logs', async (req, res) => {
  try {
    const logs = await readJsonFile(AUDIT_LOGS_PATH);
    // Return logs sorted newest first
    res.json(logs.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// ITEM & SERVICE CATALOGUE MANAGEMENT APIs
// ==========================================

// Configure Multer for Catalogue File Uploads
const catStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = req.body.fileType || 'specifications';
    if (fileType === 'Product Image') {
      cb(null, CAT_IMAGES_DIR);
    } else if (fileType === 'Compliance Certificate' || fileType === 'Technical Document') {
      cb(null, CAT_COMPLIANCE_DIR);
    } else {
      cb(null, CAT_SPECS_DIR);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'CAT_' + uniqueSuffix + ext);
  }
});
const catUpload = multer({ storage: catStorage });

// Helper to log catalogue activity
async function logCatActivity(itemId, action, user) {
  try {
    const activity = {
      activityId: `ACT-${Math.floor(Math.random() * 90000) + 10000}`,
      itemId,
      action,
      user: user || 'Saurabh Anand',
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    await appendJsonData(CAT_ACTIVITY_PATH, activity);
  } catch (err) {
    console.error('Error logging catalogue activity:', err);
  }
}

// Helper to update dashboard calculations
async function updateCatDashboardMetrics() {
  try {
    const items = await readJsonFile(CAT_ITEMS_PATH);
    const approvals = await readJsonFile(CAT_APPROVALS_PATH);
    
    // Seed standard mock baseline count
    const totalItems = items.filter(i => i.category !== 'Professional Services' && i.category !== 'Logistics').length + 8418;
    const totalServices = items.filter(i => i.category === 'Professional Services' || i.category === 'Logistics').length + 1247;
    const pendingApprovalsCount = approvals.length + 13;

    const stats = {
      totalItems,
      totalServices,
      activeVendors: 103,
      pendingApprovals: pendingApprovalsCount,
      criticalCategories: 4,
      rateRevisionsDue: 8,
      catalogueUtilization: 87.5
    };
    await writeJsonFile(CAT_DASHBOARD_PATH, stats);
  } catch (err) {
    console.error('Error updating dashboard metrics:', err);
  }
}

// 1. GET /api/catalogue/items
app.get('/api/catalogue/items', async (req, res) => {
  try {
    const items = await readJsonFile(CAT_ITEMS_PATH);
    const { category, status, search } = req.query;
    let filtered = [...items];

    if (category && category !== 'All') {
      filtered = filtered.filter(i => i.category === category);
    }
    if (status && status !== 'All') {
      filtered = filtered.filter(i => i.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(i => 
        i.itemName.toLowerCase().includes(q) ||
        i.itemCode.toLowerCase().includes(q) ||
        i.hsnCode?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q) ||
        i.preferredVendor?.vendorName?.toLowerCase().includes(q)
      );
    }
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /api/catalogue/items/:id
app.get('/api/catalogue/items/:id', async (req, res) => {
  try {
    const items = await readJsonFile(CAT_ITEMS_PATH);
    const item = items.find(i => i.itemId === req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST /api/catalogue/items
app.post('/api/catalogue/items', async (req, res) => {
  try {
    const itemData = req.body;
    const items = await readJsonFile(CAT_ITEMS_PATH);
    
    if (!itemData.itemId) {
      const year = new Date().getFullYear();
      const rand = Math.floor(1000 + Math.random() * 9000);
      itemData.itemId = `ITM-${year}-${rand}`;
    }

    itemData.status = 'Pending Approval';
    itemData.approvalWorkflow = {
      submittedBy: itemData.submittedBy || 'Saurabh Anand',
      submittedDate: new Date().toISOString().split('T')[0],
      approvalStatus: 'Pending',
      currentApprover: 'Procurement Checker'
    };
    itemData.uploadedFiles = itemData.uploadedFiles || [];
    itemData.auditTrail = [
      {
        action: 'Item Created',
        user: itemData.submittedBy || 'Saurabh Anand',
        dateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
    ];

    await appendJsonData(CAT_ITEMS_PATH, itemData);
    
    // Add to approvals queue
    const approvalRequest = {
      approvalId: `APP-ITM-${Math.floor(100 + Math.random() * 900)}`,
      itemId: itemData.itemId,
      itemName: itemData.itemName,
      category: itemData.category,
      preferredVendor: itemData.preferredVendor?.vendorName || 'N/A',
      submittedBy: itemData.submittedBy || 'Saurabh Anand',
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      currentApprover: 'Procurement Checker'
    };
    await appendJsonData(CAT_APPROVALS_PATH, approvalRequest);

    await logCatActivity(itemData.itemId, 'Item Created & Submitted for Approval', itemData.submittedBy);
    await updateCatDashboardMetrics();

    res.json({ success: true, item: itemData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. PUT /api/catalogue/items/:id
app.put('/api/catalogue/items/:id', async (req, res) => {
  try {
    const updated = await updateJsonData(CAT_ITEMS_PATH, 'itemId', req.params.id, req.body);
    await logCatActivity(req.params.id, 'Item Updated', req.body.submittedBy);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. DELETE /api/catalogue/items/:id
app.delete('/api/catalogue/items/:id', async (req, res) => {
  try {
    await deleteJsonData(CAT_ITEMS_PATH, 'itemId', req.params.id);
    await deleteJsonData(CAT_APPROVALS_PATH, 'itemId', req.params.id);
    await logCatActivity(req.params.id, 'Item Deleted', 'Admin');
    await updateCatDashboardMetrics();
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. GET /api/catalogue/vendors
app.get('/api/catalogue/vendors', async (req, res) => {
  try {
    const vendors = await readJsonFile(CAT_VENDORS_PATH);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. GET /api/catalogue/hsn-sac
app.get('/api/catalogue/hsn-sac', async (req, res) => {
  try {
    const codes = await readJsonFile(CAT_HSN_CODES_PATH);
    res.json(codes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. GET /api/catalogue/uoms
app.get('/api/catalogue/uoms', async (req, res) => {
  try {
    const uoms = await readJsonFile(CAT_UOMS_PATH);
    res.json(uoms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. GET /api/catalogue/dashboard
app.get('/api/catalogue/dashboard', async (req, res) => {
  try {
    const stats = await readJsonFile(CAT_DASHBOARD_PATH);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. GET /api/catalogue/pending-approvals
app.get('/api/catalogue/pending-approvals', async (req, res) => {
  try {
    const approvals = await readJsonFile(CAT_APPROVALS_PATH);
    res.json(approvals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 11. POST /api/catalogue/approvals/:id/resolve
app.post('/api/catalogue/approvals/:id/resolve', async (req, res) => {
  try {
    const { action, remarks, performedBy } = req.body;
    const approvals = await readJsonFile(CAT_APPROVALS_PATH);
    const appEntry = approvals.find(a => a.approvalId === req.params.id || a.itemId === req.params.id);
    if (!appEntry) {
      return res.status(404).json({ message: 'Approval request not found' });
    }

    const finalStatus = action === 'Approve' ? 'Published' : action === 'Reject' ? 'Rejected' : 'Draft';
    const userName = performedBy || 'Neha Sharma';

    const item = await updateJsonData(CAT_ITEMS_PATH, 'itemId', appEntry.itemId, {
      status: finalStatus,
      approvalWorkflow: {
        submittedBy: appEntry.submittedBy,
        submittedDate: appEntry.submittedDate,
        approvalStatus: action === 'Approve' ? 'Approved' : action === 'Reject' ? 'Rejected' : 'Sent Back',
        currentApprover: '',
        checkerRemarks: remarks,
        checkedBy: userName,
        checkedDate: new Date().toISOString().split('T')[0]
      },
      auditTrail: [
        {
          action: `Item ${action}d`,
          user: userName,
          dateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      ]
    });

    await deleteJsonData(CAT_APPROVALS_PATH, 'itemId', appEntry.itemId);

    await logCatActivity(appEntry.itemId, `Item ${action}d by Checker`, userName);
    await updateCatDashboardMetrics();

    res.json({ success: true, message: `Catalogue item ${action}d successfully.`, item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 12. POST /api/catalogue/upload
app.post('/api/catalogue/upload', catUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file was uploaded' });
    }

    const { linkedModule, linkedRecordId, fileType, uploadedBy } = req.body;
    
    const cleanPath = '/uploads/catalogue/' + 
      (fileType === 'Product Image' ? 'images/' : 
       fileType === 'Compliance Certificate' || fileType === 'Technical Document' ? 'compliance/' : 'specifications/') + 
      req.file.filename;

    const fileMeta = {
      fileId: `FILE-${Math.floor(Math.random() * 9000) + 1000}`,
      linkedModule: linkedModule || 'Item Master',
      linkedRecordId: linkedRecordId || '',
      fileName: req.file.originalname,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      storagePath: cleanPath,
      uploadedBy: uploadedBy || 'Saurabh Anand',
      uploadedOn: new Date().toISOString().split('T')[0],
      size: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`
    };

    await appendJsonData(CAT_UPLOADED_FILES_PATH, fileMeta);

    res.json({ success: true, file: fileMeta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 13. GET /api/catalogue/files/:itemId
app.get('/api/catalogue/files/:itemId', async (req, res) => {
  try {
    const files = await readJsonFile(CAT_UPLOADED_FILES_PATH);
    const filtered = files.filter(f => f.linkedRecordId === req.params.itemId);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CONTRACTS & SLAs MODULE APIs
// ==========================================

const CONTRACTS_DIR = path.join(__dirname, 'data', 'contracts');
const CONTRACTS_PATH = path.join(CONTRACTS_DIR, 'contracts.json');
const CONTRACT_DASHBOARD_PATH = path.join(CONTRACTS_DIR, 'contract-dashboard.json');
const CONTRACT_APPROVALS_PATH = path.join(CONTRACTS_DIR, 'contract-approvals.json');
const CONTRACT_RENEWALS_PATH = path.join(CONTRACTS_DIR, 'contract-renewals.json');
const CLAUSE_LIBRARY_PATH = path.join(CONTRACTS_DIR, 'clause-library.json');
const CONTRACT_ACTIVITY_PATH = path.join(CONTRACTS_DIR, 'contract-activity.json');
const CONTRACT_RISK_INSIGHTS_PATH = path.join(CONTRACTS_DIR, 'contract-risk-insights.json');
const SLA_TRACKER_PATH = path.join(CONTRACTS_DIR, 'sla-tracker.json');
const CONTRACT_UPLOADED_FILES_PATH = path.join(CONTRACTS_DIR, 'uploaded-files.json');
const CONTRACT_TEMPLATES_PATH = path.join(CONTRACTS_DIR, 'contract-templates.json');
const CONTRACT_AUDIT_LOG_PATH = path.join(CONTRACTS_DIR, 'contract-audit-log.json');
const CONTRACTS_VENDORS_PATH = path.join(CONTRACTS_DIR, 'vendors.json');
const CONTRACT_TYPES_PATH = path.join(CONTRACTS_DIR, 'contract-types.json');

const CONTRACTS_UPLOADS_DIR = path.join(UPLOADS_DIR, 'contracts');
const CTR_LEGAL_DIR = path.join(CONTRACTS_UPLOADS_DIR, 'legal');
const CTR_SLA_DIR = path.join(CONTRACTS_UPLOADS_DIR, 'sla');
const CTR_COMPLIANCE_DIR = path.join(CONTRACTS_UPLOADS_DIR, 'compliance');
const CTR_SUPPORTING_DIR = path.join(CONTRACTS_UPLOADS_DIR, 'supporting-documents');
const CTR_TEMPLATES_DIR = path.join(CONTRACTS_UPLOADS_DIR, 'templates');
const CTR_SIGNED_DIR = path.join(CONTRACTS_UPLOADS_DIR, 'signed');
const CTR_TEMP_DIR = path.join(CONTRACTS_UPLOADS_DIR, 'temp');

// Ensure contract folders exist
async function ensureContractDirs() {
  await fs.mkdir(CONTRACTS_DIR, { recursive: true });
  await fs.mkdir(CONTRACTS_UPLOADS_DIR, { recursive: true });
  await fs.mkdir(CTR_LEGAL_DIR, { recursive: true });
  await fs.mkdir(CTR_SLA_DIR, { recursive: true });
  await fs.mkdir(CTR_COMPLIANCE_DIR, { recursive: true });
  await fs.mkdir(CTR_SUPPORTING_DIR, { recursive: true });
  await fs.mkdir(CTR_TEMPLATES_DIR, { recursive: true });
  await fs.mkdir(CTR_SIGNED_DIR, { recursive: true });
  await fs.mkdir(CTR_TEMP_DIR, { recursive: true });
}
ensureContractDirs().catch(console.error);

// ==========================================
// PURCHASE ORDERS PATHS & DIRECTORIES SETUP
// ==========================================
const PO_DIR = path.join(__dirname, 'data', 'purchase-orders');
const PO_REQUISITIONS_PATH = path.join(PO_DIR, 'requisitions.json');
const PO_PURCHASE_ORDERS_PATH = path.join(PO_DIR, 'purchase-orders.json');
const PO_DASHBOARD_PATH = path.join(PO_DIR, 'po-dashboard.json');
const PO_APPROVALS_PATH = path.join(PO_DIR, 'po-approvals.json');
const PO_RFQ_VENDORS_PATH = path.join(PO_DIR, 'rfq-vendors.json');
const PO_BUDGET_TRACKER_PATH = path.join(PO_DIR, 'budget-tracker.json');
const PO_GOODS_RECEIPT_PATH = path.join(PO_DIR, 'goods-receipt.json');
const PO_THREE_WAY_MATCH_PATH = path.join(PO_DIR, 'three-way-match.json');
const PO_UPLOADED_FILES_PATH = path.join(PO_DIR, 'uploaded-files.json');
const PO_ACTIVITY_LOG_PATH = path.join(PO_DIR, 'po-activity-log.json');
const PO_AI_INSIGHTS_PATH = path.join(PO_DIR, 'po-ai-insights.json');
const PO_AUDIT_LOG_PATH = path.join(PO_DIR, 'po-audit-log.json');

const PO_UPLOADS_DIR = path.join(UPLOADS_DIR, 'purchase-orders');
const PO_SPEC_DIR = path.join(PO_UPLOADS_DIR, 'specifications');
const PO_RFQ_DOCS_DIR = path.join(PO_UPLOADS_DIR, 'rfq-documents');
const PO_VEND_QUOTES_DIR = path.join(PO_UPLOADS_DIR, 'vendor-quotes');
const PO_CONTRACTS_DIR = path.join(PO_UPLOADS_DIR, 'contracts');
const PO_INVOICES_DIR = path.join(PO_UPLOADS_DIR, 'invoices');
const PO_GRN_DIR = path.join(PO_UPLOADS_DIR, 'grn');
const PO_TEMP_DIR = path.join(PO_UPLOADS_DIR, 'temp');

async function ensurePODirs() {
  await fs.mkdir(PO_DIR, { recursive: true });
  await fs.mkdir(PO_UPLOADS_DIR, { recursive: true });
  await fs.mkdir(PO_SPEC_DIR, { recursive: true });
  await fs.mkdir(PO_RFQ_DOCS_DIR, { recursive: true });
  await fs.mkdir(PO_VEND_QUOTES_DIR, { recursive: true });
  await fs.mkdir(PO_CONTRACTS_DIR, { recursive: true });
  await fs.mkdir(PO_INVOICES_DIR, { recursive: true });
  await fs.mkdir(PO_GRN_DIR, { recursive: true });
  await fs.mkdir(PO_TEMP_DIR, { recursive: true });
}
ensurePODirs().catch(console.error);

// Contracts Multer storage
const contractStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const documentCategory = req.body.documentCategory || 'supporting-documents';
    let dest = CTR_SUPPORTING_DIR;
    if (documentCategory === 'Legal Agreement' || documentCategory === 'Contract Document') {
      dest = CTR_LEGAL_DIR;
    } else if (documentCategory === 'SLA Document' || documentCategory === 'SLA') {
      dest = CTR_SLA_DIR;
    } else if (documentCategory === 'Compliance' || documentCategory === 'Compliance Documents') {
      dest = CTR_COMPLIANCE_DIR;
    } else if (documentCategory === 'Template') {
      dest = CTR_TEMPLATES_DIR;
    } else if (documentCategory === 'Signed Contract') {
      dest = CTR_SIGNED_DIR;
    } else if (documentCategory === 'Temp') {
      dest = CTR_TEMP_DIR;
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'CTR_' + uniqueSuffix + ext);
  }
});
const contractUpload = multer({ storage: contractStorage });

// Helper to update contract dashboard stats
async function updateContractDashboardMetrics() {
  try {
    const contracts = await readJsonFile(CONTRACTS_PATH);
    const approvals = await readJsonFile(CONTRACT_APPROVALS_PATH);
    const sla = await readJsonFile(SLA_TRACKER_PATH);

    const totalActive = contracts.filter(c => c.status === 'Active').length + 843;
    const expiringSoonCount = contracts.filter(c => {
      if (c.status !== 'Active') return false;
      const exp = new Date(c.expiryDate);
      const diffTime = exp - new Date();
      const diffDays = Math.ceil(diffTime / (1024 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 30;
    }).length + 40;

    const pendingLegalReviewsCount = approvals.filter(a => a.currentStage === 'Legal Review').length + 62;
    const breaches = sla.reduce((sum, item) => sum + (item.breachCount || 0), 0) + 11;

    // Calculate lifecycle counts
    const active = contracts.filter(c => c.status === 'Active').length + 843;
    const draft = contracts.filter(c => c.status === 'Draft').length + 119;
    const review = contracts.filter(c => c.status === 'In Review').length + 62;
    const sig = contracts.filter(c => c.status === 'Pending Signature').length + 41;
    const expired = contracts.filter(c => c.status === 'Expired').length + 27;

    const lifecycleDistribution = [
      { name: 'Active', value: active, color: '#16A34A' },
      { name: 'Draft', value: draft, color: '#94A3B8' },
      { name: 'Under Review', value: review, color: '#F59E0B' },
      { name: 'Pending Signature', value: sig, color: '#3B82F6' },
      { name: 'Expired', value: expired, color: '#EF4444' }
    ];

    const currentDashboard = await readJsonFile(CONTRACT_DASHBOARD_PATH);
    const updated = {
      ...currentDashboard,
      totalActiveContracts: totalActive,
      expiringSoon: expiringSoonCount,
      pendingLegalReviews: pendingLegalReviewsCount,
      slaBreaches: breaches,
      lifecycleDistribution
    };
    await writeJsonFile(CONTRACT_DASHBOARD_PATH, updated);
  } catch (err) {
    console.error('Error updating contract dashboard stats:', err.message);
  }
}


// 0. GET /api/contracts/vendors
app.get('/api/contracts/vendors', async (req, res) => {
  try {
    const vendors = await readJsonFile(CONTRACTS_VENDORS_PATH);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 1. GET /api/contracts
app.get('/api/contracts', async (req, res) => {

  try {
    const contracts = await readJsonFile(CONTRACTS_PATH);
    const { status, risk, contractType, search } = req.query;
    let filtered = [...contracts];

    if (status && status !== 'All' && status !== 'Status: All') {
      filtered = filtered.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }
    if (risk && risk !== 'All' && risk !== 'Risk Level: All') {
      filtered = filtered.filter(c => c.riskInsights?.portfolioRisk?.toLowerCase() === risk.toLowerCase());
    }
    if (contractType && contractType !== 'All' && contractType !== 'Contract Type: All') {
      filtered = filtered.filter(c => c.contractType.toLowerCase() === contractType.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.contractId.toLowerCase().includes(q) ||
        c.vendor?.vendorName?.toLowerCase().includes(q) ||
        c.contractType.toLowerCase().includes(q) ||
        c.contractName.toLowerCase().includes(q) ||
        c.department?.toLowerCase().includes(q) ||
        c.riskInsights?.portfolioRisk?.toLowerCase().includes(q)
      );
    }
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /api/contracts/dashboard
app.get('/api/contracts/dashboard', async (req, res) => {
  try {
    await updateContractDashboardMetrics();
    const dashboard = await readJsonFile(CONTRACT_DASHBOARD_PATH);
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. GET /api/contracts/approvals
app.get('/api/contracts/approvals', async (req, res) => {
  try {
    const approvals = await readJsonFile(CONTRACT_APPROVALS_PATH);
    res.json(approvals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. GET /api/contracts/renewals
app.get('/api/contracts/renewals', async (req, res) => {
  try {
    const renewals = await readJsonFile(CONTRACT_RENEWALS_PATH);
    res.json(renewals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. GET /api/contracts/clauses
app.get('/api/contracts/clauses', async (req, res) => {
  try {
    const clauses = await readJsonFile(CLAUSE_LIBRARY_PATH);
    res.json(clauses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. GET /api/contracts/:id
app.get('/api/contracts/:id', async (req, res) => {
  try {
    const contracts = await readJsonFile(CONTRACTS_PATH);
    const contract = contracts.find(c => c.contractId === req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. POST /api/contracts and /api/contracts/create
const handleCreateContract = async (req, res) => {
  try {
    const contractData = req.body;
    const contracts = await readJsonFile(CONTRACTS_PATH);

    if (!contractData.contractId) {
      const year = new Date().getFullYear();
      const rand = Math.floor(10000 + Math.random() * 90000);
      contractData.contractId = `CTR-${year}-${String(rand).padStart(5, '0')}`;
    }

    contractData.status = "In Review";
    contractData.createdDate = new Date().toISOString().split('T')[0];
    contractData.lastModified = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    contractData.approvalWorkflow = {
      currentStage: "Procurement Review",
      workflowStep: 1,
      approvalStatus: "Pending",
      currentApprover: "Procurement Team",
      submittedBy: contractData.submittedBy || "Saurabh Anand",
      submittedOn: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    // Calculate Mock AI Risk Insights
    const legalRisk = Math.floor(40 + Math.random() * 30);
    const complianceRisk = Math.floor(15 + Math.random() * 20);
    const financialRisk = Math.floor(50 + Math.random() * 30);
    const riskLevel = financialRisk > 70 ? "High" : financialRisk > 40 ? "Medium" : "Low";

    contractData.riskInsights = {
      portfolioRisk: riskLevel,
      legalExposure: legalRisk,
      complianceRisk: complianceRisk,
      financialRisk: financialRisk,
      aiAlerts: [
        "Missing explicit data residency clause",
        "Penalty cap set to 5% instead of standard 10%"
      ]
    };

    contractData.auditTrail = [
      {
        action: "Contract Created",
        user: contractData.submittedBy || "Saurabh Anand",
        dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      }
    ];

    await appendJsonData(CONTRACTS_PATH, contractData);

    // Save history in contract-approvals.json
    const approvalItem = {
      approvalId: `APP-CTR-${Math.floor(1000 + Math.random() * 9000)}`,
      contractId: contractData.contractId,
      vendorName: contractData.vendor?.vendorName || "Unknown Vendor",
      currentStage: "Procurement Review",
      assignedTo: "Procurement Team",
      status: "Pending",
      remarks: "",
      history: [
        {
          action: "Submitted",
          by: contractData.submittedBy || "Saurabh Anand",
          dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        }
      ]
    };
    await appendJsonData(CONTRACT_APPROVALS_PATH, approvalItem);

    // Log Activity
    const activity = {
      id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
      contractId: contractData.contractId,
      action: "Contract Created",
      user: contractData.submittedBy || "Saurabh Anand",
      dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    await appendJsonData(CONTRACT_ACTIVITY_PATH, activity);

    // Audit Log
    const auditLog = {
      id: `AUD-CTR-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      contractId: contractData.contractId,
      action: "Contract Created & Submitted for Approval",
      performedBy: contractData.submittedBy || "Saurabh Anand",
      details: `Contract with ${contractData.vendor?.vendorName || 'Unknown Vendor'} created and routed to Procurement Review.`
    };
    await appendJsonData(CONTRACT_AUDIT_LOG_PATH, auditLog);

    // Risk Insights Cache
    const riskInsightsItem = {
      contractId: contractData.contractId,
      portfolioRisk: riskLevel,
      legalExposure: legalRisk,
      complianceRisk: complianceRisk,
      financialRisk: financialRisk,
      alerts: [
        { severity: "High", message: "Missing explicit data residency clause" },
        { severity: "Medium", message: "Penalty cap set below enterprise standard" }
      ]
    };
    await appendJsonData(CONTRACT_RISK_INSIGHTS_PATH, riskInsightsItem);

    await updateContractDashboardMetrics();

    res.status(201).json({ success: true, contract: contractData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
app.post('/api/contracts', handleCreateContract);
app.post('/api/contracts/create', handleCreateContract);

// 8. PUT /api/contracts/:id
app.put('/api/contracts/:id', async (req, res) => {
  try {
    const updated = await updateJsonData(CONTRACTS_PATH, 'contractId', req.params.id, req.body);

    const auditLog = {
      id: `AUD-CTR-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      contractId: req.params.id,
      action: "Contract Updated",
      performedBy: req.body.submittedBy || "Saurabh Anand",
      details: "Contract details updated in repository."
    };
    await appendJsonData(CONTRACT_AUDIT_LOG_PATH, auditLog);

    await updateContractDashboardMetrics();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. DELETE /api/contracts/:id
app.delete('/api/contracts/:id', async (req, res) => {
  try {
    await deleteJsonData(CONTRACTS_PATH, 'contractId', req.params.id);
    await deleteJsonData(CONTRACT_APPROVALS_PATH, 'contractId', req.params.id);
    await deleteJsonData(CONTRACT_RENEWALS_PATH, 'contractId', req.params.id);

    const auditLog = {
      id: `AUD-CTR-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      contractId: req.params.id,
      action: "Contract Deleted",
      performedBy: "Saurabh Anand",
      details: `Contract ${req.params.id} permanently deleted.`
    };
    await appendJsonData(CONTRACT_AUDIT_LOG_PATH, auditLog);

    await updateContractDashboardMetrics();
    res.json({ success: true, message: 'Contract deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. POST /api/contracts/upload
app.post('/api/contracts/upload', contractUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const { linkedRecordId, documentCategory, uploadedBy } = req.body;
    const cleanPath = '/uploads/contracts/' + 
      (documentCategory === 'Legal Agreement' || documentCategory === 'Contract Document' ? 'legal/' :
       documentCategory === 'SLA Document' || documentCategory === 'SLA' ? 'sla/' :
       documentCategory === 'Compliance' ? 'compliance/' :
       documentCategory === 'Template' ? 'templates/' :
       documentCategory === 'Signed Contract' ? 'signed/' : 'supporting-documents/') +
      req.file.filename;

    const fileMeta = {
      fileId: `FILE-CTR-${Math.floor(1000 + Math.random() * 9000)}`,
      linkedModule: "Contracts",
      linkedRecordId: linkedRecordId || "",
      fileName: req.file.originalname,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      documentCategory: documentCategory || "supporting-documents",
      storagePath: cleanPath,
      filePath: cleanPath,
      uploadedBy: uploadedBy || "Saurabh Anand",
      uploadedOn: new Date().toISOString().split('T')[0],
      fileSize: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`,
      size: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`,
      version: "v1.0",
      isSigned: false
    };

    await appendJsonData(CONTRACT_UPLOADED_FILES_PATH, fileMeta);
    res.json({ success: true, file: fileMeta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 11. GET /api/contracts/files/:contractId
app.get('/api/contracts/files/:contractId', async (req, res) => {
  try {
    const files = await readJsonFile(CONTRACT_UPLOADED_FILES_PATH);
    const filtered = files.filter(f => f.linkedRecordId === req.params.contractId);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 12. POST /api/contracts/approve
app.post('/api/contracts/approve', async (req, res) => {
  try {
    const { contractId, remarks, performedBy } = req.body;
    const userName = performedBy || 'Saurabh Anand';

    const contracts = await readJsonFile(CONTRACTS_PATH);
    const cIndex = contracts.findIndex(c => c.contractId === contractId);
    if (cIndex === -1) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const contract = contracts[cIndex];
    let workflow = contract.approvalWorkflow || {};
    let nextStage = "";
    let nextStep = workflow.workflowStep || 1;
    let nextStatus = "In Review";

    if (workflow.workflowStep === 1) {
      nextStage = "Legal Review";
      nextStep = 2;
    } else if (workflow.workflowStep === 2) {
      nextStage = "Finance Review";
      nextStep = 3;
    } else if (workflow.workflowStep === 3) {
      nextStage = "Final Approval";
      nextStep = 4;
    } else if (workflow.workflowStep === 4) {
      nextStage = "Approved";
      nextStep = 4;
      nextStatus = "Active";
    }

    contract.status = nextStatus;
    contract.approvalWorkflow = {
      ...workflow,
      currentStage: nextStage === "Approved" ? "" : nextStage,
      workflowStep: nextStep,
      approvalStatus: nextStatus === "Active" ? "Approved" : "Pending",
      currentApprover: nextStage === "Legal Review" ? "Legal Team" : 
                       nextStage === "Finance Review" ? "Finance Team" :
                       nextStage === "Final Approval" ? "Executive Board" : "",
      lastRemarks: remarks
    };

    if (!contract.auditTrail) contract.auditTrail = [];
    contract.auditTrail.push({
      action: `Approved at Stage ${workflow.currentStage}`,
      user: userName,
      dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      remarks
    });

    contracts[cIndex] = contract;
    await writeJsonFile(CONTRACTS_PATH, contracts);

    // Update approvals queue
    const approvals = await readJsonFile(CONTRACT_APPROVALS_PATH);
    const appIndex = approvals.findIndex(a => a.contractId === contractId);
    if (appIndex !== -1) {
      if (nextStatus === "Active") {
        approvals.splice(appIndex, 1);
      } else {
        approvals[appIndex].currentStage = nextStage;
        approvals[appIndex].assignedTo = contract.approvalWorkflow.currentApprover;
        approvals[appIndex].remarks = remarks;
        if (!approvals[appIndex].history) approvals[appIndex].history = [];
        approvals[appIndex].history.push({
          action: `Approved by ${workflow.currentStage}`,
          by: userName,
          dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          remarks
        });
      }
      await writeJsonFile(CONTRACT_APPROVALS_PATH, approvals);
    }

    // Log activity
    const activity = {
      id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
      contractId,
      action: `Approved (${workflow.currentStage})`,
      user: userName,
      dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    await appendJsonData(CONTRACT_ACTIVITY_PATH, activity);

    // Audit Log
    const auditLog = {
      id: `AUD-CTR-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      contractId,
      action: `Stage Approval: ${workflow.currentStage}`,
      performedBy: userName,
      details: `Approved by ${userName} at ${workflow.currentStage}. Remarks: ${remarks || 'None'}`
    };
    await appendJsonData(CONTRACT_AUDIT_LOG_PATH, auditLog);

    await updateContractDashboardMetrics();
    res.json({ success: true, contract });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 13. POST /api/contracts/reject
app.post('/api/contracts/reject', async (req, res) => {
  try {
    const { contractId, remarks, performedBy, actionType } = req.body;
    const userName = performedBy || 'Saurabh Anand';
    const mode = actionType || 'Reject';

    const contracts = await readJsonFile(CONTRACTS_PATH);
    const cIndex = contracts.findIndex(c => c.contractId === contractId);
    if (cIndex === -1) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const contract = contracts[cIndex];
    const previousStage = contract.approvalWorkflow?.currentStage || "Review";

    contract.status = mode === 'Send Back' ? 'Draft' : 'Terminated';
    contract.approvalWorkflow = {
      ...contract.approvalWorkflow,
      approvalStatus: mode === 'Send Back' ? 'Sent Back' : 'Rejected',
      currentStage: mode === 'Send Back' ? 'Procurement Review' : 'Rejected',
      workflowStep: mode === 'Send Back' ? 1 : 0,
      currentApprover: mode === 'Send Back' ? 'Procurement Team' : '',
      lastRemarks: remarks
    };

    if (!contract.auditTrail) contract.auditTrail = [];
    contract.auditTrail.push({
      action: `${mode}ed at Stage ${previousStage}`,
      user: userName,
      dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      remarks
    });

    contracts[cIndex] = contract;
    await writeJsonFile(CONTRACTS_PATH, contracts);

    const approvals = await readJsonFile(CONTRACT_APPROVALS_PATH);
    const appIndex = approvals.findIndex(a => a.contractId === contractId);
    if (appIndex !== -1) {
      if (mode === 'Send Back') {
        approvals[appIndex].currentStage = "Procurement Review";
        approvals[appIndex].assignedTo = "Procurement Team";
        approvals[appIndex].status = "Sent Back";
        approvals[appIndex].remarks = remarks;
        if (!approvals[appIndex].history) approvals[appIndex].history = [];
        approvals[appIndex].history.push({
          action: `Sent Back by ${previousStage}`,
          by: userName,
          dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          remarks
        });
      } else {
        approvals.splice(appIndex, 1);
      }
      await writeJsonFile(CONTRACT_APPROVALS_PATH, approvals);
    }

    const activity = {
      id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
      contractId,
      action: `${mode}ed (${previousStage})`,
      user: userName,
      dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    await appendJsonData(CONTRACT_ACTIVITY_PATH, activity);

    const auditLog = {
      id: `AUD-CTR-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      contractId,
      action: `Contract ${mode}ed`,
      performedBy: userName,
      details: `${mode}ed at ${previousStage} by ${userName}. Remarks: ${remarks || 'None'}`
    };
    await appendJsonData(CONTRACT_AUDIT_LOG_PATH, auditLog);

    await updateContractDashboardMetrics();
    res.json({ success: true, contract });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// PURCHASE ORDERS MODULE APIs
// ==========================================

// Dashboard metrics helper
async function updatePODashboardMetrics() {
  try {
    const pos = await readJsonFile(PO_PURCHASE_ORDERS_PATH);
    const reqs = await readJsonFile(PO_REQUISITIONS_PATH);
    const approvals = await readJsonFile(PO_APPROVALS_PATH);
    const grns = await readJsonFile(PO_GOODS_RECEIPT_PATH);
    const matches = await readJsonFile(PO_THREE_WAY_MATCH_PATH);

    // Sum PO values
    const totalValue = pos.reduce((sum, po) => sum + (po.poValue || 0), 0);
    // Value in Crores
    const valueCr = (totalValue / 10000000).toFixed(2);

    const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length;
    const posInProgress = pos.filter(po => ['Approved', 'Sent', 'Partially Received'].includes(po.status)).length;
    const goodsReceived = pos.filter(po => po.deliveryStatus === 'Received').length;
    const pendingInvoices = pos.filter(po => po.invoiceMatchStatus === 'Pending').length;

    // Status counts
    const statusCounts = {
      'Draft': 0,
      'Pending Approval': 0,
      'Approved': 0,
      'Partially Received': 0,
      'Fully Received': 0,
      'Canceled': 0
    };

    pos.forEach(po => {
      if (po.status === 'Draft') statusCounts['Draft']++;
      else if (po.status === 'Pending Approval') statusCounts['Pending Approval']++;
      else if (po.status === 'Approved' && po.deliveryStatus === 'Pending') statusCounts['Approved']++;
      else if (po.deliveryStatus === 'Partial') statusCounts['Partially Received']++;
      else if (po.deliveryStatus === 'Received') statusCounts['Fully Received']++;
      else if (po.status === 'Canceled') statusCounts['Canceled']++;
    });

    const statusColors = {
      'Draft': '#3B82F6',
      'Pending Approval': '#F59E0B',
      'Approved': '#10B981',
      'Partially Received': '#8B5CF6',
      'Fully Received': '#6366F1',
      'Canceled': '#EF4444'
    };

    const statusData = Object.keys(statusCounts).map(name => ({
      name,
      value: statusCounts[name],
      color: statusColors[name]
    }));

    // Category Spend aggregation
    const categoryTotals = {};
    pos.forEach(po => {
      const cat = po.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (po.poValue || 0);
    });

    const categoryData = Object.keys(categoryTotals).map(cat => ({
      category: cat,
      value: parseFloat((categoryTotals[cat] / 10000000).toFixed(2))
    })).sort((a, b) => b.value - a.value);

    // Top Vendors aggregation
    const vendorTotals = {};
    pos.forEach(po => {
      const vName = po.vendorName || 'Other';
      vendorTotals[vName] = (vendorTotals[vName] || 0) + (po.poValue || 0);
    });

    const maxVendorVal = Math.max(...Object.values(vendorTotals), 1);
    const topVendors = Object.keys(vendorTotals).map(name => {
      const val = parseFloat((vendorTotals[name] / 10000000).toFixed(2));
      const pct = Math.round((vendorTotals[name] / maxVendorVal) * 100);
      return {
        name,
        value: val,
        width: `${pct}%`
      };
    }).sort((a, b) => b.value - a.value).slice(0, 5);

    const dashboard = {
      kpis: {
        totalPOs: pos.length,
        posInProgress,
        awaitingApproval: pendingApprovalsCount,
        goodsReceived,
        pendingInvoices,
        poValueThisMonth: parseFloat(valueCr)
      },
      statusData,
      categoryData,
      trendData: [
        { month: 'Dec', thisYear: 200, lastYear: 150 },
        { month: 'Jan', thisYear: 350, lastYear: 280 },
        { month: 'Feb', thisYear: 500, lastYear: 420 },
        { month: 'Mar', thisYear: 750, lastYear: 600 },
        { month: 'Apr', thisYear: 820, lastYear: 750 },
        { month: 'May', thisYear: pos.length, lastYear: 850 }
      ],
      topVendors,
      approvalQueue: [
        { type: "PO Approval", count: pendingApprovalsCount, color: "#3b82f6" },
        { type: "PO Amendment", count: 8, color: "#3b82f6" },
        { type: "GRN Approval", count: grns.filter(g => g.grnStatus === 'Pending').length || 16, color: "#f59e0b" },
        { type: "Payment Approval", count: matches.filter(m => m.matchStatus === 'Partial Match').length || 15, color: "#8b5cf6" }
      ],
      aiInsights: await readJsonFile(PO_AI_INSIGHTS_PATH)
    };

    await writeJsonFile(PO_DASHBOARD_PATH, dashboard);
  } catch (error) {
    console.error('Failed to update PO dashboard metrics:', error);
  }
}

// Multer Disk storage for Purchase Orders files
const poStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const documentCategory = req.body.documentCategory || 'temp';
    let dest = PO_TEMP_DIR;
    if (documentCategory === 'Technical Specification' || documentCategory === 'Technical Document') {
      dest = PO_SPEC_DIR;
    } else if (documentCategory === 'RFQ Document') {
      dest = PO_RFQ_DOCS_DIR;
    } else if (documentCategory === 'Vendor Quote') {
      dest = PO_VEND_QUOTES_DIR;
    } else if (documentCategory === 'Linked Contract') {
      dest = PO_CONTRACTS_DIR;
    } else if (documentCategory === 'Invoice') {
      dest = PO_INVOICES_DIR;
    } else if (documentCategory === 'GRN File') {
      dest = PO_GRN_DIR;
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `FILE_${uniqueSuffix}${ext}`);
  }
});
const poUpload = multer({ storage: poStorage });

// 1. GET /api/requisitions
app.get('/api/requisitions', async (req, res) => {
  try {
    const requisitions = await readJsonFile(PO_REQUISITIONS_PATH);
    res.json(requisitions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /api/requisitions/:id
app.get('/api/requisitions/:id', async (req, res) => {
  try {
    const requisitions = await readJsonFile(PO_REQUISITIONS_PATH);
    const reqItem = requisitions.find(r => r.requisitionId === req.params.id);
    if (!reqItem) return res.status(404).json({ error: 'Requisition not found' });
    res.json(reqItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST /api/requisitions
app.post('/api/requisitions', async (req, res) => {
  try {
    const reqs = await readJsonFile(PO_REQUISITIONS_PATH);
    const requisitionsData = req.body;
    
    // Auto-generate Requisition ID
    const year = new Date().getFullYear();
    const reqNum = String(reqs.length + 83).padStart(5, '0');
    const requisitionId = `REQ-${year}-${reqNum}`;

    requisitionsData.requisitionId = requisitionId;
    requisitionsData.status = "Pending Approval";
    requisitionsData.createdDate = new Date().toISOString().split('T')[0];
    requisitionsData.lastModified = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Link uploaded docs
    if (requisitionsData.uploadedDocuments && requisitionsData.uploadedDocuments.length > 0) {
      requisitionsData.uploadedDocuments = requisitionsData.uploadedDocuments.map(doc => ({
        ...doc,
        linkedRecordId: requisitionId
      }));
    }

    // Set initial approval workflow stage
    requisitionsData.approvalWorkflow = {
      currentStage: "Department Head Approval",
      workflowStep: 1,
      approvalStatus: "Pending",
      submittedBy: requisitionsData.requester?.requesterName || "Saurabh Anand",
      submittedOn: requisitionsData.lastModified
    };

    reqs.unshift(requisitionsData);
    await writeJsonFile(PO_REQUISITIONS_PATH, reqs);

    // Create entry in po-approvals.json
    const approvalItem = {
      approvalId: `APP-PO-${Math.floor(1000 + Math.random() * 9000)}`,
      requisitionId,
      vendorName: requisitionsData.vendorSelection?.selectedVendorName || "ABC Infotech Pvt Ltd",
      department: requisitionsData.requester?.department || "IT Services",
      estimatedValue: requisitionsData.vendorSelection?.quotedPrice || requisitionsData.budgetDetails?.currentRequisitionValue || 1250000,
      currentStage: "Department Head Approval",
      assignedTo: "Priya Sharma",
      status: "Pending",
      remarks: "",
      submittedBy: requisitionsData.requester?.requesterName || "Saurabh Anand",
      submittedOn: requisitionsData.lastModified,
      history: [
        {
          action: "Submitted",
          by: requisitionsData.requester?.requesterName || "Saurabh Anand",
          dateTime: requisitionsData.lastModified
        }
      ]
    };
    await appendJsonData(PO_APPROVALS_PATH, approvalItem);

    // Log in Audit & Activity Logs
    const activity = {
      id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
      requisitionId,
      action: "Requisition Created",
      user: requisitionsData.requester?.requesterName || "Saurabh Anand",
      dateTime: requisitionsData.lastModified
    };
    await appendJsonData(PO_ACTIVITY_LOG_PATH, activity);

    const auditLog = {
      id: `AUD-PO-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      requisitionId,
      action: "Requisition Submitted",
      performedBy: requisitionsData.requester?.requesterName || "Saurabh Anand",
      details: `Requisition with ID ${requisitionId} created and routed for Department Head Approval.`
    };
    await appendJsonData(PO_AUDIT_LOG_PATH, auditLog);

    await updatePODashboardMetrics();

    res.status(201).json({ success: true, requisition: requisitionsData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. GET /api/purchase-orders
app.get('/api/purchase-orders', async (req, res) => {
  try {
    const pos = await readJsonFile(PO_PURCHASE_ORDERS_PATH);
    res.json(pos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. POST /api/purchase-orders/generate
app.post('/api/purchase-orders/generate', async (req, res) => {
  try {
    const { requisitionId } = req.body;
    const requisitions = await readJsonFile(PO_REQUISITIONS_PATH);
    const reqItem = requisitions.find(r => r.requisitionId === requisitionId);
    
    if (!reqItem) return res.status(404).json({ error: 'Requisition not found' });

    const pos = await readJsonFile(PO_PURCHASE_ORDERS_PATH);
    const year = new Date().getFullYear();
    const poNum = String(pos.length + 790).padStart(6, '0');
    const poId = `PO-${year}-${poNum}`;

    const newPO = {
      poId,
      linkedRequisitionId: requisitionId,
      vendorId: reqItem.vendorSelection?.selectedVendorId || "VND-2025-00029",
      vendorName: reqItem.vendorSelection?.selectedVendorName || "ABC Infotech Pvt Ltd",
      category: reqItem.category || "IT Services",
      poValue: reqItem.vendorSelection?.quotedPrice || 1250000,
      currency: "INR",
      createdDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliveryStatus: "Pending",
      status: "Approved",
      paymentTerms: "Net 30",
      goodsReceiptStatus: "Pending",
      invoiceMatchStatus: "Pending"
    };

    pos.unshift(newPO);
    await writeJsonFile(PO_PURCHASE_ORDERS_PATH, pos);

    // Update Requisition status
    reqItem.status = "Approved";
    reqItem.lastModified = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    await writeJsonFile(PO_REQUISITIONS_PATH, requisitions);

    // Log Activity
    const activity = {
      id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
      poId,
      requisitionId,
      action: "PO Generated",
      user: "System",
      dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    await appendJsonData(PO_ACTIVITY_LOG_PATH, activity);

    const auditLog = {
      id: `AUD-PO-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      requisitionId,
      poId,
      action: "Purchase Order Generated",
      performedBy: "System",
      details: `Purchase Order ${poId} generated automatically from approved Requisition ${requisitionId}.`
    };
    await appendJsonData(PO_AUDIT_LOG_PATH, auditLog);

    await updatePODashboardMetrics();

    res.status(201).json({ success: true, purchaseOrder: newPO });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. GET /api/purchase-orders/dashboard
app.get('/api/purchase-orders/dashboard', async (req, res) => {
  try {
    await updatePODashboardMetrics();
    const dashboard = await readJsonFile(PO_DASHBOARD_PATH);
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. GET /api/purchase-orders/approvals
app.get('/api/purchase-orders/approvals', async (req, res) => {
  try {
    const approvals = await readJsonFile(PO_APPROVALS_PATH);
    const activeApprovals = approvals.filter(a => a.status === 'Pending');
    res.json(activeApprovals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. POST /api/purchase-orders/approve
app.post('/api/purchase-orders/approve', async (req, res) => {
  try {
    const { requisitionId, remarks, approvedBy } = req.body;
    const approvals = await readJsonFile(PO_APPROVALS_PATH);
    const appItem = approvals.find(a => a.requisitionId === requisitionId && a.status === 'Pending');

    if (!appItem) return res.status(404).json({ error: 'Pending approval item not found' });

    const currentStage = appItem.currentStage;
    let nextStage = "";
    let assignedTo = "";

    if (currentStage === "Department Head Approval") {
      nextStage = "Finance Approval";
      assignedTo = "Vikram Singh";
    } else if (currentStage === "Finance Approval") {
      nextStage = "Procurement Head Approval";
      assignedTo = "Saurabh Anand";
    } else {
      // Final Approval reached
      nextStage = "Approved";
    }

    const dateTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    appItem.history.push({
      action: `${currentStage} Approved`,
      by: approvedBy || "Approver",
      dateTime,
      remarks: remarks || ""
    });

    // Update requisition workflow details
    const requisitions = await readJsonFile(PO_REQUISITIONS_PATH);
    const reqItem = requisitions.find(r => r.requisitionId === requisitionId);

    if (nextStage === "Approved") {
      appItem.status = "Approved";
      appItem.currentStage = "Approved";
      appItem.assignedTo = "";
      
      if (reqItem) {
        reqItem.approvalWorkflow.approvalStatus = "Approved";
        reqItem.approvalWorkflow.currentStage = "Approved";
        reqItem.status = "Approved";
        await writeJsonFile(PO_REQUISITIONS_PATH, requisitions);
      }

      await writeJsonFile(PO_APPROVALS_PATH, approvals);

      // Auto-generate PO
      const pos = await readJsonFile(PO_PURCHASE_ORDERS_PATH);
      const year = new Date().getFullYear();
      const poNum = String(pos.length + 790).padStart(6, '0');
      const poId = `PO-${year}-${poNum}`;

      const newPO = {
        poId,
        linkedRequisitionId: requisitionId,
        vendorId: reqItem?.vendorSelection?.selectedVendorId || "VND-2025-00029",
        vendorName: reqItem?.vendorSelection?.selectedVendorName || "ABC Infotech Pvt Ltd",
        category: reqItem?.category || "IT Services",
        poValue: reqItem?.vendorSelection?.quotedPrice || 1250000,
        currency: "INR",
        createdDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        deliveryStatus: "Pending",
        status: "Approved",
        paymentTerms: "Net 30",
        goodsReceiptStatus: "Pending",
        invoiceMatchStatus: "Pending"
      };
      pos.unshift(newPO);
      await writeJsonFile(PO_PURCHASE_ORDERS_PATH, pos);

      // Log activity
      const activity = {
        id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
        poId,
        requisitionId,
        action: "PO Approved & Generated",
        user: approvedBy || "Saurabh Anand",
        dateTime
      };
      await appendJsonData(PO_ACTIVITY_LOG_PATH, activity);

      const auditLog = {
        id: `AUD-PO-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        requisitionId,
        poId,
        action: "Requisition Final Approved",
        performedBy: approvedBy || "Saurabh Anand",
        details: `Requisition approved by Procurement Head and PO ${poId} generated.`
      };
      await appendJsonData(PO_AUDIT_LOG_PATH, auditLog);

    } else {
      // Move to next step
      appItem.currentStage = nextStage;
      appItem.assignedTo = assignedTo;

      if (reqItem) {
        reqItem.approvalWorkflow.currentStage = nextStage;
        reqItem.approvalWorkflow.workflowStep = reqItem.approvalWorkflow.workflowStep + 1;
        await writeJsonFile(PO_REQUISITIONS_PATH, requisitions);
      }

      await writeJsonFile(PO_APPROVALS_PATH, approvals);

      const activity = {
        id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
        requisitionId,
        action: `Approved at ${currentStage}`,
        user: approvedBy || "Approver",
        dateTime
      };
      await appendJsonData(PO_ACTIVITY_LOG_PATH, activity);
    }

    await updatePODashboardMetrics();

    res.json({ success: true, approval: appItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. POST /api/purchase-orders/reject
app.post('/api/purchase-orders/reject', async (req, res) => {
  try {
    const { requisitionId, remarks, rejectedBy, actionType } = req.body;
    const mode = actionType === 'Send Back' ? 'Sent Back' : 'Rejected';

    const approvals = await readJsonFile(PO_APPROVALS_PATH);
    const appItem = approvals.find(a => a.requisitionId === requisitionId && a.status === 'Pending');

    if (!appItem) return res.status(404).json({ error: 'Pending approval item not found' });

    const dateTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    appItem.status = mode;
    appItem.remarks = remarks || "";
    appItem.history.push({
      action: mode,
      by: rejectedBy || "Approver",
      dateTime,
      remarks: remarks || ""
    });

    await writeJsonFile(PO_APPROVALS_PATH, approvals);

    const requisitions = await readJsonFile(PO_REQUISITIONS_PATH);
    const reqItem = requisitions.find(r => r.requisitionId === requisitionId);
    if (reqItem) {
      reqItem.status = mode;
      reqItem.approvalWorkflow.approvalStatus = mode;
      reqItem.approvalWorkflow.lastRemarks = remarks || "";
      await writeJsonFile(PO_REQUISITIONS_PATH, requisitions);
    }

    const activity = {
      id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
      requisitionId,
      action: `Requisition ${mode}`,
      user: rejectedBy || "Approver",
      dateTime
    };
    await appendJsonData(PO_ACTIVITY_LOG_PATH, activity);

    const auditLog = {
      id: `AUD-PO-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      requisitionId,
      action: `Requisition ${mode}`,
      performedBy: rejectedBy || "Approver",
      details: `Requisition ${requisitionId} was ${mode.toLowerCase()} by ${rejectedBy}. Remarks: ${remarks || ""}`
    };
    await appendJsonData(PO_AUDIT_LOG_PATH, auditLog);

    await updatePODashboardMetrics();

    res.json({ success: true, approval: appItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. POST /api/purchase-orders/upload
app.post('/api/purchase-orders/upload', poUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const { linkedRecordId, documentCategory, uploadedBy } = req.body;
    let relativePath = `/uploads/purchase-orders/temp/${req.file.filename}`;
    if (documentCategory === 'Technical Specification' || documentCategory === 'Technical Document') {
      relativePath = `/uploads/purchase-orders/specifications/${req.file.filename}`;
    } else if (documentCategory === 'RFQ Document') {
      relativePath = `/uploads/purchase-orders/rfq-documents/${req.file.filename}`;
    } else if (documentCategory === 'Vendor Quote') {
      relativePath = `/uploads/purchase-orders/vendor-quotes/${req.file.filename}`;
    } else if (documentCategory === 'Linked Contract') {
      relativePath = `/uploads/purchase-orders/contracts/${req.file.filename}`;
    } else if (documentCategory === 'Invoice') {
      relativePath = `/uploads/purchase-orders/invoices/${req.file.filename}`;
    } else if (documentCategory === 'GRN File') {
      relativePath = `/uploads/purchase-orders/grn/${req.file.filename}`;
    }

    const fileMeta = {
      fileId: `FILE-PO-${Math.floor(1000 + Math.random() * 9000)}`,
      linkedModule: "Purchase Orders",
      linkedRecordId: linkedRecordId || "",
      fileName: req.file.originalname,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      documentCategory: documentCategory || "Supporting Document",
      storagePath: relativePath,
      filePath: relativePath,
      uploadedBy: uploadedBy || "Saurabh Anand",
      uploadedOn: new Date().toISOString().split('T')[0],
      size: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileSize: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`,
      version: "v1.0"
    };

    await appendJsonData(PO_UPLOADED_FILES_PATH, fileMeta);

    res.status(201).json({ success: true, file: fileMeta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 11. GET /api/purchase-orders/files/:id
app.get('/api/purchase-orders/files/:id', async (req, res) => {
  try {
    const files = await readJsonFile(PO_UPLOADED_FILES_PATH);
    const filtered = files.filter(f => f.linkedRecordId === req.params.id);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 12. GET /api/rfq-vendors
app.get('/api/rfq-vendors', async (req, res) => {
  try {
    const vendors = await readJsonFile(PO_RFQ_VENDORS_PATH);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 13. POST /api/grn/create
app.post('/api/grn/create', async (req, res) => {
  try {
    const grns = await readJsonFile(PO_GOODS_RECEIPT_PATH);
    const { poId, receivedQuantity, acceptedQuantity, rejectedQuantity, deliveryCondition, inspectionRemarks, inspectedBy } = req.body;

    const grnId = `GRN-PO-${grns.length + 1003}`;

    const newGRN = {
      grnId,
      poId,
      receivedDate: new Date().toISOString().split('T')[0],
      receivedQuantity: parseInt(receivedQuantity) || 1,
      acceptedQuantity: parseInt(acceptedQuantity) || 1,
      rejectedQuantity: parseInt(rejectedQuantity) || 0,
      deliveryCondition: deliveryCondition || "Good",
      inspectionRemarks: inspectionRemarks || "All units inspected.",
      grnStatus: parseInt(rejectedQuantity) > 0 ? "Partially Accepted" : "Fully Accepted",
      inspectedBy: inspectedBy || "Saurabh Anand",
      createdDate: new Date().toISOString().split('T')[0]
    };

    grns.unshift(newGRN);
    await writeJsonFile(PO_GOODS_RECEIPT_PATH, grns);

    // Update PO delivery status
    const pos = await readJsonFile(PO_PURCHASE_ORDERS_PATH);
    const poIndex = pos.findIndex(p => p.poId === poId);
    if (poIndex !== -1) {
      pos[poIndex].deliveryStatus = newGRN.grnStatus === "Fully Accepted" ? "Received" : "Partial";
      pos[poIndex].goodsReceiptStatus = newGRN.grnStatus === "Fully Accepted" ? "Received" : "Partial";
      await writeJsonFile(PO_PURCHASE_ORDERS_PATH, pos);
    }

    const activity = {
      id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
      poId,
      action: "GRN Created",
      user: inspectedBy || "Saurabh Anand",
      dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    await appendJsonData(PO_ACTIVITY_LOG_PATH, activity);

    const auditLog = {
      id: `AUD-PO-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      poId,
      action: "Goods Receipt Note Created",
      performedBy: inspectedBy || "Saurabh Anand",
      details: `Goods Receipt Note ${grnId} created for PO ${poId} with ${acceptedQuantity} items accepted and ${rejectedQuantity} items rejected.`
    };
    await appendJsonData(PO_AUDIT_LOG_PATH, auditLog);

    await updatePODashboardMetrics();

    res.status(201).json({ success: true, grn: newGRN });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 14. GET /api/grn/list
app.get('/api/grn/list', async (req, res) => {
  try {
    const grns = await readJsonFile(PO_GOODS_RECEIPT_PATH);
    res.json(grns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 15. POST /api/three-way-match/process
app.post('/api/three-way-match/process', async (req, res) => {
  try {
    const matches = await readJsonFile(PO_THREE_WAY_MATCH_PATH);
    const { poId, invoiceId, grnId, invoiceAmount, invoiceQuantity } = req.body;

    const pos = await readJsonFile(PO_PURCHASE_ORDERS_PATH);
    const po = pos.find(p => p.poId === poId);
    if (!po) return res.status(404).json({ error: 'PO not found' });

    const grns = await readJsonFile(PO_GOODS_RECEIPT_PATH);
    const grn = grns.find(g => g.grnId === grnId);

    const poAmount = po.poValue;
    const parsedInvoiceAmt = parseFloat(invoiceAmount) || poAmount;
    const parsedInvoiceQty = parseInt(invoiceQuantity) || 1;
    const grnQty = grn ? grn.acceptedQuantity : parsedInvoiceQty;

    const amountMatched = Math.abs(poAmount - parsedInvoiceAmt) < 0.01;
    const quantityMatched = grnQty === parsedInvoiceQty;

    const isMatch = amountMatched && quantityMatched;
    const matchStatus = isMatch ? "Matched" : "Partial Match";

    const matchId = `3WM-2026-00${matches.length + 1}`;
    const newMatch = {
      matchId,
      poId,
      invoiceId: invoiceId || `INV-2026-00${Math.floor(100 + Math.random() * 900)}`,
      grnId: grnId || (grn ? grn.grnId : ""),
      poAmount,
      invoiceAmount: parsedInvoiceAmt,
      grnQuantity: grnQty,
      invoiceQuantity: parsedInvoiceQty,
      amountMatched,
      quantityMatched,
      matchStatus,
      processedDate: new Date().toISOString().split('T')[0],
      remarks: isMatch ? "Full 3-way match confirmed. Cleared for payment." : "Mismatch detected. Requires approval.",
      ...(isMatch ? {} : { mismatchReason: "Invoice amount or quantity does not match PO and GRN values", approvalRequired: true })
    };

    matches.unshift(newMatch);
    await writeJsonFile(PO_THREE_WAY_MATCH_PATH, matches);

    // Update PO Match status
    const poIndex = pos.findIndex(p => p.poId === poId);
    if (poIndex !== -1) {
      pos[poIndex].invoiceMatchStatus = isMatch ? "Matched" : "Mismatch";
      if (isMatch) pos[poIndex].status = "Closed";
      await writeJsonFile(PO_PURCHASE_ORDERS_PATH, pos);
    }

    const activity = {
      id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
      poId,
      action: "3-Way Match Executed",
      user: "Match Engine",
      dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    await appendJsonData(PO_ACTIVITY_LOG_PATH, activity);

    const auditLog = {
      id: `AUD-PO-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      poId,
      action: "3-Way Match Verification",
      performedBy: "Match Engine",
      details: `3-Way Match verification executed. Result: ${matchStatus}. Remarks: ${newMatch.remarks}`
    };
    await appendJsonData(PO_AUDIT_LOG_PATH, auditLog);

    await updatePODashboardMetrics();

    res.status(201).json({ success: true, match: newMatch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 16. GET /api/three-way-match/list
app.get('/api/three-way-match/list', async (req, res) => {
  try {
    const matches = await readJsonFile(PO_THREE_WAY_MATCH_PATH);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================================
// AUTHENTICATION & MFA (2FA) MODULE APIs
// ========================================================

const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
};

const getBrowserInfo = (req) => {
  const ua = req.headers['user-agent'] || '';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Browser';
};

// 1. POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await readJsonFile(AUTH_USERS_PATH);
    const user = users.find(u => u.username === username);

    const ipAddress = getClientIp(req);
    const browser = getBrowserInfo(req);
    const timeStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    if (!user || user.password !== password) {
      const failedAudit = {
        auditId: `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
        username: username || 'Unknown',
        loginTime: timeStr,
        twoFactorCompleted: false,
        loginStatus: "FAILED",
        ipAddress,
        browser
      };
      await appendJsonData(AUTH_AUDIT_PATH, failedAudit);
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    if (user.status !== "Active") {
      return res.status(403).json({ success: false, message: 'Your account is disabled' });
    }

    // Success Step 1 - Redirect to 2FA Page
    res.json({
      success: true,
      requires2FA: true,
      redirect: "/auth/2fa",
      user: {
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. POST /api/auth/send-otp
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { username } = req.body;
    const users = await readJsonFile(AUTH_USERS_PATH);
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otps = await readJsonFile(AUTH_OTP_STORE_PATH);
    let otpEntry = otps.find(o => o.username === username);

    if (otpEntry) {
      otpEntry.otp = user.defaultOtp || "123456";
      otpEntry.status = "ACTIVE";
      otpEntry.expiresInSeconds = 300;
      await writeJsonFile(AUTH_OTP_STORE_PATH, otps);
    } else {
      otpEntry = {
        otpId: `OTP-${Math.floor(1000 + Math.random() * 9000)}`,
        username: username,
        otp: user.defaultOtp || "123456",
        status: "ACTIVE",
        expiresInSeconds: 300
      };
      await appendJsonData(AUTH_OTP_STORE_PATH, otpEntry);
    }

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { username, otp } = req.body;
    const users = await readJsonFile(AUTH_USERS_PATH);
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otps = await readJsonFile(AUTH_OTP_STORE_PATH);
    const otpEntry = otps.find(o => o.username === username && o.otp === otp && o.status === 'ACTIVE');

    const ipAddress = getClientIp(req);
    const browser = getBrowserInfo(req);
    const timeStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    if (!otpEntry) {
      const failedAudit = {
        auditId: `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
        username,
        loginTime: timeStr,
        twoFactorCompleted: false,
        loginStatus: "FAILED",
        ipAddress,
        browser
      };
      await appendJsonData(AUTH_AUDIT_PATH, failedAudit);
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    // Mark OTP as USED
    otpEntry.status = "USED";
    await writeJsonFile(AUTH_OTP_STORE_PATH, otps);

    // Create session in sessions.json
    const token = `JWT-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
    const sessionId = `SESSION-${Math.floor(1000 + Math.random() * 9000)}`;

    const newSession = {
      sessionId,
      userId: user.userId,
      username: user.username,
      role: user.role,
      loginTime: timeStr,
      twoFactorVerified: true,
      status: "ACTIVE",
      token,
      lastActivity: Date.now()
    };
    await appendJsonData(AUTH_SESSIONS_PATH, newSession);

    // Create Success Audit Log
    const successAudit = {
      auditId: `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
      username: user.username,
      loginTime: timeStr,
      twoFactorCompleted: true,
      loginStatus: "SUCCESS",
      ipAddress,
      browser
    };
    await appendJsonData(AUTH_AUDIT_PATH, successAudit);

    // Update user lastLogin
    user.lastLogin = timeStr;
    await writeJsonFile(AUTH_USERS_PATH, users);

    res.json({
      success: true,
      authenticated: true,
      redirect: user.dashboardRoute || "/dashboard",
      token,
      role: user.role,
      user: {
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        profileImage: user.profileImage,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. POST /api/auth/logout
app.post('/api/auth/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(400).json({ error: 'Authorization token required' });
    const token = authHeader.replace('Bearer ', '');

    const sessions = await readJsonFile(AUTH_SESSIONS_PATH);
    const session = sessions.find(s => s.token === token && s.status === 'ACTIVE');

    if (session) {
      session.status = 'INACTIVE';
      await writeJsonFile(AUTH_SESSIONS_PATH, sessions);
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. GET /api/auth/session
app.get('/api/auth/session', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No authorization header' });
    const token = authHeader.replace('Bearer ', '');

    const sessions = await readJsonFile(AUTH_SESSIONS_PATH);
    const session = sessions.find(s => s.token === token && s.status === 'ACTIVE');

    if (!session) {
      return res.status(401).json({ error: 'Invalid or inactive session' });
    }

    const TIMEOUT_MS = 30 * 60 * 1000;
    const now = Date.now();
    if (now - session.lastActivity > TIMEOUT_MS) {
      session.status = 'INACTIVE';
      await writeJsonFile(AUTH_SESSIONS_PATH, sessions);
      return res.status(401).json({ error: 'Session expired' });
    }

    session.lastActivity = now;
    await writeJsonFile(AUTH_SESSIONS_PATH, sessions);

    const users = await readJsonFile(AUTH_USERS_PATH);
    const user = users.find(u => u.username === session.username);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      success: true,
      user: {
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        profileImage: user.profileImage,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. GET /api/auth/users
app.get('/api/auth/users', async (req, res) => {
  try {
    const users = await readJsonFile(AUTH_USERS_PATH);
    const safeUsers = users.map(({ password, ...rest }) => rest);
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. GET /api/auth/permissions
app.get('/api/auth/permissions', async (req, res) => {
  try {
    const permissions = await readJsonFile(AUTH_PERMISSIONS_PATH);
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Global error handler for uncaught multer/routing errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`VMS Backend server running on port ${PORT}`);
});
