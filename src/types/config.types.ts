import type { PackageManagerInterface } from './package-manager.types.js';

export interface ConfigInterface {
  command: string;
  packageManager: PackageManagerInterface;
  usePackageManager: boolean;
}
