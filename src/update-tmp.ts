import { getConfigData } from './config/get-config-data.js';
import { useCoreHooks } from './hooks/use-core-hooks.js';
import { getProjectPm } from './package-manager/utils/get-project-pm.js';
import { args } from './utils/args.js';
import { getArgs } from './utils/get-args.js';

function checkTmpDir(): void {
  const rootDir = useCoreHooks((root) => root);
  if (!rootDir.exists('tmp')) {
    rootDir.dirCreate('tmp');
  }
}

const { use } = args;

export function updateTmp(script: string): void {
  checkTmpDir();

  const scriptFile = useCoreHooks(({ tmp }) => tmp.script);
  const argumentsFile = useCoreHooks(({ tmp }) => tmp.arguments);
  const pmFile = useCoreHooks((root) => root.tmp['package-manager']);

  const { passThroughArgs } = getArgs();
  const currentPm = use != null && use !== '' ? use : undefined;
  const projectPm = getProjectPm();
  const { packageManager: configPm } = getConfigData();
  const pm = currentPm ?? projectPm ?? configPm;

  scriptFile.write(script);
  argumentsFile.write(passThroughArgs.join(' '));
  pmFile.write(`${pm} run`);
}
