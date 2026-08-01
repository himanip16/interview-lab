// src/features/skill-tree/utils/routing.ts

/**
 * Contextual routing utility for skill tree content
 * Maps content types to their respective application routes
 */

export type ContentType = 'DEEP_DIVE' | 'TRANSCRIPT' | 'BUG_HUNT' | 'WHITEBOARD';

export interface RoutingConfig {
  route: (slug: string) => string;
  label: string;
}

/**
 * Routing configuration for each content type
 */
const ROUTING_CONFIG: Record<ContentType, RoutingConfig> = {
  DEEP_DIVE: {
    route: (slug: string) => `/deep-dive/${slug}`,
    label: 'Deep Dive',
  },
  TRANSCRIPT: {
    route: (slug: string) => `/learn/transcript/${slug}`,
    label: 'Transcript',
  },
  BUG_HUNT: {
    route: (slug: string) => `/bug-hunting/${slug}`,
    label: 'Bug Hunt',
  },
  WHITEBOARD: {
    route: (slug: string) => `/whiteboard/${slug}`,
    label: 'Whiteboard',
  },
};

/**
 * Get the route for a specific content type and slug
 */
export function getContentRoute(contentType: ContentType, slug: string): string {
  const config = ROUTING_CONFIG[contentType];
  if (!config) {
    throw new Error(`Unknown content type: ${contentType}`);
  }
  return config.route(slug);
}

/**
 * Get the display label for a content type
 */
export function getContentTypeLabel(contentType: ContentType): string {
  const config = ROUTING_CONFIG[contentType];
  if (!config) {
    throw new Error(`Unknown content type: ${contentType}`);
  }
  return config.label;
}

/**
 * Check if a content type is valid
 */
export function isValidContentType(value: string): value is ContentType {
  return Object.keys(ROUTING_CONFIG).includes(value);
}
