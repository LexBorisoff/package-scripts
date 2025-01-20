import { useCoreHooks } from '../hooks/use-core-hooks.js';

import { fallbackConfig } from './fallback-config.js';

import type { ConfigInterface } from '../types/config.types.js';

export function getConfigData(): ConfigInterface {
  const configFile = useCoreHooks((root) => root['config.json']);

  try {
    const raw = configFile.read();
    const parsed = raw != null ? JSON.parse(raw) : fallbackConfig;
    return { ...fallbackConfig, ...parsed };
  } catch {
    return fallbackConfig;
  }
}
