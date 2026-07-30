// src/features/learning/data/nodeIds.ts

// Node ID constants for URL Shortener system
export const URL_SHORTENER_NODE_IDS = {
  CLIENT: "client",
  GATEWAY: "gateway",
  SERVICE: "service",
  DB: "db",
} as const;

// Node ID constants for Uber system
export const UBER_NODE_IDS = {
  USER_APP: "user-app",
  DRIVER_APP: "driver-app",
  API_GATEWAY: "api-gateway",
  RIDE_SERVICE: "ride-service",
  DISPATCH_SERVICE: "dispatch-service",
  LOCATION_SERVICE: "location-service",
  PRICING_SERVICE: "pricing-service",
  DATABASE: "database",
} as const;

// Type for node IDs
export type NodeId = 
  | typeof URL_SHORTENER_NODE_IDS[keyof typeof URL_SHORTENER_NODE_IDS]
  | typeof UBER_NODE_IDS[keyof typeof UBER_NODE_IDS];
