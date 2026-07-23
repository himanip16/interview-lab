// src/content/deep-dive/component-registry.ts

import { ModuloIllustration } from "./illustrations/ModuloIllustration";
import { ConsistentHashingIllustration } from "./illustrations/ConsistentHashing";

import type { ComponentType } from "react";

export const contentComponents: Record<string, ComponentType> = {
  ModuloIllustration,
  ConsistentHashingIllustration,
};