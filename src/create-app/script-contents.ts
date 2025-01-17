import type { PmInterface } from '../types/pm.types.js';

const withRun = (run?: string): boolean => run != null && run !== '';
const pmRun = ({ pm, run }: PmInterface): string =>
  `${pm}${withRun(run) ? ` ${run}` : ''}`;

/* ~~~ BASH ~~~ */
interface BashOptions extends PmInterface {
  command: string;
}

export const bash = ({
  command,
  pm,
  run,
}: BashOptions): string => `#!/usr/bin/env bash

${command}() {
  local current_dir="$(cd "$(dirname "\${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
  local module="$current_dir/.dist/main.js"
  local script_file="$current_dir/tmp/script"

  if test -f "$module"; then
    node "$module" "$@"
    local script=$(<"$script_file")
    
    # clear script file
    >"$script_file"

    # run the script
    if test -n "$script"; then
      ${pmRun({ pm, run })} "$script"
    fi
  fi
}
`;

// TODO: placed in bin and added to PATH
const bashScript = `#!/usr/bin/env bash

current_dir="$(cd "$(dirname "\${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

if test -f "$current_dir/.dist/main.js"; then
  node "$current_dir/.dist/main.js" "$@"
  script=$(<"$current_dir/.tmp/script")

  # clear script file
  >"$current_dir/.tmp/script"

  # run the script
  if test -n "$script"; then
    npm run "$script"
    unset $script
  fi
fi

unset $current_dir
`;

/* ~~~ POWERSHELL ~~~ */
export const powershell = (pm: PmInterface): string => `#!/usr/bin/env pwsh

$CurrentDir = Split-Path -Parent $PSCommandPath
$Module = Join-Path -Path $CurrentDir -ChildPath ".dist/main.js"
$ScriptFile = Join-Path -Path $CurrentDir -ChildPath ".tmp/script"

# Check if the module exists
if (Test-Path -Path $Module) {
  node $Module $args
  $Script = Get-Content -Path $ScriptFile -ErrorAction SilentlyContinue

  # clear script file
  Clear-Content -Path $ScriptFile

  if (![string]::IsNullOrEmpty($Script)) {
    Invoke-Expression "${pmRun(pm)} $Script"
  }
}
`;
