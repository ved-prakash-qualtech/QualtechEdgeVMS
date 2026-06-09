import axios from 'axios';

export interface Organization {
  companyName: string;
  cin: string;
  primaryEmail: string;
  contactNumber: string;
  registeredAddress: string;
  website?: string;
  gstin?: string;
  panNumber?: string;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  currency: string;
  timezone: string;
  fiscalYear: string;
  language: string;
  dateFormat: string;
  businessUnits: string[];
  lastUpdated?: string;
  updatedBy?: string;
}

export interface SettingsUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  businessUnit: string;
  status: 'Active' | 'Inactive';
  phone?: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface Role {
  roleId: string;
  name: string;
  description: string;
  status: string;
  userCount: number;
}

export interface PermissionRow {
  module: string;
  superAdmin: boolean;
  procurement: boolean;
  finance: boolean;
  compliance: boolean;
  vendor: boolean;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: string;
  uptime: string;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  inAppNotifications: boolean;
  vendorOnboarding: boolean;
  documentExpiry: boolean;
  invoiceApproval: boolean;
  paymentRelease: boolean;
  kycAlerts: boolean;
  contractRenewal: boolean;
  poApproval: boolean;
  systemHealth: boolean;
  digestFrequency: string;
  escalationEmails: string[];
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  sessionTimeout: number;
  passwordExpiryDays: number;
  ipWhitelistEnabled: boolean;
  ipWhitelist: string[];
  auditLogsEnabled: boolean;
  dataEncryption: string;
  ssoEnabled: boolean;
  loginAttempts: number;
  dataRetentionDays: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  role: string;
  timestamp: string;
  severity: string;
  status: string;
}

export interface SettingsData {
  organization: Organization;
  users: SettingsUser[];
  roles: Role[];
  permissionsMatrix: PermissionRow[];
  notifications: NotificationSettings;
  integrations: Integration[];
  security: SecuritySettings;
  auditLogs: AuditLogEntry[];
}

// Fetch all settings
export async function getSettings(): Promise<SettingsData> {
  const res = await axios.get('/api/settings');
  return res.data;
}

// Save any settings section (partial update)
export async function saveSettings(updates: Partial<SettingsData> & { updatedBy?: string }): Promise<SettingsData> {
  const res = await axios.put('/api/settings', updates);
  return res.data.settings;
}

// Add a new user
export async function addUser(userData: Omit<SettingsUser, 'userId' | 'createdAt'>): Promise<SettingsUser> {
  const res = await axios.post('/api/settings/users', userData);
  return res.data.user;
}

// Update a user
export async function updateUser(userId: string, userData: Partial<SettingsUser>): Promise<SettingsUser> {
  const res = await axios.put(`/api/settings/users/${userId}`, userData);
  return res.data.user;
}

// Delete a user
export async function deleteUser(userId: string): Promise<void> {
  await axios.delete(`/api/settings/users/${userId}`);
}

// Upload logo or settings file
export async function uploadSettingsFile(file: File, field: string = 'logoUrl'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('field', field);
  const res = await axios.post('/api/settings/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data.fileUrl;
}
