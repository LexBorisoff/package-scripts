type ScriptType = 'bash' | 'powershell';

export function getScriptNames(command: string): Record<ScriptType, string> {
  return {
    bash: command,
    powershell: `${command}.ps1`,
  };
}
