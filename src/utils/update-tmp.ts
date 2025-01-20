import { useCoreHooks } from '../hooks/use-core-hooks.js';
import { getPmCommand } from '../package-manager/utils/get-pm-command.js';

import type { PackageManagerInterface } from '../types/package-manager.types.js';

export const updateTmp = {
  packageManager(packageManager: PackageManagerInterface): void {
    const pmFile = useCoreHooks((root) => root.tmp['package-manager']);
    const pmCommand = getPmCommand(packageManager);
    pmFile.write(pmCommand);
  },
  script(script: string): void {
    const scriptFile = useCoreHooks(({ tmp }) => tmp.script);
    scriptFile.write(script);
  },
};
