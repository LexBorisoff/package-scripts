import { args } from './args.js';
import { getConfigData } from './config/get-config-data.js';
import { useCoreActions } from './filetree/core-actions.js';
import { getProjectPm } from './package-manager/utils/get-project-pm.js';
import { getArgs } from './utils/get-args.js';

const { passThroughArgs } = getArgs();
const { npm, pnpm, yarn, bun } = args;

let currentPm: string | undefined = undefined;
if (npm) {
  currentPm = 'npm';
} else if (pnpm) {
  currentPm = 'pnpm';
} else if (yarn) {
  currentPm = 'yarn';
} else if (bun) {
  currentPm = 'bun';
}

export function updateTmp(script: string): void {
  // make sure tmp folder exists
  const rootDir = useCoreActions((root) => root);
  if (!rootDir.exists('tmp')) {
    rootDir.dirCreate('tmp');
  }

  const scriptFile = useCoreActions(({ tmp }) => tmp.script);
  const argumentsFile = useCoreActions(({ tmp }) => tmp.arguments);
  const pmFile = useCoreActions((root) => root.tmp['package-manager']);

  const pm = currentPm ?? getProjectPm() ?? getConfigData().packageManager;

  scriptFile.write(script);
  argumentsFile.write(passThroughArgs.join(' '));
  pmFile.write(`${pm} run`);
}
