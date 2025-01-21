import type { PackageManagerInterface } from './package-manager.types.js';

export interface ConfigInterface {
  /**
   * Executable script name
   */
  command: string;
  /**
   * Current package manager
   */
  packageManager: PackageManagerInterface;
  /**
   * Package managers other than default ones
   */
  managers: Record<string, PackageManagerInterface>;
  /**
   * Ignore `packageManager` property in package.json
   */
  ignorePackageManagerProp: boolean;
}
