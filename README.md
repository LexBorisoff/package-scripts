# `package-scripts`

![Build](https://img.shields.io/github/actions/workflow/status/LexBorisoff/package-scripts/release.yml)
![NPM Version](https://img.shields.io/npm/v/package-scripts)

CLI to interactively select and run package scripts using any package manager.

- [Installation](#installation)
- [Usage](#usage)
  - [Arguments](#arguments)
  - [Bypassing the selection prompt](#bypassing-the-selection-prompt)
  - [Running the first matched script](#running-the-first-matched-script)
  - [Pass-through arguments](#pass-through-arguments)
- [Package Manager](#package-manager)
  - [Default package manager](#default-package-manager)
  - [Project's package manager](#projects-package-manager)

## Installation

1. Run the following command using **_npx_** from any directory.

```bash
npx package-scripts
```

2. Follow the prompts to set up the command name and select your default package manager.

3. Once the installation process is complete, add the following lines to your shell configuration file.

- For POSIX-compatible shells like bash or zsh

```bash
# ~/.bashrc or ~/.zshrc

if test -d ~/.package-scripts/bin; then
  export PATH=~/.package-scripts/bin:$PATH
fi
```

- For PowerShell

```powershell
# C:\Program Files\PowerShell\7\profile.ps1

if (Test-Path -Path "$env:HOMEPATH\.package-scripts\bin") {
  $env:Path = "$env:HOMEPATH\.package-scripts\bin;$env:Path"
}
```

> 💡 To get the path of your PowerShell configuration file, type `$PROFILE.` and tab through the available options to choose the necessary profile.

4. Restart your shell. The command should now be available.

### How it works

The installation process creates a `~/.package-scripts` directory where it installs the **_core library_** and creates a **_shell script_** that acts as the program's main entry point. The script's directory (`bin`) is added to your PATH, making the script accessible from anywhere in your shell. By giving the script a name that you prefer (or sticking to the default), you control how to invoke the program.

### Renaming the command

You can rename the command later by providing the `--rename` option with the new command name. If the name is not provided, you will be prompted to enter one.

```bash
scripts --rename <new-name>
```

> 📚 All following examples will assume the command name is `scripts`

## Usage

To interactively select and run a script in your current project, run the command you created during the installation. Calling without any arguments or options will display all scripts (except for lifecycle scripts). You can type in the selection menu to filter down your search.

For example:

```bash
scripts
```

```json
{
  "scripts": {
    "prepack": "npm run build",
    "build": "npm run compile",
    "prebuild": "npm run ci && rimraf ./dist",
    "ci": "npm run check-style && npm run check-build",
    "check-style": "npm run format:check && npm run lint",
    "check-build": "npm run compile -- --noEmit",
    "format": "prettier --write \"*.{js,cjs,mjs,ts,cts,mts}\" \"{src,test}/**/*.ts\"",
    "format:check": "prettier --check \"*.{js,cjs,mjs,ts,cts,mts}\" \"{src,test}/**/*.ts\"",
    "lint": "eslint \"{src,test}/**/*.{js,ts}\"",
    "lint:fix": "npm run lint -- --fix",
    "style": "npm run format && npm run lint:fix",
    "compile": "tsc -p tsconfig.json",
    "prepare": "husky"
  }
}
```

<img src="https://github.com/LexBorisoff/package-scripts/blob/main/media/usage.gif?raw=true" alt="usage example" width="1000" />

### Arguments

Supplying command arguments will filter the initial list of displayed scripts. However, you are not limited to the suggested list - you can still type in the prompt menu and select a different script.

For example:

```bash
scripts arg1 arg2 ...
```

### Bypassing the selection prompt

There are cases when the CLI will run a matched script without displaying the selection prompt.

- When a single argument is provided that matches a script **_exactly_** even if there are other scripts containing that argument in their names.
- When a single script is matched based on the provided arguments.

> 💡 The `--select` option can override this behavior and force the display of the selection menu.

For example:

```json
{
  "scripts": {
    "build": "npm run compile",
    "prebuild": "npm run ci && rimraf ./dist",
    "check-build": "npm run compile -- --noEmit"
  }
}
```

```bash
scripts build
```

> 👆 runs the `build` script (exact match)

```bash
scripts build check
```

> 👆 runs the `check-build` script

### Running the first matched script

If there are multiple matched scripts, the `--first` option can be used to run the first script without displaying the selection prompt.

For example:

```json
{
  "scripts": {
    "check-style": "npm run format:check && npm run lint",
    "check-build": "npm run compile -- --noEmit",
    "format:check": "prettier --check \"*.{js,cjs,mjs,ts,cts,mts}\" \"{src,test}/**/*.ts\""
  }
}
```

```bash
scripts check --first
```

> 👆 runs the `check-style` script

### Pass-through arguments

To pass arguments directly to the underlying script, provide them after the double-dash `--`. All arguments passed after `--` will be treated as pass-through arguments.

> ⚠️ If double-dash is not working in your shell, you can also use triple-dash `---`.

For example:

```json
{
  "scripts": {
    "hello": "echo hello"
  }
}
```

```bash
scripts hello -- world
```

<img src="https://github.com/LexBorisoff/package-scripts/blob/main/media/hello-world-1.gif?raw=true" alt="usage example" width="1000" />

Passing arguments to the script also works with the selection prompt:

<img src="https://github.com/LexBorisoff/package-scripts/blob/main/media/hello-world-2.gif?raw=true" alt="usage example" width="1000" />

## Package Manager

The CLI allows you to run scripts by using one of the following package managers:

- npm
- pnpm
- yarn
- bun

> 💡 Use the `--which` option to view which package manager is current being used.

### Default package manager

To set the default package manager for all projects, provide the `--default` option with a package manager name. If no name is provided, you will be prompted to select one.

For example:

```bash
scripts --default pnpm
```

### Project's package manager

Some projects include a `packageManager` property in their `package.json`. The CLI honors it and will run scripts by using this property instead of your default package manager.

You can override this behavior by supplying the package manager that you want to use as a _**flag**_. It will be applied for the _**current script run**_ only and not override the project's package manager completely.

For example, if the project defines that it uses _**yarn**_, you can run a script with _**pnpm**_ as follows:

```bash
scripts --pnpm [SCRIPT]
```

> 💡 If there is no `packageManager` property in `package.json`, you can still use this pattern to override your default package manager.
