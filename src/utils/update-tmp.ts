import { getConfigData } from '../config/get-config-data.js';
import { useCoreHooks } from '../hooks/use-core-hooks.js';
import { defaultManagers } from '../package-manager/default-managers.js';
import { getPmCommand } from '../package-manager/utils/get-pm-command.js';
import { getProjectPm } from '../package-manager/utils/get-project-pm.js';

import { args } from './args.js';

function checkTmpDir(): void {
  const rootDir = useCoreHooks((root) => root);
  if (!rootDir.exists('tmp')) {
    rootDir.dirCreate('tmp');
  }
}

const { use } = args;

export const updateTmp = {
  packageManager(): void {
    checkTmpDir();

    const currentPm =
      use != null && use !== '' ? defaultManagers[use] : undefined;
    const projectPm = getProjectPm();
    const { packageManager: configPm } = getConfigData();

    const pmCommand = getPmCommand(currentPm ?? projectPm ?? configPm);
    const pmFile = useCoreHooks((root) => root.tmp['package-manager']);
    pmFile.write(pmCommand);
  },

  script(script: string): void {
    checkTmpDir();

    const scriptFile = useCoreHooks(({ tmp }) => tmp.script);
    scriptFile.write(script);
  },
};
