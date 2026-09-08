# Contributing to @arijitgupta/geo-bounds

Thank you for your interest in contributing. This document covers everything you need to get started.

## Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later

## Setup

```bash
git clone https://github.com/ArijitGupta-in/geo-bounds.git
cd geo-bounds
npm install
```

## Development workflow

| Command | Purpose |
| --- | --- |
| `npm test` | Run the full test suite (Vitest) |
| `npm run check` | Type-check without emitting output |
| `npm run build` | Compile TypeScript to `dist/` |

Run `npm test` and `npm run check` before opening a pull request. Both must pass cleanly.

## Project conventions

### TypeScript

- All source files live under `src/`. Tests sit alongside their subjects (`foo.ts` / `foo.test.ts`).
- The public API is defined entirely in `src/index.ts`. Only symbols re-exported there are part of the contract.
- Internal helpers are module-private (not exported from their file).
- Use `import type` for type-only imports.

### File organisation

| File | Contents |
| --- | --- |
| `src/types.ts` | All exported types and interfaces |
| `src/coordinate.ts` | Coordinate validation and DMS conversion logic |
| `src/getBounds.ts` | Bounding-box calculation |
| `src/index.ts` | Public API barrel |

### No runtime dependencies

This library intentionally has zero runtime dependencies. Do not add any.

### Validation

- Validate all inputs at the public boundary. Throw `Error` when `getBounds` receives no coordinates and `RangeError` for invalid decimal or DMS coordinate values.
- Do not validate internal data that has already been validated at the boundary.

### Tests

- Every new public function needs tests covering: happy-path values, boundary values, and invalid inputs that should throw.
- Keep test descriptions concise and specific (`"throws RangeError for latitude above 90"`, not `"invalid input"`).
- Avoid `as any` in tests except where testing deliberate misuse (e.g. passing an unsupported unit string); use `as never` or `as const` when casting is genuinely necessary.

### Commit messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) style:

```plaintext
feat: add nautical miles unit
fix: correct feet conversion factor
docs: clarify validateCoordinate throws
test: cover longitude boundary at 180°
refactor: extract coordinate helpers
chore: bump vitest to 5.x
```

### Changelog

Update `CHANGELOG.md` for every user-visible change. Add entries under the `[Unreleased]` section above the latest release. Use the categories defined by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/): **Added**, **Changed**, **Deprecated**, **Removed**, **Fixed**, **Security**.

Internal-only changes (refactoring, test additions, build tooling) may be noted under **Internal** but do not require a changelog entry.

## Submitting a pull request

1. Fork the repository and create a branch from `main`.
2. Make your changes, following the conventions above.
3. Run `npm test` and `npm run check` — both must pass.
4. Open a pull request against `main`. Describe *what* changed and *why*.
5. Link any related issue (e.g. `Closes #1`).

## Reporting issues

Use the [issue tracker](https://github.com/ArijitGupta-in/geo-bounds/issues). Include a minimal reproduction and the version you are using.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
