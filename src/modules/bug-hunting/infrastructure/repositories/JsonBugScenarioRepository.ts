import {
  BugScenarioRepository,
  Page,
  ScenarioQuery,
} from "@/repositories";

import {
  BugScenario,
  InvestigationArtifact,
  ScenarioMetadata,
  ScenarioDifficulty,
  Severity,
  ScenarioCategory,
  EvidenceType,
} from "@/domain";
import { ScenarioRegistry } from "@/infrastructure/registry/ScenarioRegistry";


export class JsonBugScenarioRepository
  implements BugScenarioRepository {

  async findById(
    id: string,
  ): Promise<BugScenario | null> {

    const raw = ScenarioRegistry.get(id);

    if (!raw) {
      return null;
    }

    return this.mapToDomain(raw);
  }


  async findMany(
    query: ScenarioQuery,
  ): Promise<Page<BugScenario>> {

    let scenarios = ScenarioRegistry.getAll();


    if (query.search) {
      scenarios = scenarios.filter(
        scenario =>
          scenario.title
            .toLowerCase()
            .includes(
              query.search!.toLowerCase(),
            ),
      );
    }


    const start =
      query.page * query.pageSize;

    const items =
      scenarios
        .slice(
          start,
          start + query.pageSize,
        )
        .map(item =>
          this.mapToDomain(item),
        );


    return {
      items,
      total: scenarios.length,
      page: query.page,
      pageSize: query.pageSize,
    };
  }


  private mapToDomain(
    data: any,
  ): BugScenario {

    return new BugScenario(
      data.id,
      data.title,
      data.description,

      new ScenarioMetadata(
        data.metadata.difficulty as ScenarioDifficulty,
        data.metadata.severity as Severity,
        data.metadata.category as ScenarioCategory,
        data.metadata.estimatedTimeMinutes,
        data.metadata.tags,
      ),

      data.artifacts.map(
        (artifact: any) =>
          new InvestigationArtifact(
            artifact.id,
            artifact.type as EvidenceType,
            artifact.label,
            artifact.description,
            artifact.content,
            artifact.order,
            artifact.points,
            artifact.unlocked,
          ),
      ),

      new Date(data.createdAt),
    );
  }
}