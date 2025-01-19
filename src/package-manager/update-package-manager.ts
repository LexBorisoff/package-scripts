import { useCoreHooks } from '../hooks/use-core-hooks.js';

import { getPmCommand } from './get-pm-command.js';

import type { PackageManagerInterface } from '../types/package-manager.types.js';

export function updatePackageManager(
  packageManager: PackageManagerInterface,
): void {
  const pmFile = useCoreHooks((root) => root.tmp['package-manager']);
  const pmCommand = getPmCommand(packageManager);
  pmFile.write(pmCommand);
}
