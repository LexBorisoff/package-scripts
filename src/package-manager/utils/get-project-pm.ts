import { getPackageJson } from '../../utils/get-package-json.js';
import { defaultManagers } from '../default-managers.js';

import type { PackageManagerInterface } from '../../types/package-manager.types.js';

/**
 * Returns a package manager object based on
 * `packageManager` property in package.json,
 * `undefined` otherwise
 */
export function getProjectPm(): PackageManagerInterface | undefined {
  const { packageManager } = getPackageJson();

  if (packageManager == null) {
    return undefined;
  }

  const pmName = packageManager.split('@')[0];
  return defaultManagers[pmName];
}
