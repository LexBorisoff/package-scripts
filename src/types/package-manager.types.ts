export interface PackageManagerInterface {
  command: string;
  run: string;
}

export interface PackageManagers {
  [pm: string]: PackageManagerInterface;
  npm: PackageManagerInterface;
  pnpm: PackageManagerInterface;
  yarn: PackageManagerInterface;
  bun: PackageManagerInterface;
}
