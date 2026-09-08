# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

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
