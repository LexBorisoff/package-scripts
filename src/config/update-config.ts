import { useCoreHooks } from '../hooks/use-core-hooks.js';

import { getConfigData } from './get-config-data.js';

import type { ConfigInterface } from '../types/config.types.js';

type ConfigUpdaterFn = (config: ConfigInterface) => Partial<ConfigInterface>;

export function updateConfig(
  config: Partial<ConfigInterface> | ConfigUpdaterFn,
): void {
  const currentConfig = getConfigData();
  const updatedConfig: ConfigInterface =
    typeof config === 'function'
      ? { ...currentConfig, ...config(currentConfig) }
      : { ...currentConfig, ...config };

  const configFile = useCoreHooks((root) => root['config.json']);
  configFile.write(JSON.stringify(updatedConfig));
}
