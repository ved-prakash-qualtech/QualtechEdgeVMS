import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { VendorSidebar } from './VendorSidebar';
import { VendorTopbar } from './VendorTopbar';
import { useVendorSSE } from '../../hooks/useVendorSSE';
import styles from './VendorLayout.module.css';

export const VendorLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useVendorSSE(); // Sprint 3: single SSE connection per vendor session

  return (
    <div className={styles.layout}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 199, display: 'block',
          }}
        />
      )}

      <VendorSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
      />

      <div className={styles.mainContainer}>
        <VendorTopbar onMobileMenuToggle={() => setMobileOpen(o => !o)} />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
