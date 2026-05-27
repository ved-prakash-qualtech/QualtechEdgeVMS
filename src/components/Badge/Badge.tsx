import React from 'react';
import clsx from 'clsx';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  icon,
  className, 
  ...props 
}) => {
  return (
    <span 
      className={clsx(styles.badge, styles[variant], className)} 
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
};
