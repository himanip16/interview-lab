// src/content/deep-dive/index.ts

import type { DeepDiveArticle } from "@/features/deep-dive/types";

import { CassandraData } from "./articles/cassandra";
import { KafkaData } from "./articles/kafka";
import { PostgresData } from "./articles/postgres";
import { MongodbData } from "./articles/mongodb";
import { RedisData } from "./articles/redis";
import { DynamodbData } from "./articles/dynamodb";
import { ConsistentHashingData } from "./articles/consistent-hashing";

export const deepDiveRegistry: DeepDiveArticle[] = [
  CassandraData,
  KafkaData,
  PostgresData,
  MongodbData,
  RedisData,
  DynamodbData,
  ConsistentHashingData,
];

export function getAllDeepDives() {
  return deepDiveRegistry;
}

export function getDeepDiveBySlug(slug: string) {
  return deepDiveRegistry.find(
    (article) => article.slug === slug
  );
}

export function getPreviousAndNext(slug: string) {
  const index = deepDiveRegistry.findIndex(
    (article) => article.slug === slug
  );

  if (index === -1) {
    return {
      previous: null,
      next: null,
    };
  }

  return {
    previous:
      index > 0 ? deepDiveRegistry[index - 1] : null,
    next:
      index < deepDiveRegistry.length - 1
        ? deepDiveRegistry[index + 1]
        : null,
  };
}