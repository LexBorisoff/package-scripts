import type { PackageManagers } from '../types/package-manager.types.js';

export const defaultManagers: PackageManagers = {
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
