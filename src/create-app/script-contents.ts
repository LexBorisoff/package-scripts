/* ~~~ BASH ~~~ */
export const bash = (cmdName: string): string => `#!/usr/bin/env bash

${cmdName}() {
  local bin_dir="$(cd "$(dirname "\${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
  local module="$bin_dir/.lib/main.js"
  local script_file="$bin_dir/.tmp/script"
  local manager_file="$bin_dir/.tmp/manager"
  local manager=$(<"$manager_file")

  if test -f "$module"; then
    node "$module" "$@"
    local script=$(<"$script_file")

    # clear temp file
    >"$script_file"

    # run the script
    if test -n "$manager" && test -n "$script"; then
      $manager "$script"
    fi
  fi
}
`;

export const sourceBash = `#!/usr/bin/env bash

current_dir="$(cd "$(dirname "\${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

for file in "$current_dir"/bash/*.sh; do
  if [ -f "$file" ]; then
    . "$file"
  fi
done

unset $current_dir
`;

/* ~~~ POWERSHELL ~~~ */
export const powershell = `#!/usr/bin/env pwsh

$BinDir = Split-Path -Parent $PSCommandPath
$Module = Join-Path -Path $BinDir -ChildPath ".lib/main.js"
$ScriptFile = Join-Path -Path $BinDir -ChildPath ".tmp/script"
$ManagerFile = Join-Path -Path $BinDir -ChildPath ".tmp/manager"

# Check if the module exists
if (Test-Path -Path $Module) {
  node $Module $args
  $Manager = Get-Content -Path $ManagerFile -ErrorAction SilentlyContinue
  $Script = Get-Content -Path $ScriptFile -ErrorAction SilentlyContinue

  # Clear the temp file
  Clear-Content -Path $ScriptFile

  if (![string]::IsNullOrEmpty($Manager) -and ![string]::IsNullOrEmpty($Script)) {
    Invoke-Expression "$Manager $Script"
  }
}
`;
