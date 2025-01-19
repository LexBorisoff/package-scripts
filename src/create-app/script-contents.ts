import { PATHS } from '../constants.js';

export const bashFunction = (
  functionName: string,
): string => `#!/usr/bin/env bash

${functionName}() {
  if test -f "${PATHS.MAIN_FILE}"; then
    local package_manager=$(<"${PATHS.PACKAGE_MANAGER_FILE}")

    # get the script name
    node "${PATHS.MAIN_FILE}" "$@"
    local script=$(<"${PATHS.SCRIPT_FILE}")
    
    # clear script file
    >"${PATHS.SCRIPT_FILE}"

    # run the script
    if test -n "$script"; then
      $package_manager "$script"
    fi
  fi
}
`;

export const bashScript = `#!/usr/bin/env bash

if test -f "${PATHS.MAIN_FILE}"; then
  package_manager=$(<"${PATHS.PACKAGE_MANAGER_FILE}")

  # get the script name
  node "${PATHS.MAIN_FILE}" "$@"
  script=$(<"${PATHS.SCRIPT_FILE}")

  # clear script file
  >"${PATHS.SCRIPT_FILE}"

  # run the script
  if test -n "$script"; then
    $package_manager "$script"
    unset $package_manager
    unset $script
  fi
fi
`;

export const powershellScript = `#!/usr/bin/env pwsh

if (Test-Path -Path "${PATHS.MAIN_FILE}") {
  $PackageManager = Get-Content -Path "${PATHS.PACKAGE_MANAGER_FILE}" -ErrorAction SilentlyContinue

  # get the script name  
  node "${PATHS.MAIN_FILE}" $args
  $Script = Get-Content -Path "${PATHS.SCRIPT_FILE}" -ErrorAction SilentlyContinue

  # clear script file
  Clear-Content -Path "${PATHS.SCRIPT_FILE}"

  # run the script
  if (![string]::IsNullOrEmpty($Script)) {
    Invoke-Expression "$PackageManager $Script"
  }
}
`;
