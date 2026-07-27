// src/features/deep-dive/components/NavigationRail.tsx

'use client';

import { ReactNode } from 'react';

export interface RailItem {
  id: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

interface NavigationRailProps {
  logo?: ReactNode;
  items: RailItem[];
  className?: string;
}

export function NavigationRail({ logo, items, className = '' }: NavigationRailProps) {
  return (
    <div className={`rail ${className}`}>
      {logo && <div className="rail-logo">{logo}</div>}
      {items.map((item) => (
        <div
          key={item.id}
          className={`rail-item ${item.active ? 'active' : ''}`}
          onClick={item.onClick}
          role={item.href ? 'link' : 'button'}
          tabIndex={0}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
}
