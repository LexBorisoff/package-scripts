import { getConfigData } from '../config/get-config-data.js';
import { useCoreHooks } from '../hooks/use-core-hooks.js';
import { getPmCommand } from '../package-manager/utils/get-pm-command.js';
import { getProjectPm } from '../package-manager/utils/get-project-pm.js';

function checkTmpDir(): void {
  const rootDir = useCoreHooks((root) => root);
  if (!rootDir.exists('tmp')) {
    rootDir.dirCreate('tmp');
  }
}

export const updateTmp = {
  packageManager(): void {
    checkTmpDir();

    const { packageManager } = getConfigData();
    const projectPm = getProjectPm();
    const pmCommand = getPmCommand(projectPm ?? packageManager);

    const pmFile = useCoreHooks((root) => root.tmp['package-manager']);
    pmFile.write(pmCommand);
  },

  script(script: string): void {
    checkTmpDir();

    const scriptFile = useCoreHooks(({ tmp }) => tmp.script);
    scriptFile.write(script);
  },
};
