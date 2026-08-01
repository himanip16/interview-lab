// src/features/deep-dive/components/Table.tsx

'use client';

import styles from './Table.module.css';

interface BadgeConfig {
  text: string;
  color: string;
}

interface TableCell {
  content: string;
  isBold?: boolean;
  isWhenColumn?: boolean;
}

interface TableRow {
  badge?: BadgeConfig;
  cells: TableCell[];
}

interface TableProps {
  headers: string[];
  rows: TableRow[];
  badgeColumn?: number;
  whenColumn?: number;
  className?: string;
}

export function Table({ headers, rows, badgeColumn = 0, whenColumn, className = '' }: TableProps) {
  return (
    <div className={`${styles.tableWrapper} ${className}`}>
      <table className={styles.ctable}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.cells.map((cell, cellIndex) => {
                const isBadgeColumn = cellIndex === badgeColumn && row.badge;
                const isWhenColumn = cellIndex === whenColumn;

                return (
                  <td key={cellIndex} className={isWhenColumn ? 'when' : ''}>
                    {isBadgeColumn && row.badge ? (
                      <span
                        className="level-badge"
                        style={{
                          background: `${row.badge.color}20`,
                          color: row.badge.color,
                        }}
                      >
                        {row.badge.text}
                      </span>
                    ) : cell.isBold ? (
                      <b>{cell.content}</b>
                    ) : (
                      cell.content
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
