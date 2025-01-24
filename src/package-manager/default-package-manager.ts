import { updateConfig } from '../config/update-config.js';
import { logger } from '../utils/logger.js';

import {
  selectPackageManager,
  SelectPmReason,
} from './select-package-manager.js';

export async function defaultPackageManager(arg: string): Promise<void> {
  const packageManager = await selectPackageManager(SelectPmReason.Update, arg);

  if (packageManager == null) {
    return;
  }

  updateConfig({ packageManager });
  logger.log(
    `Set ${logger.severity.warn(packageManager)} as the default package manager`,
  );
}
