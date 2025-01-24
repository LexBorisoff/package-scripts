import { getConfigData } from '../config/get-config-data.js';
import { colors, logger } from '../utils/logger.js';

import { getProjectPm } from './utils/get-project-pm.js';

function logDefaultPm(withProjectPm = false): void {
  const spaces = ' '.repeat(withProjectPm ? 2 : 1);
  const { packageManager } = getConfigData();
  logger.warn(`${packageManager}${spaces}${colors.gray('(default)')}`);
}

export function currentPackageManager(): void {
  try {
    const projectPm = getProjectPm();
    if (projectPm != null) {
      logger.warn(`${projectPm} ${colors.gray('(current project)')}`);
    }

    logDefaultPm(projectPm != null);
  } catch {
    logDefaultPm();
  }
}
