import { updateConfig } from '../config/update-config.js';
import { updateTmp } from '../utils/update-tmp.js';

import {
  selectPackageManager,
  SelectPmReason,
} from './select-package-manager.js';
import { pmLogger } from './utils/pm-logger.js';

export async function usePackageManager(arg: string): Promise<void> {
  const packageManager = await selectPackageManager(SelectPmReason.Update, {
    command: arg,
  });

  if (packageManager == null) {
    return;
  }

  updateConfig({ packageManager });
  updateTmp.packageManager(packageManager);
  pmLogger.use(packageManager);
}
