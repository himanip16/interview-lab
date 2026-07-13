"use client";

import { useState } from "react";

interface ComponentDetail {
  id: string;
  name: string;
  type: "client" | "service" | "storage" | "gateway";
  roleAndDuty: string;
  extremeDeepDive: string;
  failureScenarios: string;
  designTradeoffs: string;
}

interface DiagramComponent {
  id: string;
  name: string;
  type: "client" | "service" | "storage" | "gateway";
  x: number;
  y: number;
  width: number;
  height: number;
  details: ComponentDetail;
}

const dropboxComponents: DiagramComponent[] = [
  {
    id: "client",
    name: "Dropbox Desktop App",
    type: "client",
    x: 50,
    y: 100,
    width: 180,
    height: 60,
    details: {
      id: "client",
      name: "Dropbox Desktop App",
      type: "client",
      roleAndDuty: "Client application that runs on user devices, handles file synchronization, and provides user interface for file management.",
      extremeDeepDive: "Implements file watching using OS-specific APIs (inotify on Linux, FSEvents on macOS, ReadDirectoryChangesW on Windows). Uses chunking algorithm to split large files into blocks. Maintains local SQLite database for file metadata and sync state. Implements conflict resolution using last-write-wins with version vectors.",
      failureScenarios: "Network disconnection - queues changes locally. Disk full - shows user-friendly error and pauses sync. Corrupt local cache - triggers full resync from server.",
      designTradeoffs: "Local storage vs cloud-only - chose hybrid for offline access. Real-time sync vs batch - chose near real-time with conflict resolution. Encryption at rest vs performance - chose client-side encryption with performance tradeoff."
    }
  },
  {
    id: "gateway",
    name: "API Gateway & LB",
    type: "gateway",
    x: 300,
    y: 100,
    width: 180,
    height: 60,
    details: {
      id: "gateway",
      name: "API Gateway & LB",
      type: "gateway",
      roleAndDuty: "Entry point for all API requests, handles load balancing, rate limiting, authentication, and request routing to appropriate services.",
      extremeDeepDive: "Uses NGINX/HAProxy for load balancing with round-robin and least-connection algorithms. Implements API versioning and request validation. JWT token validation at gateway level. Circuit breaker pattern to prevent cascading failures. Request/response transformation and protocol translation.",
      failureScenarios: "Gateway failure - redundant instances with health checks. DDoS attack - rate limiting and IP whitelisting. SSL termination failure - certificate auto-renewal and backup certificates.",
      designTradeoffs: "Centralized gateway vs per-service routing - chose centralized for consistency. Synchronous vs asynchronous calls - chose synchronous with timeout fallback. Stateful vs stateless - chose stateless for horizontal scaling."
    }
  },
  {
    id: "block-sync",
    name: "Block Sync Service",
    type: "service",
    x: 300,
    y: 250,
    width: 180,
    height: 60,
    details: {
      id: "block-sync",
      name: "Block Sync Service",
      type: "service",
      roleAndDuty: "Handles file block upload, download, and synchronization. Manages block deduplication and storage allocation.",
      extremeDeepDive: "Implements content-addressable storage using SHA-256 hashes for deduplication. Uses multipart upload for large files with parallel chunk uploads. Implements block-level delta sync using rolling hash (Rabin fingerprinting). Maintains block metadata in Redis for fast lookup. Uses worker queues for async processing.",
      failureScenarios: "Upload failure - automatic retry with exponential backoff. Deduplication collision - hash verification with secondary checksum. Storage quota exceeded - graceful degradation and user notification.",
      designTradeoffs: "Block size vs overhead - chose 4MB blocks as balance. Immediate vs delayed deduplication - chose immediate for storage efficiency. Strong vs eventual consistency - chose eventual for performance."
    }
  },
  {
    id: "metadata",
    name: "Metadata Service",
    type: "service",
    x: 550,
    y: 250,
    width: 180,
    height: 60,
    details: {
      id: "metadata",
      name: "Metadata Service",
      type: "service",
      roleAndDuty: "Maintains databases recording file names, file trees, share links, and version sequences. Exposes clean REST APIs for file operations.",
      extremeDeepDive: "Uses PostgreSQL with JSONB for flexible schema. Implements hierarchical file structure using materialized path pattern. Maintains file version history with time-travel queries. Implements share link system with expiration and permission management. Uses database transactions for atomic operations. Caches frequently accessed metadata in Redis.",
      failureScenarios: "Metadata inconsistency - managed by single master databases and strong transactional boundaries. Database connection pool exhaustion - connection pooling and circuit breakers. Slow queries - query optimization and read replicas.",
      designTradeoffs: "SQL vs NoSQL - chose SQL for ACID compliance. Single database vs sharding - chose single for simplicity with future sharding path. Strong vs eventual consistency - chose strong for metadata accuracy."
    }
  },
  {
    id: "s3",
    name: "Amazon S3 Storage",
    type: "storage",
    x: 300,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "s3",
      name: "Amazon S3 Storage",
      type: "storage",
      roleAndDuty: "Durable object storage for file blocks. Provides high availability, durability, and scalability for block storage.",
      extremeDeepDive: "Uses S3 Standard storage with 99.999999999% durability. Implements lifecycle policies for cost optimization (Standard → IA → Glacier). Uses server-side encryption with KMS. Implements multipart upload for parallel processing. Uses S3 Cross-Region Replication for disaster recovery. Implements S3 Versioning for block version history.",
      failureScenarios: "S3 outage - multi-AZ deployment with automatic failover. Data corruption - S3 integrity checks and automatic repair. Cost overrun - lifecycle policies and monitoring alerts.",
      designTradeoffs: "S3 vs custom storage - chose S3 for managed service benefits. Hot vs cold storage - chose tiered approach for cost optimization. Single region vs multi-region - chose multi-region for disaster recovery."
    }
  },
  {
    id: "metadata-db",
    name: "Metadata DB (SQL)",
    type: "storage",
    x: 550,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "metadata-db",
      name: "Metadata DB (SQL)",
      type: "storage",
      roleAndDuty: "Relational database storing file metadata, user information, sharing permissions, and version history.",
      extremeDeepDive: "Uses PostgreSQL 14+ with partitioning by user_id. Implements read replicas for query scaling. Uses connection pooling with PgBouncer. Implements WAL archiving for point-in-time recovery. Uses database triggers for audit logging. Implements row-level security for multi-tenancy.",
      failureScenarios: "Database corruption - WAL replay from backups. Connection failure - automatic reconnection with retry logic. Performance degradation - query optimization and index tuning.",
      designTradeoffs: "PostgreSQL vs MySQL - chose PostgreSQL for advanced features. Single instance vs cluster - chose primary-replica for HA. Vertical vs horizontal scaling - chose horizontal with read replicas."
    }
  }
];

const connections = [
  { from: "client", to: "gateway", label: "API Calls" },
  { from: "gateway", to: "block-sync", label: "Stream Block" },
  { from: "gateway", to: "metadata", label: "Update Metadata" },
  { from: "block-sync", to: "s3", label: "Store/Retrieve" },
  { from: "metadata", to: "metadata-db", label: "Query/Update" }
];

const typeColors = {
  client: { bg: "#1a1a2e", border: "#4a4a6a", dot: "#000000" },
  service: { bg: "#16213e", border: "#0f3460", dot: "#0066cc" },
  storage: { bg: "#1a1a2e", border: "#e94560", dot: "#cc0000" },
  gateway: { bg: "#1f4068", border: "#162447", dot: "#0099cc" }
};

export default function SystemDiagram() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentDetail | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  const handleComponentClick = (component: DiagramComponent) => {
    setSelectedComponent(component.details);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Diagram Area */}
      <div className="flex-1 relative overflow-auto">
        <svg className="w-full h-full" style={{ minWidth: "800px", minHeight: "600px" }}>
          {/* Connections */}
          {connections.map((conn, index) => {
            const fromComp = dropboxComponents.find(c => c.id === conn.from);
            const toComp = dropboxComponents.find(c => c.id === conn.to);
            if (!fromComp || !toComp) return null;

            const fromX = fromComp.x + fromComp.width / 2;
            const fromY = fromComp.y + fromComp.height;
            const toX = toComp.x + toComp.width / 2;
            const toY = toComp.y;

            return (
              <g key={index}>
                <line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#4a4a6a"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <text
                  x={(fromX + toX) / 2}
                  y={(fromY + toY) / 2 - 10}
                  fill="#6b7280"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {conn.label}
                </text>
              </g>
            );
          })}

          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#4a4a6a"
              />
            </marker>
          </defs>

          {/* Components */}
          {dropboxComponents.map((component) => (
            <g
              key={component.id}
              onClick={() => handleComponentClick(component)}
              onMouseEnter={() => setHoveredComponent(component.id)}
              onMouseLeave={() => setHoveredComponent(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={component.x}
                y={component.y}
                width={component.width}
                height={component.height}
                fill={typeColors[component.type].bg}
                stroke={hoveredComponent === component.id || selectedComponent?.id === component.id 
                  ? "#ffffff" 
                  : typeColors[component.type].border}
                strokeWidth={hoveredComponent === component.id || selectedComponent?.id === component.id ? 3 : 2}
                rx="8"
              />
              <circle
                cx={component.x + 20}
                cy={component.y + 30}
                r="6"
                fill={typeColors[component.type].dot}
              />
              <text
                x={component.x + 35}
                y={component.y + 35}
                fill="#ffffff"
                fontSize="14"
                fontWeight="500"
              >
                {component.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card p-4 rounded-lg border border-border">
          <h4 className="text-foreground font-semibold mb-2 text-sm">Legend</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-black" />
              <span className="text-muted-foreground">Actor / Entry</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-muted-foreground">Active Logic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600" />
              <span className="text-muted-foreground">Storage Layer</span>
            </div>
          </div>
        </div>

        {/* Hint */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-card px-4 py-2 rounded-lg border border-border">
          <p className="text-muted-foreground text-xs">Click any component to inspect its architecture in detail</p>
        </div>
      </div>

      {/* Inspection Panel */}
      {selectedComponent && (
        <div className="w-96 bg-card border-l border-border overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">{selectedComponent.name}</h2>
              <button
                onClick={() => setSelectedComponent(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                  Role & Duty
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {selectedComponent.roleAndDuty}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                  Extreme Deep-Dive Details
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {selectedComponent.extremeDeepDive}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                  Failure Scenarios & Mitigation
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {selectedComponent.failureScenarios}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                  Design Tradeoffs & Constraints
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {selectedComponent.designTradeoffs}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
