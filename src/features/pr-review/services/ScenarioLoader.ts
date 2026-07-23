// src/features/pr-review/services/ScenarioLoader.ts

// src/modules/pr-review/services/ScenarioLoader.ts
import * as fs from 'fs';
import * as path from 'path';

export interface ScenarioMetadata {
  id: string;
  title: string;
  difficulty: string;
  author?: string;
  description: string;
}

export interface PullRequestFile {
  fileId: string;
  filename: string;
  oldContent?: string;
  newContent?: string;
  diffHunks: DiffHunk[];
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  content: string;
}

export interface PullRequestData {
  title: string;
  description: string;
  branch: string;
  baseBranch: string;
  files: PullRequestFile[];
}

export interface Finding {
  id: string;
  category: string;
  severity: string;
  fileId: string;
  line: number;
  keywords: string[];
  description: string;
  points: number;
}

export interface RubricData {
  findings: Finding[];
}

export interface ReviewScenario {
  metadata: ScenarioMetadata;
  pullRequest: PullRequestData;
  rubric: RubricData;
}

export class ScenarioLoader {
  private scenariosPath: string;

  constructor(scenariosPath: string = path.join(process.cwd(), 'content', 'review-scenarios')) {
    this.scenariosPath = scenariosPath;
  }

  async listScenarios(): Promise<ScenarioMetadata[]> {
    const scenarioDirs = fs.readdirSync(this.scenariosPath, { withFileTypes: true });
    const scenarios: ScenarioMetadata[] = [];

    for (const dir of scenarioDirs) {
      if (dir.isDirectory()) {
        const metadataPath = path.join(this.scenariosPath, dir.name, 'metadata.json');
        if (fs.existsSync(metadataPath)) {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
          scenarios.push({
            id: dir.name,
            ...metadata,
          });
        }
      }
    }

    return scenarios;
  }

  async loadScenario(scenarioId: string): Promise<ReviewScenario> {
    const scenarioPath = path.join(this.scenariosPath, scenarioId);
    
    if (!fs.existsSync(scenarioPath)) {
      throw new Error(`Scenario ${scenarioId} not found`);
    }

    const metadataPath = path.join(scenarioPath, 'metadata.json');
    const prPath = path.join(scenarioPath, 'pull-request.json');
    const rubricPath = path.join(scenarioPath, 'rubric.json');

    if (!fs.existsSync(metadataPath) || !fs.existsSync(prPath) || !fs.existsSync(rubricPath)) {
      throw new Error(`Scenario ${scenarioId} is missing required files`);
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    const pullRequest = JSON.parse(fs.readFileSync(prPath, 'utf-8'));
    const rubric = JSON.parse(fs.readFileSync(rubricPath, 'utf-8'));

    return {
      metadata: {
        id: scenarioId,
        ...metadata,
      },
      pullRequest,
      rubric,
    };
  }

  async getScenarioMetadata(scenarioId: string): Promise<ScenarioMetadata> {
    const scenario = await this.loadScenario(scenarioId);
    return scenario.metadata;
  }

  async getPullRequest(scenarioId: string): Promise<PullRequestData> {
    const scenario = await this.loadScenario(scenarioId);
    return scenario.pullRequest;
  }

  async getRubric(scenarioId: string): Promise<RubricData> {
    const scenario = await this.loadScenario(scenarioId);
    return scenario.rubric;
  }
}
