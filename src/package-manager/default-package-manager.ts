import { updateConfig } from '../config/update-config.js';

import {
  selectPackageManager,
  SelectPmReason,
} from './select-package-manager.js';
import { pmLogger } from './utils/pm-logger.js';

export async function defaultPackageManager(arg: string): Promise<void> {
  const packageManager = await selectPackageManager(SelectPmReason.Update, {
    command: arg,
  });

  if (packageManager == null) {
    return;
  }

  updateConfig({ packageManager });
  pmLogger.use(packageManager);
}
