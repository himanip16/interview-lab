import { CassandraData } from "./articles/cassandra";
import { KafkaData } from "./articles/kafka";
import { PostgresData } from "./articles/postgres";

export const deepDiveRegistry = [
  CassandraData,
  KafkaData,
  PostgresData,
];