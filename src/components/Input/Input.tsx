import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, fullWidth = true, className, ...props }, ref) => {
    return (
      <div className={clsx(styles.wrapper, fullWidth && styles.fullWidth, className)}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputContainer}>
          {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
          <input
            ref={ref}
            className={clsx(
              styles.input,
              leftIcon && styles.hasLeftIcon,
              rightIcon && styles.hasRightIcon,
              error && styles.hasError
            )}
            {...props}
          />
          {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
