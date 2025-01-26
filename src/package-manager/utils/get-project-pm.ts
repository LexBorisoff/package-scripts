import { getPackageJson } from '../../utils/get-package-json.js';

/**
 * Returns a package manager object based on
 * `packageManager` property in package.json,
 * `undefined` otherwise
 */
export function getProjectPm(): string | undefined {
  const { packageManager } = getPackageJson();
  return packageManager?.split('@')[0];
}
