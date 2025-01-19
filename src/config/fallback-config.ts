import { INITIAL_COMMAND } from '../constants.js';
import { packageManagers } from '../package-manager/package-managers.js';

import type { ConfigInterface } from '../types/config.types.js';

export const fallbackConfig: ConfigInterface = {
  command: INITIAL_COMMAND,
  packageManager: packageManagers.npm,
  usePackageManager: true,
};
