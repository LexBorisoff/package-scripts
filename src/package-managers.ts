import type { PackageManagerInterface } from './types/package-manager.types.js';

export const packageManagers: Record<string, PackageManagerInterface> = {
  npm: {
    command: 'npm',
    run: 'run',
    install: 'install',
  },
  pnpm: {
    command: 'pnpm',
    run: 'run',
    install: 'add',
  },
  yarn: {
    command: 'yarn',
    run: 'run',
    install: 'add',
  },
};
