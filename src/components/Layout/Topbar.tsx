import React from 'react';
import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Topbar.module.css';

export const Topbar: React.FC = () => {
  const { user } = useAuth();

  const formattedRole = (role: string) => {
    if (!role) return '';
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const avatarUrl = user?.fullName 
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=1D4ED8&color=fff`
    : "https://ui-avatars.com/api/?name=Saurabh+Anand&background=1D4ED8&color=fff";

  return (
    <header className={styles.topbar}>
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={18} />
        <input 
          type="text" 
          placeholder="Search vendors, documents, invoices..." 
          className={styles.searchInput}
        />
      </div>
      
      <div className={styles.actions}>
        <button className={styles.iconBtn} aria-label="Help">
          <HelpCircle size={20} />
        </button>
        
        <div className={styles.divider}></div>
        
        <button className={styles.iconBtn} aria-label="Notifications">
          <div className={styles.badge}>12</div>
          <Bell size={20} />
        </button>
        
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <img src={avatarUrl} alt="User Avatar" />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.fullName || 'Saurabh Anand'}</span>
            <span className={styles.userRole}>{user ? formattedRole(user.role) : 'Procurement Manager'}</span>
          </div>
          <ChevronDown size={16} className={styles.chevron} />
        </div>
      </div>
    </header>
  );
};
