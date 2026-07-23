// src/content/deep-dive/illustrations/cassandraWritePath.ts

// src/content/deep-dive/diagrams/cassandraWritePath.ts
//
// This is what used to be `<CassandraIllustration />` / a bespoke JSX
// component under features/deep-dive or learning/components/diagrams.
// It's now data. The deep-dive page loads this and renders it with the
// generic <Diagram> component — no new .tsx file needed for the next one.

import { layoutPipeline } from '@/shared/diagram/layouts/pipeline';
import type { Diagram } from '@/shared/diagram/types';

export const cassandraWritePath: Diagram = layoutPipeline(
  [
    { id: 'write', type: 'box', title: 'Write Request', variant: 'primary' },
    { id: 'log', type: 'cylinder', title: 'Commit Log', subtitle: 'append-only' },
    { id: 'mem', type: 'box', title: 'Memtable', subtitle: 'in-memory' },
  ],
  { direction: 'horizontal', gap: 72 },
  [
    { from: 'write', to: 'log', direction: 'forward', label: '1. append' },
    { from: 'write', to: 'mem', direction: 'forward', label: '2. write' },
  ],
  { title: 'Cassandra write path' }
);