# Stringify Your Log

[![Version](https://img.shields.io/visual-studio-marketplace/v/YOUR_PUBLISHER.vscode-pretty-log-js-ts)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.vscode-pretty-log-js-ts)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/YOUR_PUBLISHER.vscode-pretty-log-js-ts)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.vscode-pretty-log-js-ts)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/YOUR_PUBLISHER.vscode-pretty-log-js-ts)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.vscode-pretty-log-js-ts)
[![Build Status](https://github.com/D-Town/vscode-pretty-log-js-ts/actions/workflows/test.yml/badge.svg)](https://github.com/D-Town/vscode-pretty-log-js-ts/actions)
[![License](https://img.shields.io/github/license/D-Town/vscode-pretty-log-js-ts)](LICENSE)


A VS Code extension for JavaScript and TypeScript that inserts readable debug logs fast.

This extension is designed for backend workflows where you want predictable output in the terminal and the VS Code debug console.

## Features

- Insert a pretty log for the selected variable or expression
- Optional “Full” log variant with header and footer markers
- Smart placement: inserts the log after the enclosing block (useful inside `map`, `forEach`, `if`, `try`, etc.)
- Output modes:
  - `JSON.stringify(..., null, 2)` for copyable, pretty JSON
  - `console.dir(..., { depth, colors })` for Node-style inspection (supports colored output depending on terminal/debug console)

## Usage

### Commands

- **Stringify Your Log: Insert pretty log**  
  Command ID: `stringify-your-log.logJson`

- **Stringify Your Log: Insert pretty log (Full)**  
  Command ID: `stringify-your-log.logJsonFull`

### Default Keybindings (macOS)

- `cmd + alt + l` → Insert pretty log
- `cmd + alt + shift + l` → Insert full log

Note: These shortcuts may conflict with other extensions or OS bindings. If they do, change them in  
`Preferences -> Keyboard Shortcuts`.

### How the variable is chosen

The extension uses the first available option:

1. Selected text (preferred)
2. The word under the cursor (identifier)
3. A prompt asking for a variable or expression

Examples of valid expressions:

- `user`
- `payload.items`
- `response.data`
- `ctx.req.body`

## Output Examples

### Mode: stringify

Short:

```js
console.log(JSON.stringify(foo, null, 2));
````

Full:

```js
console.log(`🚀 Log for: ${foo}`);
console.log(JSON.stringify(foo, null, 2));
console.log('🔚');
```

### Mode: dir (Node/terminal oriented)

Short:

```js
console.dir(foo, { depth: null, colors: true });
```

Full:

```js
console.log(`🚀 Log for: ${foo}`);
console.dir(foo, { depth: null, colors: true });
console.log('🔚');
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

### `stringifyYourLog.smartPlacement`

When enabled, the extension tries to insert logs after the current enclosing block instead of at the cursor position.
This is especially useful when your cursor is inside a callback block:

```js
const foo = bar.map(x => {
  // many lines
  // cursor somewhere here
});
```

With smart placement enabled, the log will be inserted after the block.

* `true` (default)
* `false`

Example:

```json
{
  "stringifyYourLog.smartPlacement": true
}
```

## Notes on colored output

`console.dir(..., { colors: true })` is a Node feature. Whether colors appear depends on your environment:

* Terminal: usually yes
* VS Code debug console: often yes, but can vary by debug adapter and settings

Browser devtools are not a target for this extension.

## Example: Recommended Backend Configuration

For Node.js / backend development, this configuration is recommended.

It enables `console.dir` with colors, unlimited depth, and smart placement after blocks.

Add the following to your **VS Code `settings.json`**:

```json
{
  "stringifyYourLog.outputMode": "dir",
  "stringifyYourLog.dirColors": true,
  "stringifyYourLog.dirDepth": null,
  "stringifyYourLog.smartPlacement": true
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

* **smartPlacement: `true`**
  Inserts logs *after* the current enclosing block (for example after `map`, `forEach`, `if`, `try` blocks) instead of inside them.
