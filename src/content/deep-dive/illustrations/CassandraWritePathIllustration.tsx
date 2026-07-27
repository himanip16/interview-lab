// src/content/deep-dive/illustrations/cassandraWritePath.ts

import { layoutPipeline } from "@/shared/diagram/layouts/pipeline";
import type { Diagram } from "@/shared/diagram/types";

export const cassandraWritePath: Diagram = layoutPipeline(
  [
    {
      id: "write",
      type: "box",
      title: "Write Request",
      variant: "primary",
    },
    {
      id: "log",
      type: "cylinder",
      title: "Commit Log",
      subtitle: "append-only",
    },
    {
      id: "mem",
      type: "box",
      title: "Memtable",
      subtitle: "in-memory",
    },
  ],
  {
    direction: "horizontal",
    gap: 72,
  },
  [
    {
      from: "write",
      to: "log",
      direction: "forward",
      label: "1. append",
    },
    {
      from: "write",
      to: "mem",
      direction: "forward",
      label: "2. write",
    },
  ],
  {
    title: "Cassandra write path",
  }
);