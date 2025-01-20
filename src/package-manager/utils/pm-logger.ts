import chalk from 'chalk';

import { logger } from '../../utils/logger.js';

import type { PackageManagerInterface } from '../../types/package-manager.types.js';

export const pmLogger = {
  use(packageManager: PackageManagerInterface) {
    logger.success(
      `Using ${chalk.cyan(packageManager.command)} package manager`,
    );
  },
  remove(managers: string[]) {
    logger.success(
      `Removed ${chalk.cyan(managers.join(', '))} from package managers`,
    );
  },
};
