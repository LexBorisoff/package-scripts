import { PATHS } from '../constants.js';

import type { PackageManagerInterface } from '../types/package-manager.types.js';

const pmCommand = ({ command, run }: PackageManagerInterface): string =>
  `${command}${run !== '' ? ` ${run}` : ''}`;

export const bashFunction = (
  functionName: string,
  packageManager: PackageManagerInterface,
): string => `#!/usr/bin/env bash

${functionName}() {
  if test -f "${PATHS.MAIN_FILE}"; then
    # get the script name
    node "${PATHS.MAIN_FILE}" "$@"
    local script=$(<"${PATHS.SCRIPT_FILE}")
    
    # clear script file
    >"${PATHS.SCRIPT_FILE}"

    # run the script
    if test -n "$script"; then
      ${pmCommand(packageManager)} "$script"
    fi
  fi
}
`;

export const bashScript = (
  packageManager: PackageManagerInterface,
): string => `#!/usr/bin/env bash

if test -f "${PATHS.MAIN_FILE}"; then
  # get the script name
  node "${PATHS.MAIN_FILE}" "$@"
  script=$(<"${PATHS.SCRIPT_FILE}")
  
  # clear script file
  >"${PATHS.SCRIPT_FILE}"

  # run the script
  if test -n "$script"; then
    ${pmCommand(packageManager)} "$script"
    unset $script
  fi
fi
`;

export const powershellScript = (
  packageManager: PackageManagerInterface,
): string => `#!/usr/bin/env pwsh

if (Test-Path -Path "${PATHS.MAIN_FILE}") {
  # get the script name  
  node "${PATHS.MAIN_FILE}" $args
  $Script = Get-Content -Path "${PATHS.SCRIPT_FILE}" -ErrorAction SilentlyContinue

  # clear script file
  Clear-Content -Path "${PATHS.SCRIPT_FILE}"

  # run the script
  if (![string]::IsNullOrEmpty($Script)) {
    Invoke-Expression "${pmCommand(packageManager)} $Script"
  }
}
`;
