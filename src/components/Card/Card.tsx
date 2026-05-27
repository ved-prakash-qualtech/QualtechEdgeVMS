import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  padding = 'md', 
  className, 
  ...props 
}) => {
  return (
    <div 
      className={clsx(styles.card, styles[`padding-${padding}`], className)} 
      {...props}
    >
      {children}
    </div>
  );
};
