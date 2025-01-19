import type { PackageManagerInterface } from './package-manager.types.js';

export interface ConfigInterface {
  command: string;
  packageManager: PackageManagerInterface;
  managers: Record<string, PackageManagerInterface>;
}
