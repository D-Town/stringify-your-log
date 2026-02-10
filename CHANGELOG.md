# Changelog

All notable changes to the "stringify-your-log" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2](https://github.com/D-Town/stringify-your-log/compare/v1.0.1...v1.0.2) (2026-02-10)


### Bug Fixes

* Maintenance ([#6](https://github.com/D-Town/stringify-your-log/issues/6)) ([f1a2a47](https://github.com/D-Town/stringify-your-log/commit/f1a2a471b543450f196572a175db7e557cc292ec))

## [1.0.1](https://github.com/D-Town/stringify-your-log/compare/v1.0.0...v1.0.1) (2026-02-10)


### Bug Fixes

* trigger pipeline ([#4](https://github.com/D-Town/stringify-your-log/issues/4)) ([555b348](https://github.com/D-Town/stringify-your-log/commit/555b3482d31e8415412479683020db6ca3bf50d5))

## 1.0.0 (2026-02-10)


### Features

* add extension ([6656a4c](https://github.com/D-Town/stringify-your-log/commit/6656a4c5d1b1c067afc52cd941ed6ac6ae87d8f0))
* add vscode settings ([e4773b0](https://github.com/D-Town/stringify-your-log/commit/e4773b0a2ad033a413a8fefc55f144f49d57a022))
* add workflow and templates ([e412b21](https://github.com/D-Town/stringify-your-log/commit/e412b2105037a3b9dcb40b397153b5202d147233))


### Bug Fixes

* linting and testing ([f91336f](https://github.com/D-Town/stringify-your-log/commit/f91336f754755a170b8bf5c4fb9c773cefe819e7))
* node version during failed test ([8e776b7](https://github.com/D-Town/stringify-your-log/commit/8e776b76b021eaca46a3dc6b4e00b1fa11f22276))
* use correct release-please action (google-github-actions instead of googleapis) ([#2](https://github.com/D-Town/stringify-your-log/issues/2)) ([30de29c](https://github.com/D-Town/stringify-your-log/commit/30de29ca82ecb54b2a36e7f26d5ee973a3caf315))
* use test only on linux and for merge in main only ([0599627](https://github.com/D-Town/stringify-your-log/commit/05996272e2c234e768e11ec5871df95ff789c1e2))

## [Unreleased]

### Added
- Initial release preparation

## [1.0.0] - YYYY-MM-DD

### Added
- Quick logging with `JSON.stringify(variable, null, 2)`
- Support for `console.dir()` output
- Keyboard shortcuts for fast logging
- Support for JavaScript, TypeScript, JSX, and TSX files

### Features
- Context-aware variable detection
- Automatic indentation
- Preserves cursor position
- Works with selected text or word under cursor
