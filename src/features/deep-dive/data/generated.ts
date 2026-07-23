import { CassandraData } from "@/content/deep-dive/articles/cassandra";
import { ConsistentHashingData } from "@/content/deep-dive/articles/consistent-hashing";
import { DynamodbData } from "@/content/deep-dive/articles/dynamodb";
import { KafkaData } from "@/content/deep-dive/articles/kafka";
import { MongodbData } from "@/content/deep-dive/articles/mongodb";
import { PostgresData } from "@/content/deep-dive/articles/postgres";
import { RedisData } from "@/content/deep-dive/articles/redis";

export const deepDiveRegistry = [
  CassandraData,
  ConsistentHashingData,
  DynamodbData,
  KafkaData,
  MongodbData,
  PostgresData,
  RedisData
];