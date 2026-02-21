# Stringify Your Log

[![Version](https://img.shields.io/visual-studio-marketplace/v/dtown.stringify-your-log?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=dtown.stringify-your-log)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/dtown.stringify-your-log?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=dtown.stringify-your-log)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/dtown.stringify-your-log?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=dtown.stringify-your-log)
[![Build Status](https://img.shields.io/github/actions/workflow/status/D-Town/stringify-your-log/test.yml?branch=main&style=flat-square)](https://github.com/D-Town/stringify-your-log/actions)
[![License](https://img.shields.io/github/license/D-Town/stringify-your-log?style=flat-square)](LICENSE)



A VS Code extension for JavaScript and TypeScript that inserts readable debug logs fast.

This extension is designed for backend workflows where you want predictable output in the terminal and the VS Code debug console.

## Quick Start

### Hotkeys

- macOS: `Option + Command + L` -> Insert pretty log (short)
- macOS: `Option + Command + Shift + L` -> Insert pretty log (full)
- Windows/Linux: `Ctrl + Alt + L` -> Insert pretty log (short)
- Windows/Linux: `Ctrl + Alt + Shift + L` -> Insert pretty log (full)

### Completion Shortcuts

Type one of these in JS/TS files and pick the completion item:

- `stringify`
- `slog` (short)
- `slogf` (full)

Note: Completion mode inserts `VALUE_TO_LOG` as a placeholder when no variable is selected.

## Features

- Insert a pretty log for the selected variable or expression
- Short and Full variants with clear start/end markers
- Predictable placement: inserts the log directly in the next line
- Context-aware headers with source line and source file
- Output modes:
  - `JSON.stringify(..., null, 2)` for copyable, pretty JSON
  - `console.dir(..., { depth, colors })` for Node-style inspection (supports colored output depending on terminal/debug console)

## Usage

### Commands

- **Stringify Your Log: Insert pretty log**  
  Command ID: `stringify-your-log.logJson`

- **Stringify Your Log: Insert pretty log (Full)**  
  Command ID: `stringify-your-log.logJsonFull`

### Default Keybindings

- macOS: `Option + Command + L` -> Insert pretty log
- macOS: `Option + Command + Shift + L` -> Insert full log
- Windows/Linux: `Ctrl + Alt + L` -> Insert pretty log
- Windows/Linux: `Ctrl + Alt + Shift + L` -> Insert full log

Note: These shortcuts may conflict with other extensions or OS bindings. If they do, change them in  
`Preferences -> Keyboard Shortcuts`.

### How the variable is chosen

Hotkey commands use this order:

1. Selected text (preferred)
2. The word under the cursor (identifier)
3. A prompt asking for a variable or expression

Completion commands (`stringify`, `slog`, `slogf`) use this order:

1. Selected text (preferred)
2. The word under the cursor (identifier)
3. `VALUE_TO_LOG` placeholder

Examples of valid expressions:

- `user`
- `payload.items`
- `response.data`
- `ctx.req.body`

## Output Examples

### Mode: stringify

Short:

```js
console.log("Log from line 49 in file src/services/user.ts");
console.log(JSON.stringify(foo, null, 2));
```

Full:

```js
console.log("🚀 Log from line 49 in file src/services/user.ts");
console.log(JSON.stringify(foo, null, 2));
console.log("🔚 End log from line 49 in file src/services/user.ts");
```

### Mode: dir (Node/terminal oriented)

Short:

```js
console.log("Log from line 49 in file src/services/user.ts");
console.dir(foo, { depth: null, colors: true });
```

Full:

```js
console.log("🚀 Log from line 49 in file src/services/user.ts");
console.dir(foo, { depth: null, colors: true });
console.log("🔚 End log from line 49 in file src/services/user.ts");
```

## Settings

Open VS Code Settings and search for **Stringify Your Log**, or edit your `settings.json`.

### `stringifyYourLog.outputMode`

Choose the output style.

* `stringify` (default): uses `JSON.stringify(variable, null, 2)`
* `dir`: uses `console.dir(variable, { depth, colors })`

Example:

```json
{
  "stringifyYourLog.outputMode": "dir"
}
```

### `stringifyYourLog.dirDepth`

Controls inspection depth for `console.dir`.

* `null` (default): unlimited depth
* number: limit the depth, e.g. `5`

Example:

```json
{
  "stringifyYourLog.dirDepth": 5
}
```

### `stringifyYourLog.dirColors`

Enables/disables colored output for `console.dir`.

* `true` (default)
* `false`

Example:

```json
{
  "stringifyYourLog.dirColors": true
}
```

## Notes on colored output

`console.dir(..., { colors: true })` is a Node feature. Whether colors appear depends on your environment:

* Terminal: usually yes
* VS Code debug console: often yes, but can vary by debug adapter and settings

Browser devtools are not a target for this extension.

## Example: Recommended Backend Configuration

For Node.js / backend development, this configuration is recommended.

It enables `console.dir` with colors and unlimited depth.

Add the following to your **VS Code `settings.json`**:

```json
{
  "stringifyYourLog.outputMode": "dir",
  "stringifyYourLog.dirColors": true,
  "stringifyYourLog.dirDepth": null
}
```

### What this configuration does

* **outputMode: `dir`**
  Uses `console.dir` instead of `JSON.stringify`.
  Better for inspecting complex objects and circular references in Node.

* **dirColors: `true`**
  Enables colored output in supported terminals and VS Code debug consoles.

* **dirDepth: `null`**
  Prints the full object tree with unlimited depth.
