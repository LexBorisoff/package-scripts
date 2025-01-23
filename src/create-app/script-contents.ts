import { PATHS } from '../constants.js';

export const bashScript = `#!/usr/bin/env bash

if test -f "${PATHS.MAIN_FILE}"; then
  # get the script name
  node "${PATHS.MAIN_FILE}" "$@"
  script=$(<"${PATHS.SCRIPT_FILE}")
  arguments=$(<"${PATHS.ARGUMENTS_FILE}")
  package_manager=$(<"${PATHS.PACKAGE_MANAGER_FILE}")

  # clear tmp files
  >"${PATHS.SCRIPT_FILE}"
  >"${PATHS.ARGUMENTS_FILE}"
  >"${PATHS.PACKAGE_MANAGER_FILE}"

  # run the script
  if test -n "$script" && test -n "$package_manager"; then
    if test -n "$arguments"; then
      $package_manager "$script" "$arguments"
    else
      $package_manager "$script"
    fi
  fi

  unset script
  unset arguments
  unset package_manager
fi
`;

export const powershellScript = `#!/usr/bin/env pwsh

if (Test-Path -Path "${PATHS.MAIN_FILE}") {
  # get the script name  
  node "${PATHS.MAIN_FILE}" $args
  $Script = Get-Content -Path "${PATHS.SCRIPT_FILE}" -ErrorAction SilentlyContinue
  $Arguments = Get-Content -Path "${PATHS.ARGUMENTS_FILE}" -ErrorAction SilentlyContinue
  $PackageManager = Get-Content -Path "${PATHS.PACKAGE_MANAGER_FILE}" -ErrorAction SilentlyContinue

  # clear tmp files
  Clear-Content -Path "${PATHS.SCRIPT_FILE}"
  Clear-Content -Path "${PATHS.ARGUMENTS_FILE}"
  Clear-Content -Path "${PATHS.PACKAGE_MANAGER_FILE}"

  # run the script
  if (![string]::IsNullOrEmpty($Script) -and ![string]::IsNullOrEmpty($PackageManager)) {
    if (![string]::IsNullOrEmpty($Arguments)) {
      Invoke-Expression "$PackageManager $Script $Arguments"
    }
    else {
      Invoke-Expression "$PackageManager $Script"
    }
  }
}
`;
