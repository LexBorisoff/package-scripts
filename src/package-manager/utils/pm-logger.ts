import { logger } from '../../utils/logger.js';

import type { PackageManagerInterface } from '../../types/package-manager.types.js';

export const pmLogger = {
  use(packageManager: PackageManagerInterface) {
    logger.log(
      `Using ${logger.severity.warn(packageManager.command)} package manager`,
    );
  },
  remove(managers: string[]) {
    logger.log(
      `Removed ${logger.severity.warn(managers.join(', '))} from package managers`,
    );
  },
};
