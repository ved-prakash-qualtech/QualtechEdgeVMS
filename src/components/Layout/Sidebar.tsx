import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShieldCheck, 
  FileSignature,
  ShoppingCart,
  Receipt,
  CreditCard,
  BarChart,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Globe,
  Package
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { 
    name: 'Vendors', 
    path: '/vendors', 
    icon: Users,
    subItems: [
      { name: 'Vendor List', path: '/vendors' },
      { name: 'Add Vendor', path: '/vendors/add' },
      { name: 'Approvals', path: '/vendors/approvals' },
    ]
  },
  { 
    name: 'Documents', 
    path: '/documents', 
    icon: FileText,
    subItems: [
      { name: 'Document List', path: '/documents' },
      { name: 'Upload Document', path: '/documents/upload' },
      { name: 'Expiry Tracker', path: '/documents/expiry' },
      { name: 'Verification Queue', path: '/documents/approvals' },
    ]
  },
  { 
    name: 'Due Diligence & KYC', 
    path: '/kyc/dashboard', 
    icon: ShieldCheck,
    subItems: [
      { name: 'KYC Dashboard',       path: '/kyc/dashboard' },
      { name: 'AI Screening & Risk', path: '/kyc/screening' },
      { name: 'Reviews & Approvals', path: '/kyc/reviews'   },
    ]
  },
  {
    name: 'Item & Service Catalogue',
    path: '/catalogue',
    icon: Package,
    subItems: [
      { name: 'Catalogue Dashboard', path: '/catalogue/dashboard' },
      { name: 'Item Master', path: '/catalogue/items' },
      { name: 'Service Master', path: '/catalogue/services' },
      { name: 'Vendor Mapping', path: '/catalogue/vendor-mapping' },
      { name: 'Category Management', path: '/catalogue/categories' },
      { name: 'HSN/SAC Mapping', path: '/catalogue/hsn-sac' },
      { name: 'UOM Management', path: '/catalogue/uom' },
      { name: 'Rate & Price Reference', path: '/catalogue/rates' },
      { name: 'Quality Standards', path: '/catalogue/quality' },
      { name: 'Approval Workflow', path: '/catalogue/approvals' }
    ]
  },

  { 
    name: 'Contracts & SLAs', 
    path: '/contracts', 
    icon: FileSignature,
    subItems: [
      { name: 'Dashboard', path: '/contracts/dashboard' },
      { name: 'Create Contract', path: '/contracts/create' },
      { name: 'Clause Library', path: '/contracts/clauses' },
      { name: 'Renewals', path: '/contracts/renewals' },
      { name: 'Approvals', path: '/contracts/approvals' },
    ]
  },
  { 
    name: 'Purchase Orders', 
    path: '/purchase-orders', 
    icon: ShoppingCart,
    subItems: [
      { name: 'PO Dashboard', path: '/purchase-orders/dashboard' },
      { name: 'Create Requisition', path: '/purchase-orders/create' },
      { name: 'Approvals', path: '/purchase-orders/approvals' },
    ]
  },
  { 
    name: 'Invoices', 
    path: '/invoices', 
    icon: Receipt,
    subItems: [
      { name: 'Invoice Dashboard', path: '/invoices/dashboard' },
      { name: 'Upload Invoice', path: '/invoices/upload' },
      { name: 'Goods Receipt (GRN)', path: '/invoices/grn' },
      { name: '3-Way Match Engine', path: '/invoices/match' },
      { name: 'Approvals', path: '/invoices/approvals' },
    ]
  },
  { 
    name: 'Payments', 
    path: '/payments', 
    icon: CreditCard,
    subItems: [
      { name: 'Payments Dashboard', path: '/payments/dashboard' },
      { name: 'Payment Processing', path: '/payments/processing' },
      { name: 'Approvals', path: '/payments/approvals' },
    ]
  },
  { 
    name: 'Reports & MIS', 
    path: '/reports', 
    icon: BarChart,
    subItems: [
      { name: 'MIS Dashboard',           path: '/reports/dashboard'     },
      { name: 'Performance & Analytics',  path: '/reports/performance'   },
      { name: 'AI Insights',             path: '/reports/insights'      },
    ]
  },
  { 
    name: 'Vendor Portal', 
    path: '/vendor-portal', 
    icon: Globe,
    subItems: [
      { name: 'Portal Dashboard', path: '/vendor-portal' }
    ]
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: Settings,
    subItems: [
      { name: 'General Settings',    path: '/settings/general' },
      { name: 'Users & Roles',       path: '/settings/users' },
      { name: 'System Preferences',  path: '/settings/preferences' },
    ]
  },
];

const VENDOR_NAV_ITEMS = [
  { 
    name: 'Vendor Portal', 
    path: '/vendor/dashboard', 
    icon: Globe,
    subItems: [
      { name: 'Vendor Dashboard', path: '/vendor/dashboard?tab=overview' },
      { name: 'My Documents', path: '/vendor/dashboard?tab=documents' },
      { name: 'KYC', path: '/vendor/dashboard?tab=kyc' },
      { name: 'Contracts', path: '/vendor/dashboard?tab=contracts' },
      { name: 'Invoices', path: '/vendor/dashboard?tab=invoices' },
      { name: 'Payments', path: '/vendor/dashboard?tab=invoices' },
      { name: 'Profile', path: '/vendor/dashboard?tab=profile' },
      { name: 'Support', path: '/vendor/dashboard?tab=queries' }
    ]
  }
];

export const Sidebar: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();

  const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({
    'Vendors': false,
    'Documents': false,
    'Due Diligence & KYC': false,
    'Item & Service Catalogue': false,
    'Contracts & SLAs': false,
    'Purchase Orders': false,
    'Invoices': false,
    'Payments': false,
    'Reports & MIS': false,
    'Vendor Portal': true,
    'Settings': false
  });

  const toggleMenu = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogoutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    navigate('/login');
  };

  // 1. Get raw items list based on role
  const rawItems = user?.role === 'VENDOR' ? VENDOR_NAV_ITEMS : NAV_ITEMS;

  // 2. Filter root level items
  const filteredNavItems = rawItems.filter(item => {
    if (['ADMIN', 'PROCUREMENT', 'COMPLIANCE', 'FINANCE'].includes(user?.role || '')) {
      if (item.name === 'Vendor Portal') {
        return false;
      }
    }
    return hasPermission(item.name);
  });

  const getFilteredSubItems = (item: typeof NAV_ITEMS[0]) => {
    if (!item.subItems) return undefined;
    
    return item.subItems;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className={styles.logoText}>
          <h2>Qualtech Edge VMS</h2>
          <p>AI-Powered Vendor Management System</p>
        </div>
      </div>
      
      <nav className={styles.nav}>
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedMenus[item.name];
          const displaySubItems = getFilteredSubItems(item);

          if (displaySubItems && displaySubItems.length > 0) {
            return (
              <div key={item.name} className={styles.navGroup}>
                <div 
                  className={styles.navItem} 
                  onClick={(e) => toggleMenu(item.name, e)}
                  style={{ cursor: 'pointer' }}
                >
                  <Icon size={20} />
                  <span className={styles.navLabel}>{item.name}</span>
                  {isExpanded ? <ChevronUp size={16} className={styles.chevron} /> : <ChevronDown size={16} className={styles.chevron} />}
                </div>
                
                {isExpanded && (
                  <div className={styles.subMenu}>
                    {displaySubItems.map(subItem => (
                      <NavLink
                        key={subItem.name}
                        to={subItem.path}
                        end={subItem.path === '/vendors' || subItem.path === '/documents' || subItem.path === '/kyc' || subItem.path === '/catalogue/dashboard' || subItem.path === '/contracts/dashboard' || subItem.path === '/purchase-orders/dashboard' || subItem.path === '/invoices/dashboard' || subItem.path === '/payments/dashboard' || subItem.path === '/reports/dashboard' || subItem.path === '/vendor-portal' || subItem.path === '/vendor/dashboard' || subItem.path === '/settings/dashboard'}
                        className={({ isActive }) => clsx(styles.subNavItem, isActive && styles.activeSub)}
                      >
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => clsx(styles.navItem, isActive && styles.active)}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className={styles.footer}>
        <button onClick={handleLogoutClick} className={styles.logoutBtn} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
          <LogOut size={20} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Logout</span>
        </button>
      </div>
    </aside>
  );
};
