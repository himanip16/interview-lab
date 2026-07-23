// src/shared/config/constants.ts

import { env } from "./env";

export const TEMPERATURE =
  env.MODEL_TEMPERATURE;

export const MAX_OUTPUT_TOKENS =
  env.MAX_OUTPUT_TOKENS;

export const REQUEST_TIMEOUT_MS =
  env.REQUEST_TIMEOUT_MS;