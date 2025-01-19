import type { PackageManagerInterface } from '../types/package-manager.types.js';

interface PackageManagers {
  [pm: string]: PackageManagerInterface;
  npm: PackageManagerInterface;
  pnpm: PackageManagerInterface;
  yarn: PackageManagerInterface;
  bun: PackageManagerInterface;
}

export const packageManagers: PackageManagers = {
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
