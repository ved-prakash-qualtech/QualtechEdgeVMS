import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import styles from './Layout.module.css';

export const Layout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContainer}>
        <Topbar />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
