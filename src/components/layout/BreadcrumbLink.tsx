import React from 'react';
import Link from 'next/link';

interface BreadcrumbLinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Smart link component that renders Next.js Link for internal routes
 * and plain <a> tag for external URLs. This ensures client-side navigation
 * for internal routes while properly handling external links.
 */
export const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = ({
  href,
  children,
  className,
}) => {
  if (!href) {
    return <span className={className}>{children}</span>;
  }

  // Check if the link is external (starts with http://, https://, or //)
  const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  // Internal route - use Next.js Link for client-side navigation
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};
