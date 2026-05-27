import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ChevronRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields State
  const [domain, setDomain] = useState('qualtech');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'VENDOR') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) {
      setError('Please enter your organization domain');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all credentials');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await login(username.trim(), password);
      if (result.success && result.requires2FA) {
        // Store temp username context for 2FA verification route
        sessionStorage.setItem('vms_temp_username', username.trim());
        navigate('/auth/2fa');
      } else {
        setError(result.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left Sidebar - Branding */}
      <div className={styles.brandingPanel}>
        <div className={styles.brandHeader}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.logoText}>
            <h1>Qualtech Edge VMS</h1>
            <p>AI-Powered Vendor Management System</p>
          </div>
        </div>

        <div className={styles.brandHero}>
          <h2>One Platform for <span className={styles.highlight}>Every Vendor.</span><br/>Every Risk. Every Relationship.</h2>
          <p>AI-powered vendor lifecycle management platform for Banks & NBFCs.</p>
          
          <ul className={styles.featureList}>
            <li><CheckCircle2 size={18} /> RBI Compliant & Audit Ready</li>
            <li><CheckCircle2 size={18} /> Multi-Tenant SaaS Platform</li>
            <li><CheckCircle2 size={18} /> AI Powered Risk Monitoring</li>
            <li><CheckCircle2 size={18} /> Maker-Checker Workflows</li>
            <li><CheckCircle2 size={18} /> Secure. Scalable. Reliable.</li>
          </ul>
        </div>

        <div className={styles.complianceBadges}>
          <div className={styles.badge}>
            <ShieldCheck size={24} />
            <span>RBI<br/>Compliant</span>
          </div>
          <div className={styles.badge}>
            <Lock size={24} />
            <span>ISO<br/>27001</span>
          </div>
          <div className={styles.badge}>
            <ShieldCheck size={24} />
            <span>SOC 2<br/>Type II</span>
          </div>
        </div>

        <div className={styles.copyright}>
          © 2026 Qualtech Edge. All rights reserved.
        </div>
      </div>

      {/* Right Sidebar - Forms */}
      <div className={styles.formPanel}>
        <div className={styles.formTopActions}>
          <select className={styles.languageSelect} aria-label="Select Language">
            <option>English</option>
          </select>
          <Button variant="ghost" size="sm">Help & Support</Button>
        </div>

        <div className={styles.formContent}>
          {step === 1 && (
            <form onSubmit={handleDomainSubmit} className={styles.stepForm}>
              <h2>Select Your Organization</h2>
              <p>Enter your organization domain or code to continue to VMS.</p>
              
              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', backgroundColor: '#fee2e2', padding: '12px', borderRadius: 'var(--border-radius-md)', marginBottom: '16px', fontSize: '0.875rem' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className={styles.domainInput}>
                <Input 
                  placeholder="Example: hdfc, icici" 
                  value={domain} 
                  onChange={(e) => setDomain(e.target.value)} 
                  fullWidth
                />
                <span className={styles.domainSuffix}>.vms.qualtechedge.com</span>
              </div>
              
              <Button fullWidth type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Continue'} <ChevronRight size={18} />
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleCredentialsSubmit} className={styles.stepForm}>
              <h2>Welcome Back!</h2>
              <p>Sign in to continue to your account</p>
              
              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', backgroundColor: '#fee2e2', padding: '12px', borderRadius: 'var(--border-radius-md)', marginBottom: '16px', fontSize: '0.875rem' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className={styles.inputs}>
                <Input 
                  label="Email / Username" 
                  placeholder="Enter your username" 
                  leftIcon={<Mail size={18} />} 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <Input 
                  label="Password" 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Enter your password" 
                  leftIcon={<Lock size={18} />} 
                  rightIcon={
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--color-text-secondary)' }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.formMeta}>
                <label className={styles.checkbox}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  /> Remember Me
                </label>
                <a href="#" className={styles.forgotPass}>Forgot Password?</a>
              </div>
              
              <Button fullWidth type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <div className={styles.divider}>or continue with</div>
              
              <div className={styles.ssoButtons}>
                <Button variant="outline" fullWidth type="button">SSO / SAML Login</Button>
              </div>
            </form>
          )}
        </div>

        <div className={styles.formFooter}>
          <div className={styles.securityBanner}>
            <ShieldCheck size={18} color="#1d4ed8" />
            <div>
              <strong>Your data is protected with enterprise-grade security</strong>
              <p>MFA enabled • 256-bit encryption • Secure & Compliant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple visual helper component for checkmark list
const CheckCircle2: React.FC<{ size: number }> = ({ size }) => (
  <CheckCircle size={size} />
);
const CheckCircle: React.FC<{ size: number }> = ({ size }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', color: '#60a5fa' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  </span>
);
