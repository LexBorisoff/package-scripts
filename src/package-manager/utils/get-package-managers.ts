import { getConfigData } from '../../config/get-config-data.js';
import { defaultManagers } from '../default-managers.js';

import type { PackageManagers } from '../../types/package-manager.types.js';

export function getPackageManagers(): PackageManagers {
  const { managers } = getConfigData();
  return { ...defaultManagers, ...managers };
}
