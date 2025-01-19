import { updateConfig } from '../config/update-config.js';

import {
  selectPackageManager,
  SelectPmReason,
} from './select-package-manager.js';
import { updatePackageManager } from './update-package-manager.js';

/**
 * @param command package manager command
 */
export async function handlePackageManager(command: string): Promise<void> {
  const packageManager = await selectPackageManager(
    SelectPmReason.Update,
    command,
  );

  if (packageManager == null) {
    return;
  }

  updateConfig({ packageManager });
  updatePackageManager(packageManager);
}
