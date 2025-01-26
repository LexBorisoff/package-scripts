import { PACKAGE_MANAGERS } from '../../constants.js';

export interface PackageManagerChoice {
  title: string;
  value: string;
}

export function getPmChoices(): PackageManagerChoice[] {
  const choices = Object.values(PACKAGE_MANAGERS).map((value) => ({
    title: value,
    value,
  }));

  return choices;
}
