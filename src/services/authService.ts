import axios from 'axios';

export interface User {
  userId: string;
  username: string;
  fullName: string;
  role: string;
  profileImage?: string;
  email?: string;
}

export interface LoginResponse {
  success: boolean;
  requires2FA?: boolean;
  redirect?: string;
  user: {
    username: string;
    role: string;
  };
}

export interface VerifyOtpResponse {
  success: boolean;
  authenticated: boolean;
  redirect: string;
  token: string;
  role: string;
  user: User;
}

export interface PermissionRule {
  module: string;
  allowedRoles: string[];
}

// Inject Authorization token to all outgoing requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 1. Credentials Verification Login API
export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  const res = await axios.post('/api/auth/login', { username, password });
  return res.data;
}

// 1.5. Demo Quick Login API
export async function demoLoginUser(username: string): Promise<VerifyOtpResponse> {
  const res = await axios.post('/api/auth/demo-login', { username });
  return res.data;
}

// 2. Send OTP API
export async function sendOtp(username: string): Promise<{ success: boolean; message: string }> {
  const res = await axios.post('/api/auth/send-otp', { username });
  return res.data;
}

// 3. Verify OTP API
export async function verifyOtp(username: string, otp: string): Promise<VerifyOtpResponse> {
  const res = await axios.post('/api/auth/verify-otp', { username, otp });
  return res.data;
}

// 4. Logout API
export async function logoutUser(): Promise<{ success: boolean; message: string }> {
  const res = await axios.post('/api/auth/logout');
  return res.data;
}

// 5. Session validation API
export async function validateSession(): Promise<{ success: boolean; user: User }> {
  const res = await axios.get('/api/auth/session');
  return res.data;
}

// 6. Fetch Users list (Admin only)
export async function fetchUsers(): Promise<Omit<User, 'password'>[]> {
  const res = await axios.get('/api/auth/users');
  return res.data;
}

// 7. Fetch Permissions mapping
export async function fetchPermissions(): Promise<PermissionRule[]> {
  const res = await axios.get('/api/auth/permissions');
  return res.data;
}

// Local helpers for immediate state (useful before server responds)
export function getLocalUser(): User | null {
  const userStr = localStorage.getItem('vms_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function getLocalToken(): string | null {
  return localStorage.getItem('vms_token');
}

export function getLocalRole(): string | null {
  return localStorage.getItem('vms_role');
}

export function getLocal2faVerified(): boolean {
  return localStorage.getItem('vms_2fa_verified') === 'true';
}

export function setLocalSession(user: User, token: string, role: string): void {
  localStorage.setItem('vms_user', JSON.stringify(user));
  localStorage.setItem('vms_token', token);
  localStorage.setItem('vms_role', role);
  localStorage.setItem('vms_2fa_verified', 'true');
}

export function clearLocalSession(): void {
  localStorage.removeItem('vms_user');
  localStorage.removeItem('vms_token');
  localStorage.removeItem('vms_role');
  localStorage.removeItem('vms_2fa_verified');
}
