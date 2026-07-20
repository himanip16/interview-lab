import { DeepDiveArticle } from '../types';
import { cassandraData } from './cassandra';
import { redisData } from './redis';
import { kafkaData } from './kafka';
import { postgresData } from './postgres';
import { dynamodbData } from './dynamodb';
import { mongodbData } from './mongodb';

export const deepDiveData: DeepDiveArticle[] = [
  cassandraData,
  redisData,
  kafkaData,
  postgresData,
  dynamodbData,
  mongodbData
];

export function getDeepDiveBySlug(slug: string): DeepDiveArticle | undefined {
  return deepDiveData.find(item => item.slug === slug);
}

export function getPreviousAndNext(slug: string): { previous?: DeepDiveArticle; next?: DeepDiveArticle } {
  const index = deepDiveData.findIndex(item => item.slug === slug);
  if (index === -1) {
    return {};
  }
  return {
    previous: index > 0 ? deepDiveData[index - 1] : undefined,
    next: index < deepDiveData.length - 1 ? deepDiveData[index + 1] : undefined
  };
}
