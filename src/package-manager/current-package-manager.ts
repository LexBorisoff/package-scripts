import { getConfigData } from '../config/get-config-data.js';
import { PackageJsonError } from '../errors/package-json.error.js';
import { colors, logger } from '../utils/logger.js';

import { getProjectPm } from './utils/get-project-pm.js';

function logDefaultPm(): void {
  const { packageManager } = getConfigData();
  logger.warn(`${packageManager.command} ${colors.gray('(default)')}`);
}

export function currentPackageManager(): void {
  try {
    const pmFromPackageJson = getProjectPm();

    if (pmFromPackageJson != null) {
      logger.warn(
        `${colors.cyan('>')} ${pmFromPackageJson.command} ${colors.gray('(current project)')}`,
      );
    }

    logDefaultPm();
  } catch (error) {
    if (error instanceof PackageJsonError) {
      logDefaultPm();
    } else {
      throw error;
    }
  }
}
