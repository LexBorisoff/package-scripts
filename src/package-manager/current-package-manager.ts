import { getConfigData } from '../config/get-config-data.js';
import { PackageJsonError } from '../errors/package-json.error.js';
import { colors, logger } from '../utils/logger.js';

import { getProjectPm } from './utils/get-project-pm.js';

function logDefaultPm(): void {
  const { packageManager } = getConfigData();
  logger.warn(`${packageManager} ${colors.gray('(default)')}`);
}

export function currentPackageManager(): void {
  try {
    const projectPm = getProjectPm();
    if (projectPm != null) {
      logger.warn(`${projectPm} ${colors.gray('(current project)')}`);
    }
  } catch (error) {
    if (!(error instanceof PackageJsonError)) {
      throw error;
    }
  } finally {
    logDefaultPm();
  }
}
