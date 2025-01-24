import { defaultManagers } from '../default-managers.js';

import type { PackageManagerChoice } from '../../types/package-manager.types.js';

export function getPmChoices(): PackageManagerChoice[] {
  const choices = Object.values(defaultManagers).map(({ command }) => ({
    title: command,
    value: command,
  }));

  return choices;
}
