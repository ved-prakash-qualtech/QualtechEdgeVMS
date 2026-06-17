import React from 'react';
import styles from './CatalogueHeader.module.css';

interface CatalogueHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const CatalogueHeader: React.FC<CatalogueHeaderProps> = ({ 
  title = "ITEM & SERVICE CATALOGUE", 
  subtitle = "End-to-End Procurement Catalogue Lifecycle Sourcing & Sizing Dashboard",
  actions
}) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.topRow}>
        <div className={styles.titleContainer}>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className={styles.headerActions}>
          {actions}
        </div>
      </div>
    </div>
  );
};
