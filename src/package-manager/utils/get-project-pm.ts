import { getConfigData } from '../../config/get-config-data.js';
import { PackageJsonError } from '../../errors/package-json.error.js';
import { getPackageJson } from '../../utils/get-package-json.js';
import { defaultManagers } from '../default-managers.js';

import type { PackageManagerInterface } from '../../types/package-manager.types.js';

const supportedManagers = {
  yarn: ['yarn', 'yarnpkg'],
  pnpm: ['pnpm', 'pnpx'],
};

/**
 * Returns a package manager object if
 * ignorePackageManagerProp config option is false and
 * "packageManager" property in package.json is present
 */
export function getProjectPm(): PackageManagerInterface | undefined {
  const { ignorePackageManagerProp } = getConfigData();
  const { packageManager } = getPackageJson();

  if (ignorePackageManagerProp || packageManager == null) {
    return undefined;
  }

  const binaryName = packageManager.split('@')[0];
  const supportedPm = Object.entries(supportedManagers).find(
    ([, binaryNames]) => binaryNames.includes(binaryName),
  );

  if (supportedPm == null) {
    throw new PackageJsonError('Invalid package manager in package.json');
  }

  const [pmName] = supportedPm;
  return defaultManagers[pmName];
}
