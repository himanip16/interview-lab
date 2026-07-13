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

interface Connection {
  from: string;
  to: string;
  label: string;
}

type SystemType = "dropbox" | "twitter" | "netflix" | "uber" | "instagram" | "whatsapp";

interface SystemConfig {
  components: DiagramComponent[];
  connections: Connection[];
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

const twitterComponents: DiagramComponent[] = [
  {
    id: "client",
    name: "User Client",
    type: "client",
    x: 50,
    y: 100,
    width: 180,
    height: 60,
    details: {
      id: "client",
      name: "User Client",
      type: "client",
      roleAndDuty: "Mobile/web application for users to post tweets, view timelines, and interact with content.",
      extremeDeepDive: "Implements optimistic UI for instant feedback. Uses WebSocket for real-time timeline updates. Implements local caching with SQLite for offline viewing. Handles image/video compression before upload. Implements rate limiting on client side to prevent abuse.",
      failureScenarios: "Network failure - queues actions locally with retry on reconnect. API rate limit exceeded - shows user-friendly error with backoff timer. Media upload failure - automatic retry with compression fallback.",
      designTradeoffs: "Real-time vs batch updates - chose real-time for engagement. Client-side vs server-side rendering - chose hybrid for performance. Native vs web app - chose responsive web for cross-platform."
    }
  },
  {
    id: "gateway",
    name: "API Gateway",
    type: "gateway",
    x: 300,
    y: 100,
    width: 180,
    height: 60,
    details: {
      id: "gateway",
      name: "API Gateway",
      type: "gateway",
      roleAndDuty: "Entry point for all requests, handles authentication, rate limiting, and request routing.",
      extremeDeepDive: "Uses OAuth 2.0 with JWT tokens. Implements per-endpoint rate limiting. Request validation and sanitization. Circuit breaker pattern for downstream services. Request/response compression with gzip. API versioning for backward compatibility.",
      failureScenarios: "Gateway overload - auto-scaling with load shedding. Authentication service down - cached token validation with fallback. DDoS attack - IP-based rate limiting and CAPTCHA.",
      designTradeoffs: "Centralized vs decentralized gateway - chose centralized for consistency. Synchronous vs async routing - chose async for high throughput. Stateful vs stateless - chose stateless for scalability."
    }
  },
  {
    id: "timeline",
    name: "Timeline Service",
    type: "service",
    x: 300,
    y: 250,
    width: 180,
    height: 60,
    details: {
      id: "timeline",
      name: "Timeline Service",
      type: "service",
      roleAndDuty: "Generates home timelines using fanout-on-write strategy for efficient timeline delivery.",
      extremeDeepDive: "Implements fanout-on-write: when user posts, distributes to followers' timelines. Uses Redis for timeline caching with TTL. Supports pagination with cursor-based navigation. Handles timeline regeneration for user edits/deletions. Implements timeline pre-computation for VIP users.",
      failureScenarios: "Fanout queue backlog - worker pool scaling with priority queues. Redis cache miss - fallback to database query. Timeline inconsistency - eventual consistency with repair jobs.",
      designTradeoffs: "Fanout-on-write vs fanout-on-read - chose write for read-heavy workload. Real-time vs delayed fanout - chose near real-time with batching. Full vs partial timeline - chose hybrid with pagination."
    }
  },
  {
    id: "tweet",
    name: "Tweet Service",
    type: "service",
    x: 550,
    y: 250,
    width: 180,
    height: 60,
    details: {
      id: "tweet",
      name: "Tweet Service",
      type: "service",
      roleAndDuty: "Manages tweet CRUD operations, hashtags, mentions, and tweet metadata.",
      extremeDeepDive: "Uses Cassandra for tweet storage with time-series partitioning. Implements tweet indexing for search using Elasticsearch. Handles hashtag extraction and trending calculation. Manages tweet deduplication and spam detection. Supports tweet editing with version history.",
      failureScenarios: "Cassandra write failure - hinted handoff and retry. Search index lag - eventual consistency with catch-up jobs. Hashtag extraction failure - graceful degradation without trending.",
      designTradeoffs: "Cassandra vs PostgreSQL - chose Cassandra for write scalability. Real-time search vs batch indexing - chose real-time with Elasticsearch. Strong vs eventual consistency - chose eventual for performance."
    }
  },
  {
    id: "notification",
    name: "Notification Service",
    type: "service",
    x: 50,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "notification",
      name: "Notification Service",
      type: "service",
      roleAndDuty: "Sends push notifications for mentions, likes, and follows using message queues.",
      extremeDeepDive: "Uses Kafka for event streaming. Implements push notification batching for efficiency. Supports notification preferences and do-not-disturb. Handles device token management. Implements notification deduplication and rate limiting per user.",
      failureScenarios: "Push provider down - message queuing with retry. Device token invalid - automatic cleanup. Notification queue backlog - worker scaling with priority.",
      designTradeoffs: "Push vs pull notifications - chose push for immediacy. Real-time vs batch delivery - chose real-time with batching. Single vs multiple providers - chose multiple for reliability."
    }
  },
  {
    id: "timeline-cache",
    name: "Timeline Cache",
    type: "storage",
    x: 300,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "timeline-cache",
      name: "Timeline Cache",
      type: "storage",
      roleAndDuty: "Redis cluster caching pre-computed timelines for fast retrieval.",
      extremeDeepDive: "Uses Redis Cluster with data sharding. Implements timeline TTL for automatic expiration. Supports pipeline operations for batch retrieval. Uses Redis persistence with RDB snapshots. Implements cache warming for active users.",
      failureScenarios: "Redis node failure - automatic failover with replica promotion. Cache eviction - fallback to database query. Memory pressure - LRU eviction with monitoring.",
      designTradeoffs: "Redis vs Memcached - chose Redis for persistence and data structures. Single instance vs cluster - chose cluster for scalability. In-memory vs disk persistence - chose hybrid for performance and durability."
    }
  },
  {
    id: "tweet-db",
    name: "Tweet Database",
    type: "storage",
    x: 550,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "tweet-db",
      name: "Tweet Database",
      type: "storage",
      roleAndDuty: "Cassandra cluster storing tweets with time-series partitioning for scalability.",
      extremeDeepDive: "Uses Cassandra with time-based partitioning (YYYY-MM). Implements compaction strategies for storage efficiency. Supports multi-region replication for low latency reads. Uses lightweight transactions for conditional updates. Implements tombstone handling for deleted tweets.",
      failureScenarios: "Node failure - replication factor ensures availability. Write latency - tunable consistency with quorum reads. Storage growth - automatic compaction and TTL.",
      designTradeoffs: "Cassandra vs PostgreSQL - chose Cassandra for horizontal scaling. Strong vs eventual consistency - chose eventual for performance. Single vs multi-region - chose multi-region for latency."
    }
  }
];

const netflixComponents: DiagramComponent[] = [
  {
    id: "client",
    name: "Streaming Client",
    type: "client",
    x: 50,
    y: 100,
    width: 180,
    height: 60,
    details: {
      id: "client",
      name: "Streaming Client",
      type: "client",
      roleAndDuty: "Multi-platform app for video playback, browsing, and user interaction.",
      extremeDeepDive: "Implements adaptive bitrate streaming (DASH/HLS). Uses DRM for content protection. Implements video pre-fetching and buffering. Supports offline viewing with encrypted downloads. Uses machine learning for UI personalization.",
      failureScenarios: "Network degradation - automatic quality adjustment. Playback failure - retry with lower quality. DRM license failure - fallback to standard definition.",
      designTradeoffs: "Native vs web player - chose hybrid for reach. Client-side vs server-side adaptation - chose client-side for responsiveness. Download vs streaming - chose both for flexibility."
    }
  },
  {
    id: "gateway",
    name: "API Gateway",
    type: "gateway",
    x: 300,
    y: 100,
    width: 180,
    height: 60,
    details: {
      id: "gateway",
      name: "API Gateway",
      type: "gateway",
      roleAndDuty: "Routes requests to appropriate services, handles authentication and CDN integration.",
      extremeDeepDive: "Implements geographic routing to nearest CDN. Uses JWT for authentication. Request/response caching at edge. Implements device detection for content optimization. Circuit breaker for downstream services.",
      failureScenarios: "Gateway failure - multi-region deployment with DNS failover. CDN integration failure - direct to origin with retry. Authentication service down - cached token validation.",
      designTradeoffs: "Edge vs centralized gateway - chose edge for low latency. Real-time vs cached routing - chose cached with invalidation. Single vs multiple CDNs - chose multiple for redundancy."
    }
  },
  {
    id: "recommendation",
    name: "Recommendation Engine",
    type: "service",
    x: 300,
    y: 250,
    width: 180,
    height: 60,
    details: {
      id: "recommendation",
      name: "Recommendation Engine",
      type: "service",
      roleAndDuty: "ML-powered service generating personalized content recommendations.",
      extremeDeepDive: "Uses collaborative filtering and content-based algorithms. Implements real-time model scoring with TensorFlow Serving. Supports A/B testing for algorithm improvements. Uses feature store for user behavior data. Implements cold-start handling for new users.",
      failureScenarios: "Model scoring failure - fallback to popularity-based recommendations. Feature store down - cached features with graceful degradation. High latency - pre-computed recommendations with refresh.",
      designTradeoffs: "Real-time vs batch recommendations - chose hybrid for freshness. Single vs multiple models - chose ensemble for accuracy. Centralized vs edge inference - chose centralized for model complexity."
    }
  },
  {
    id: "catalog",
    name: "Catalog Service",
    type: "service",
    x: 550,
    y: 250,
    width: 180,
    height: 60,
    details: {
      id: "catalog",
      name: "Catalog Service",
      type: "service",
      roleAndDuty: "Manages content metadata, availability, and regional licensing.",
      extremeDeepDive: "Uses Elasticsearch for content search and filtering. Implements regional availability tracking. Supports content versioning for multiple quality levels. Manages licensing windows and geo-blocking. Implements content caching at CDN edge.",
      failureScenarios: "Search index lag - eventual consistency with rebuild. Content unavailability - graceful error with alternatives. License validation failure - fallback to available content.",
      designTradeoffs: "Elasticsearch vs SQL - chose Elasticsearch for search capabilities. Real-time vs batch updates - chose real-time for accuracy. Centralized vs regional catalog - chose hybrid for latency."
    }
  },
  {
    id: "cdn",
    name: "CDN Network",
    type: "storage",
    x: 300,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "cdn",
      name: "CDN Network",
      type: "storage",
      roleAndDuty: "Global content delivery network for video streaming with edge caching.",
      extremeDeepDive: "Uses multi-tier CDN with edge, regional, and origin layers. Implements adaptive bitrate caching. Supports live streaming with chunked transfer. Uses HTTP/2 and HTTP/3 for performance. Implements cache invalidation and purging.",
      failureScenarios: "Edge node failure - automatic rerouting to nearest node. Cache miss - fetch from regional layer. Origin overload - throttling and queue management.",
      designTradeoffs: "Single vs multiple CDN providers - chose multiple for redundancy. Push vs pull caching - chose pull for simplicity. Live vs VOD optimization - chose separate optimization."
    }
  },
  {
    id: "video-storage",
    name: "Video Storage",
    type: "storage",
    x: 550,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "video-storage",
      name: "Video Storage",
      type: "storage",
      roleAndDuty: "Object storage for video assets with multiple quality encodings.",
      extremeDeepDive: "Uses S3 with intelligent tiering. Stores multiple encodings (4K, 1080p, 720p, etc.). Implements lifecycle policies for cost optimization. Uses glacier for archival. Supports partial content retrieval for adaptive streaming.",
      failureScenarios: "Storage unavailability - multi-region replication. Encoding failure - fallback to lower quality. Cost overrun - automated lifecycle management.",
      designTradeoffs: "S3 vs custom storage - chose S3 for managed service. Single vs multiple encodings - chose multiple for adaptive streaming. Hot vs cold storage - chose tiered for cost optimization."
    }
  }
];

const uberComponents: DiagramComponent[] = [
  {
    id: "rider",
    name: "Rider App",
    type: "client",
    x: 50,
    y: 50,
    width: 180,
    height: 60,
    details: {
      id: "rider",
      name: "Rider App",
      type: "client",
      roleAndDuty: "Mobile app for riders to request rides, track drivers, and handle payments.",
      extremeDeepDive: "Implements real-time location tracking with GPS. Uses WebSocket for driver location updates. Implements surge pricing display. Supports multiple payment methods with tokenization. Uses offline mode for basic functionality.",
      failureScenarios: "GPS signal loss - last known location with network-based fallback. WebSocket disconnect - automatic reconnection with state sync. Payment failure - retry with alternative method.",
      designTradeoffs: "Real-time vs polling - chose WebSocket for efficiency. Client-side vs server-side pricing - chose server-side for accuracy. Native vs hybrid app - chose native for performance."
    }
  },
  {
    id: "driver",
    name: "Driver App",
    type: "client",
    x: 50,
    y: 150,
    width: 180,
    height: 60,
    details: {
      id: "driver",
      name: "Driver App",
      type: "client",
      roleAndDuty: "Mobile app for drivers to receive ride requests, navigation, and earnings management.",
      extremeDeepDive: "Implements background location tracking. Uses push notifications for ride requests. Integrates with mapping APIs for navigation. Implements earnings calculation and tax reporting. Supports offline mode for navigation.",
      failureScenarios: "Location tracking failure - manual check-in with GPS restart. Push notification failure - polling fallback. Navigation failure - offline maps with cached routes.",
      designTradeoffs: "Background vs foreground tracking - chose background with OS permissions. Real-time vs batch earnings - chose real-time for transparency. Single vs multiple mapping providers - chose multiple for reliability."
    }
  },
  {
    id: "gateway",
    name: "API Gateway",
    type: "gateway",
    x: 300,
    y: 100,
    width: 180,
    height: 60,
    details: {
      id: "gateway",
      name: "API Gateway",
      type: "gateway",
      roleAndDuty: "Routes requests, handles authentication, rate limiting, and protocol translation.",
      extremeDeepDive: "Implements OAuth 2.0 with JWT tokens. Uses gRPC for internal service communication. Supports protocol translation (HTTP to gRPC). Implements request/response compression. Circuit breaker pattern for downstream services.",
      failureScenarios: "Gateway overload - auto-scaling with load shedding. Authentication failure - cached token validation. Service discovery failure - static configuration fallback.",
      designTradeoffs: "REST vs gRPC - chose gRPC for internal performance. Centralized vs decentralized gateway - chose centralized for consistency. Stateful vs stateless - chose stateless for scalability."
    }
  },
  {
    id: "dispatch",
    name: "Dispatch Service",
    type: "service",
    x: 300,
    y: 250,
    width: 180,
    height: 60,
    details: {
      id: "dispatch",
      name: "Dispatch Service",
      type: "service",
      roleAndDuty: "Matches riders with drivers using real-time geospatial indexing.",
      extremeDeepDive: "Uses geospatial indexing with S2 geometry library. Implements real-time matching with supply-demand balancing. Supports ETA calculation with traffic prediction. Handles surge pricing based on demand. Implements driver assignment optimization.",
      failureScenarios: "Matching service down - fallback to nearest driver. Geospatial index lag - cached locations with refresh. ETA inaccuracy - machine learning model retraining.",
      designTradeoffs: "Real-time vs batch matching - chose real-time for UX. Centralized vs distributed dispatch - chose regional dispatch for latency. Simple vs complex matching - chose hybrid for performance."
    }
  },
  {
    id: "pricing",
    name: "Pricing Service",
    type: "service",
    x: 550,
    y: 250,
    width: 180,
    height: 60,
    details: {
      id: "pricing",
      name: "Pricing Service",
      type: "service",
      roleAndDuty: "Calculates dynamic pricing based on demand, supply, and external factors.",
      extremeDeepDive: "Implements surge pricing algorithm with demand prediction. Uses machine learning for price optimization. Supports promotional pricing and discounts. Handles currency conversion for international markets. Implements price caching with TTL.",
      failureScenarios: "Pricing calculation failure - fallback to base rates. ML model degradation - rule-based fallback. Currency service down - cached rates with manual refresh.",
      designTradeoffs: "Dynamic vs static pricing - chose dynamic for supply-demand balance. Centralized vs decentralized pricing - chose regional for local factors. Real-time vs batch calculation - chose real-time with caching."
    }
  },
  {
    id: "location",
    name: "Location Service",
    type: "service",
    x: 300,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "location",
      name: "Location Service",
      type: "service",
      roleAndDuty: "Tracks and stores real-time locations of drivers and riders.",
      extremeDeepDive: "Uses Redis Geo for real-time location storage. Implements location update batching for efficiency. Supports geofencing for pickup/dropoff zones. Handles location history for route optimization. Uses time-series database for analytics.",
      failureScenarios: "Redis node failure - cluster with automatic failover. High write throughput - sharding by geographic region. Location accuracy - sensor fusion with GPS, WiFi, and cell towers.",
      designTradeoffs: "Redis vs PostGIS - chose Redis for real-time performance. Real-time vs batch updates - chose real-time with batching. Single vs multiple data centers - chose regional for latency."
    }
  },
  {
    id: "payment",
    name: "Payment Service",
    type: "service",
    x: 550,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "payment",
      name: "Payment Service",
      type: "service",
      roleAndDuty: "Handles payment processing, refunds, and driver payouts.",
      extremeDeepDive: "Integrates with multiple payment gateways (Stripe, Braintree). Implements payment tokenization for security. Supports split payments for promotions. Handles refund processing and disputes. Implements driver payout scheduling.",
      failureScenarios: "Payment gateway failure - fallback to alternative provider. Payment processing timeout - retry with idempotency. Refund failure - manual processing with alerts.",
      designTradeoffs: "Single vs multiple gateways - chose multiple for redundancy. Real-time vs batch processing - chose real-time for UX. Synchronous vs async processing - chose async with callbacks."
    }
  }
];

const instagramComponents: DiagramComponent[] = [
  {
    id: "client",
    name: "Instagram App",
    type: "client",
    x: 50,
    y: 100,
    width: 180,
    height: 60,
    details: {
      id: "client",
      name: "Instagram App",
      type: "client",
      roleAndDuty: "Mobile app for photo/video sharing, stories, and social interaction.",
      extremeDeepDive: "Implements image/video compression before upload. Uses WebSocket for real-time notifications. Supports offline media creation with queue. Implements local caching for feed. Uses machine learning for image enhancement.",
      failureScenarios: "Upload failure - automatic retry with compression fallback. Network disconnection - queue actions locally. Media processing timeout - progress indicator with cancel option.",
      designTradeoffs: "Client-side vs server-side compression - chose client-side for bandwidth. Real-time vs batch notifications - chose real-time for engagement. Native vs cross-platform - chose native for performance."
    }
  },
  {
    id: "gateway",
    name: "API Gateway",
    type: "gateway",
    x: 300,
    y: 100,
    width: 180,
    height: 60,
    details: {
      id: "gateway",
      name: "API Gateway",
      type: "gateway",
      roleAndDuty: "Routes requests, handles authentication, rate limiting, and CDN integration.",
      extremeDeepDive: "Implements OAuth 2.0 with JWT tokens. Uses GraphQL for flexible data fetching. Supports request/response compression. Implements API versioning. Circuit breaker for downstream services.",
      failureScenarios: "Gateway overload - auto-scaling with load shedding. Authentication service down - cached token validation. GraphQL complexity - query depth limiting.",
      designTradeoffs: "REST vs GraphQL - chose GraphQL for flexibility. Centralized vs decentralized gateway - chose centralized for consistency. Synchronous vs async - chose async for high throughput."
    }
  },
  {
    id: "feed",
    name: "Feed Service",
    type: "service",
    x: 300,
    y: 250,
    width: 180,
    height: 60,
    details: {
      id: "feed",
      name: "Feed Service",
      type: "service",
      roleAndDuty: "Generates personalized feeds using ranking algorithms and fanout strategy.",
      extremeDeepDive: "Implements feed ranking with machine learning models. Uses fanout-on-write for timeline generation. Supports pagination with cursor-based navigation. Handles feed regeneration for algorithm updates. Implements story ranking with time decay.",
      failureScenarios: "Ranking service down - fallback to chronological feed. Fanout queue backlog - worker scaling with priority. Feed inconsistency - eventual consistency with repair jobs.",
      designTradeoffs: "Fanout-on-write vs fanout-on-read - chose write for read-heavy workload. Real-time vs batch ranking - chose real-time with caching. Simple vs complex ranking - chose hybrid for performance."
    }
  },
  {
    id: "media",
    name: "Media Service",
    type: "service",
    x: 550,
    y: 250,
    width: 180,
    height: 60,
    details: {
      id: "media",
      name: "Media Service",
      type: "service",
      roleAndDuty: "Handles media upload, processing, storage, and CDN distribution.",
      extremeDeepDive: "Implements asynchronous media processing pipeline. Uses FFmpeg for video transcoding. Supports multiple quality variants. Implements image optimization and thumbnail generation. Uses message queues for processing tasks.",
      failureScenarios: "Processing failure - retry with fallback quality. Storage quota exceeded - user notification with cleanup options. CDN integration failure - direct serving from origin.",
      designTradeoffs: "Real-time vs async processing - chose async for scalability. Single vs multiple quality variants - chose multiple for adaptive delivery. Centralized vs distributed processing - chose distributed for throughput."
    }
  },
  {
    id: "story",
    name: "Story Service",
    type: "service",
    x: 50,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "story",
      name: "Story Service",
      type: "service",
      roleAndDuty: "Manages ephemeral story content with automatic expiration.",
      extremeDeepDive: "Implements TTL-based story expiration. Uses Redis for story metadata caching. Supports story viewing analytics. Handles story highlights and archives. Implements story privacy and close friends lists.",
      failureScenarios: "Expiration job failure - delayed cleanup with catch-up. Story view tracking failure - approximate counts with sampling. Redis cache miss - fallback to database.",
      designTradeoffs: "TTL vs manual cleanup - chose TTL for simplicity. Real-time vs batch expiration - chose real-time with TTL. Centralized vs distributed storage - chose hybrid for performance."
    }
  },
  {
    id: "feed-cache",
    name: "Feed Cache",
    type: "storage",
    x: 300,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "feed-cache",
      name: "Feed Cache",
      type: "storage",
      roleAndDuty: "Redis cluster caching pre-computed feeds and story timelines.",
      extremeDeepDive: "Uses Redis Cluster with data sharding. Implements feed TTL for automatic refresh. Supports pipeline operations for batch retrieval. Uses Redis persistence with AOF. Implements cache warming for active users.",
      failureScenarios: "Redis node failure - automatic failover with replicas. Cache eviction - fallback to database generation. Memory pressure - LRU eviction with monitoring.",
      designTradeoffs: "Redis vs Memcached - chose Redis for persistence. Single instance vs cluster - chose cluster for scalability. In-memory vs disk persistence - chose hybrid for performance."
    }
  },
  {
    id: "media-storage",
    name: "Media Storage",
    type: "storage",
    x: 550,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "media-storage",
      name: "Media Storage",
      type: "storage",
      roleAndDuty: "S3 storage for original and processed media with CDN integration.",
      extremeDeepDive: "Uses S3 with intelligent tiering. Implements lifecycle policies for cost optimization. Supports multipart upload for large files. Uses S3 Cross-Region Replication. Integrates with CloudFront for CDN delivery.",
      failureScenarios: "S3 outage - multi-region deployment with failover. Upload failure - automatic retry with resume. Cost overrun - automated lifecycle management.",
      designTradeoffs: "S3 vs custom storage - chose S3 for managed service. Single vs multiple CDNs - chose CloudFront for integration. Hot vs cold storage - chose tiered for cost optimization."
    }
  }
];

const whatsappComponents: DiagramComponent[] = [
  {
    id: "client",
    name: "WhatsApp Client",
    type: "client",
    x: 50,
    y: 100,
    width: 180,
    height: 60,
    details: {
      id: "client",
      name: "WhatsApp Client",
      type: "client",
      roleAndDuty: "Mobile app for messaging, voice/video calls, and media sharing.",
      extremeDeepDive: "Implements Signal Protocol for end-to-end encryption. Uses WebSocket for real-time message delivery. Supports offline message queueing. Implements media compression before upload. Uses local database for message history.",
      failureScenarios: "Network disconnection - message queue with exponential backoff. Encryption key exchange failure - fallback to unencrypted with warning. Media upload failure - retry with lower quality.",
      designTradeoffs: "E2E encryption vs server-side - chose E2E for privacy. Real-time vs store-and-forward - chose hybrid for reliability. Single vs multiple devices - chose multi-device support."
    }
  },
  {
    id: "gateway",
    name: "Connection Gateway",
    type: "gateway",
    x: 300,
    y: 100,
    width: 180,
    height: 60,
    details: {
      id: "gateway",
      name: "Connection Gateway",
      type: "gateway",
      roleAndDuty: "Handles WebSocket connections, authentication, and protocol translation.",
      extremeDeepDive: "Implements long-lived WebSocket connection management. Uses phone number-based authentication. Supports protocol translation between client and internal services. Implements connection heartbeat and reconnection logic. Handles connection pooling and load balancing.",
      failureScenarios: "WebSocket disconnect - automatic reconnection with state sync. Gateway overload - connection throttling with queue. Authentication failure - fallback to SMS verification.",
      designTradeoffs: "WebSocket vs HTTP polling - chose WebSocket for real-time. Long-lived vs short-lived connections - chose long-lived for efficiency. Centralized vs distributed gateway - chose regional for latency."
    }
  },
  {
    id: "message",
    name: "Message Service",
    type: "service",
    x: 300,
    y: 250,
    width: 180,
    height: 60,
    details: {
      id: "message",
      name: "Message Service",
      type: "service",
      roleAndDuty: "Handles message routing delivery, and read receipts.",
      extremeDeepDive: "Uses message queues for reliable delivery. Implements message deduplication using message IDs. Supports read receipts and typing indicators. Handles message status tracking (sent, delivered, read). Implements message retry with exponential backoff.",
      failureScenarios: "Message queue backlog - worker pool scaling. Delivery failure - retry with dead letter queue. Read receipt sync failure - eventual consistency.",
      designTradeoffs: "Queue vs direct delivery - chose queue for reliability. Real-time vs batch processing - chose real-time with batching. Strong vs eventual consistency - chose eventual for performance."
    }
  },
  {
    id: "media",
    name: "Media Service",
    type: "service",
    x: 550,
    y: 250,
    width: 180,
    height: 60,
    details: {
      id: "media",
      name: "Media Service",
      type: "service",
      roleAndDuty: "Handles media upload, compression, storage, and thumbnail generation.",
      extremeDeepDive: "Implements asynchronous media processing pipeline. Uses FFmpeg for video compression and thumbnail generation. Supports multiple quality variants. Implements media encryption at rest. Uses message queues for processing tasks.",
      failureScenarios: "Processing failure - retry with fallback quality. Storage quota exceeded - user notification with cleanup options. Encryption failure - fallback to unencrypted with warning.",
      designTradeoffs: "Real-time vs async processing - chose async for scalability. Client-side vs server-side compression - chose hybrid for bandwidth. Single vs multiple quality variants - chose multiple for adaptive delivery."
    }
  },
  {
    id: "group",
    name: "Group Service",
    type: "service",
    x: 50,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "group",
      name: "Group Service",
      type: "service",
      roleAndDuty: "Manages group metadata, member lists, and group message routing.",
      extremeDeepDive: "Implements group membership with role-based permissions. Supports group message fanout to members. Handles group admin and moderation features. Manages group avatar and metadata. Implements group message encryption key distribution.",
      failureScenarios: "Fanout queue backlog - worker scaling with priority. Member sync failure - eventual consistency with repair. Key distribution failure - fallback to individual encryption.",
      designTradeoffs: "Fanout-on-write vs fanout-on-read - chose write for real-time delivery. Centralized vs distributed group state - chose centralized for consistency. Real-time vs batch fanout - chose real-time with batching."
    }
  },
  {
    id: "message-store",
    name: "Message Store",
    type: "storage",
    x: 300,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "message-store",
      name: "Message Store",
      type: "storage",
      roleAndDuty: "Database storing encrypted messages with time-series partitioning.",
      extremeDeepDive: "Uses MongoDB with time-based collections. Implements message TTL for automatic cleanup. Supports message indexing for search. Uses sharding by user ID for scalability. Implements message encryption at rest with customer-managed keys.",
      failureScenarios: "Database node failure - replica set with automatic failover. Storage growth - automatic TTL and archiving. Query performance - index optimization and read replicas.",
      designTradeoffs: "MongoDB vs PostgreSQL - chose MongoDB for flexible schema. Real-time vs batch indexing - chose real-time with Elasticsearch. Single vs multi-region - chose multi-region for latency."
    }
  },
  {
    id: "media-storage",
    name: "Media Storage",
    type: "storage",
    x: 550,
    y: 400,
    width: 180,
    height: 60,
    details: {
      id: "media-storage",
      name: "Media Storage",
      type: "storage",
      roleAndDuty: "S3 storage for encrypted media with CDN integration.",
      extremeDeepDive: "Uses S3 with server-side encryption. Implements lifecycle policies for cost optimization. Supports multipart upload for large files. Uses S3 Cross-Region Replication. Integrates with CloudFront for CDN delivery.",
      failureScenarios: "S3 outage - multi-region deployment with failover. Upload failure - automatic retry with resume. Encryption failure - fallback to unencrypted with warning.",
      designTradeoffs: "S3 vs custom storage - chose S3 for managed service. Single vs multiple CDNs - chose CloudFront for integration. Hot vs cold storage - chose tiered for cost optimization."
    }
  }
];

const systemConfigs: Record<SystemType, SystemConfig> = {
  dropbox: {
    components: dropboxComponents,
    connections: [
      { from: "client", to: "gateway", label: "API Calls" },
      { from: "gateway", to: "block-sync", label: "Stream Block" },
      { from: "gateway", to: "metadata", label: "Update Metadata" },
      { from: "block-sync", to: "s3", label: "Store/Retrieve" },
      { from: "metadata", to: "metadata-db", label: "Query/Update" }
    ]
  },
  twitter: {
    components: twitterComponents,
    connections: [
      { from: "client", to: "gateway", label: "API Calls" },
      { from: "gateway", to: "timeline", label: "Get Timeline" },
      { from: "gateway", to: "tweet", label: "Post Tweet" },
      { from: "tweet", to: "timeline-cache", label: "Update Cache" },
      { from: "tweet", to: "tweet-db", label: "Store Tweet" },
      { from: "timeline", to: "timeline-cache", label: "Read/Write" },
      { from: "tweet", to: "notification", label: "Trigger Event" }
    ]
  },
  netflix: {
    components: netflixComponents,
    connections: [
      { from: "client", to: "gateway", label: "API Calls" },
      { from: "gateway", to: "recommendation", label: "Get Recommendations" },
      { from: "gateway", to: "catalog", label: "Browse Catalog" },
      { from: "catalog", to: "cdn", label: "Content URL" },
      { from: "client", to: "cdn", label: "Stream Video" },
      { from: "cdn", to: "video-storage", label: "Fetch Content" }
    ]
  },
  uber: {
    components: uberComponents,
    connections: [
      { from: "rider", to: "gateway", label: "Request Ride" },
      { from: "driver", to: "gateway", label: "Update Location" },
      { from: "gateway", to: "dispatch", label: "Match Request" },
      { from: "gateway", to: "pricing", label: "Get Price" },
      { from: "dispatch", to: "location", label: "Query Locations" },
      { from: "dispatch", to: "pricing", label: "Apply Surge" },
      { from: "gateway", to: "payment", label: "Process Payment" }
    ]
  },
  instagram: {
    components: instagramComponents,
    connections: [
      { from: "client", to: "gateway", label: "API Calls" },
      { from: "gateway", to: "feed", label: "Get Feed" },
      { from: "gateway", to: "media", label: "Upload Media" },
      { from: "gateway", to: "story", label: "Post Story" },
      { from: "feed", to: "feed-cache", label: "Read/Write" },
      { from: "media", to: "media-storage", label: "Store/Retrieve" },
      { from: "story", to: "feed-cache", label: "Update Timeline" }
    ]
  },
  whatsapp: {
    components: whatsappComponents,
    connections: [
      { from: "client", to: "gateway", label: "WebSocket Connect" },
      { from: "gateway", to: "message", label: "Route Message" },
      { from: "gateway", to: "media", label: "Upload Media" },
      { from: "gateway", to: "group", label: "Group Operations" },
      { from: "message", to: "message-store", label: "Store Message" },
      { from: "media", to: "media-storage", label: "Store Media" },
      { from: "group", to: "message", label: "Fanout Messages" }
    ]
  }
};

const typeColors = {
  client: { bg: "#1a1a2e", border: "#4a4a6a", dot: "#000000" },
  service: { bg: "#16213e", border: "#0f3460", dot: "#0066cc" },
  storage: { bg: "#1a1a2e", border: "#e94560", dot: "#cc0000" },
  gateway: { bg: "#1f4068", border: "#162447", dot: "#0099cc" }
};

interface SystemDiagramProps {
  systemType: SystemType;
}

export default function SystemDiagram({ systemType }: SystemDiagramProps) {
  const [selectedComponent, setSelectedComponent] = useState<ComponentDetail | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  const config = systemConfigs[systemType];
  const components = config.components;
  const connections = config.connections;

  const handleComponentClick = (component: DiagramComponent) => {
    setSelectedComponent(component.details);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Diagram Area */}
      <div className="flex-1 relative overflow-auto">
        <svg className="w-full h-full" style={{ minWidth: "800px", minHeight: "600px" }}>
          {/* Connections */}
          {connections.map((conn: Connection, index: number) => {
            const fromComp = components.find(c => c.id === conn.from);
            const toComp = components.find(c => c.id === conn.to);
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
          {components.map((component) => (
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
