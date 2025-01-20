import type {
  PackageManagerChoice,
  PackageManagerInterface,
} from '../../types/package-manager.types.js';

export const NEW_PM_OPTION = 'NEW_PACKAGE_MANAGER';

export function getPmChoices(
  managers: Record<string, PackageManagerInterface>,
  addNewOption: boolean = true,
): PackageManagerChoice[] {
  const choices = Object.values(managers).map(({ command }) => ({
    title: command,
    value: command,
  }));

  if (addNewOption) {
    choices.push({ title: '[Add New Package Manager]', value: NEW_PM_OPTION });
  }

  return choices;
}
