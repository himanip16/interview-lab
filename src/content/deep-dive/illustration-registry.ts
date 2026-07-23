import type { ComponentType } from "react";

import { CassandraIllustration } from "./illustrations/Cassandra";
import { RedisIllustration } from "./illustrations/Redis";
import { KafkaIllustration } from "./illustrations/Kafka";
import { PostgresIllustration } from "./illustrations/Postgres";
import { DynamoDBIllustration } from "./illustrations/DynamoDB";
import { MongoDBIllustration } from "./illustrations/MongoDB";
import { ConsistentHashingHero } from "./illustrations/ConsistentHashingHero";

export const heroIllustrations: Record<string, ComponentType> = {
  cassandra: CassandraIllustration,
  redis: RedisIllustration,
  kafka: KafkaIllustration,
  postgres: PostgresIllustration,
  dynamodb: DynamoDBIllustration,
  mongodb: MongoDBIllustration,
  "consistent-hashing": ConsistentHashingHero,
};