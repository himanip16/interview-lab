import { article as acid } from "./articles/acid";
import { article as cassandra } from "./articles/cassandra";
import { article as consistentHashing } from "./articles/consistentHashing";
import { article as dynamodb } from "./articles/dynamodb";
import { article as flink } from "./articles/flink";
import { article as kafka } from "./articles/kafka";
import { article as memtable } from "./articles/memtable";
import { article as mongodb } from "./articles/mongodb";
import { article as mvcc } from "./articles/mvcc";
import { article as postgres } from "./articles/postgres";
import { article as redis } from "./articles/redis";
import { article as sstable } from "./articles/sstable";

export const deepDiveRegistry = [
  acid,
  cassandra,
  consistentHashing,
  dynamodb,
  flink,
  kafka,
  memtable,
  mongodb,
  mvcc,
  postgres,
  redis,
  sstable,
];
