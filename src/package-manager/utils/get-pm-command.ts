import type { PackageManagerInterface } from '../../types/package-manager.types.js';

export function getPmCommand({
  command,
  run,
}: PackageManagerInterface): string {
  return `${command}${run !== '' ? ` ${run}` : ''}`;
}
