# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [2.0.1] - 2026-10-30

### Changed

- `npm run check` now also type-checks the tests.
- Source maps and declaration maps are no longer generated, because the published package does not include `src`.

### Added

- GitHub Actions CI on Node.js 22, 24, and 26: Markdown lint, type-check, tests with an 80% coverage threshold, and build.
- `test:coverage` and `lint:md` scripts, `tsconfig.test.json`, and `vitest.config.ts`.
- `publishConfig.access: "public"` in `package.json`.
- Tests for duplicate coordinates and for longitudes at `-180` and `180`.

### Internal

- `getBounds` makes a single pass over the coordinates and drops unreachable `undefined` guards. Behavior is unchanged.
- The re-export tests were reduced to a smoke test; validation and conversion behavior is tested in geo-core.
- Removed the stray `.markdownlint copy.json` and reformatted `package.json` with four-space indentation.

## [2.0.0] - 2026-10-30

### Breaking changes

- DMS degrees and minutes must be integers; values with fractional degrees or
  minutes that were accepted by 1.x are rejected. Fractional seconds remain valid.
- Invalid DMS directions now throw `TypeError`.
- Non-finite decimal coordinate values now throw `TypeError` instead of `RangeError`.
- DMS values representing zero now convert to positive zero, including south/west zero.

### Changed

- Use `@arijitgupta/geo-core` v1.0.0 for shared coordinate types, conversion,
  normalization, and validation.

---

## [1.0.0] - 2026-09-08

### Added

- `getBounds(coordinates)` - calculates the smallest geographic bounding box containing one or more coordinates.
- `Bounds` type with `north`, `south`, `east`, and `west` limits.
- Decimal-degree and Degrees, Minutes, Seconds (DMS) coordinate support, including mixed formats in one input array.
- `dmsToDecimal` and `validateCoordinate` functions exported from the public API.
- Antimeridian-aware longitude bounds, including deterministic handling of equal longitude gaps and the `-180`/`180` meridian.
- ESM-only package with full TypeScript declarations.
- `exports` field in `package.json` for package resolution.
- `prepublishOnly` script to type-check, test, and build before publishing.

[1.0.0]: https://github.com/ArijitGupta-in/geo-bounds/releases/tag/v1.0.0
[2.0.0]: https://github.com/ArijitGupta-in/geo-bounds/releases/tag/v2.0.0
