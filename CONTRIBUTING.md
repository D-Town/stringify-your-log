# Contributing to Pretty Log JS/TS

First off, thanks for taking the time to contribute! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include as many details as possible using our bug report template.

### Suggesting Features

Feature suggestions are tracked as GitHub issues. Use the feature request template and provide:
- Clear description of the problem
- Proposed solution
- Alternative solutions considered

### Pull Requests

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

#### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add console.dir support
fix: cursor position after insertion
docs: update README with new shortcuts
```

## Development Setup

### Prerequisites

- Node.js 18.x or higher
- VSCode 1.85.0 or higher
- Git

### Local Development
```bash
# Clone the repo
git clone https://github.com/D-Town/vscode-pretty-log-js-ts.git
cd vscode-pretty-log-js-ts

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch

# Run tests
npm test
```

### Testing Your Changes

1. Press `F5` in VSCode to open Extension Development Host
2. Test your changes in the new window
3. Check the Debug Console for errors

### Code Style

- Use TypeScript
- Follow existing code patterns
- Add comments for complex logic
- Keep functions small and focused

## Project Structure
```
.
├── src/
│   ├── extension.ts      # Main extension entry point
│   └── test/             # Tests
├── .github/
│   ├── workflows/        # CI/CD workflows
│   └── ISSUE_TEMPLATE/   # Issue templates
├── package.json          # Extension manifest
└── README.md
```

## Release Process

Releases are automated via GitHub Actions:

1. Update `CHANGELOG.md`
2. Bump version: `npm version [major|minor|patch]`
3. Push with tags: `git push --follow-tags`
4. GitHub Actions will automatically publish

## Questions?

Feel free to open an issue with the "question" label.

## Code of Conduct

Be respectful and constructive in all interactions.