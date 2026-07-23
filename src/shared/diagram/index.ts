// src/shared/diagram/index.ts
export type {
  Diagram as DiagramData,
  DiagramNode,
  DiagramEdge,
  DiagramLabel,
  DiagramMetadata,
  DiagramTemplate,
  NodeShape,
  NodeVariant,
  EdgeStyle,
  EdgeDirection,
  UnpositionedNode,
} from './types';

export { Diagram } from './renderers/svg/DiagramRenderer';
export { layoutPipeline } from './layouts/pipeline';
export type { PipelineLayoutOptions } from './layouts/pipeline';