import { useCoreHooks } from '../hooks/use-core-hooks.js';

import { fallbackConfig } from './fallback-config.js';

import type { ConfigInterface } from '../types/config.types.js';

export function getConfigData(): ConfigInterface {
  const configFile = useCoreHooks((root) => root['config.json']);

  try {
    const configRaw = configFile.read();
    return configRaw != null ? JSON.parse(configRaw) : fallbackConfig;
  } catch {
    return fallbackConfig;
  }
}
