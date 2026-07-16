import { BugScenario } from "../domain/entities/BugScenario";

export interface ScenarioQuery {
  difficulty?: string;
  category?: string;
  severity?: string;
  tags?: string[];
  search?: string;
  page: number;
  pageSize: number;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BugScenarioRepository {
  findById(
    id: string,
  ): Promise<BugScenario | null>;

  findMany(
    query: ScenarioQuery,
  ): Promise<Page<BugScenario>>;
}