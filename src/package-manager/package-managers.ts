import type { PackageManagerInterface } from './package-manager.types.js';

export const packageManagers: Record<string, PackageManagerInterface> = {
  npm: {
    command: 'npm',
    run: 'run',
  },
  pnpm: {
    command: 'pnpm',
    run: 'run',
  },
  yarn: {
    command: 'yarn',
    run: 'run',
  },
  bun: {
    command: 'bun',
    run: 'run',
  },
};
