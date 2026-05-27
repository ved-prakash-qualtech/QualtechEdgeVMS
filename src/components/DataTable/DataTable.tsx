import React from 'react';
import clsx from 'clsx';
import styles from './DataTable.module.css';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  className?: string;
}

export function DataTable<T>({ data, columns, keyExtractor, className }: DataTableProps<T>) {
  return (
    <div className={clsx(styles.tableContainer, className)}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index} 
                style={{ width: col.width, textAlign: col.align || 'left' }}
                className={styles.th}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={keyExtractor(row)} className={styles.tr}>
                {columns.map((col, index) => (
                  <td 
                    key={index} 
                    style={{ textAlign: col.align || 'left' }}
                    className={styles.td}
                  >
                    {typeof col.accessor === 'function' 
                      ? col.accessor(row) 
                      : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={styles.emptyState}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
