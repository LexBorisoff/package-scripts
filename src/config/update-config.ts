import { useCoreHooks } from '../hooks/use-core-hooks.js';

import { getConfigData } from './get-config-data.js';

import type { ConfigInterface } from '../types/config.types.js';

export function updateConfig(config: Partial<ConfigInterface>): void {
  const configFile = useCoreHooks((root) => root['config.json']);
  const currentConfig = getConfigData();
  const updatedConfig: ConfigInterface = { ...currentConfig, ...config };
  configFile.write(JSON.stringify(updatedConfig));
}
