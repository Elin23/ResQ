# ResQ Stage 19 — Final Clean Release

This archive is packaged inside its own top-level folder to prevent stale files from older extractions being retained.

## Important

Extract this archive into a new empty location. Do not merge it over an older ResQ directory.

## Validation

- `src/components/ui/StatusBadge.tsx` is not included.
- No empty source files were found by the project integrity checker.
- Local import, asset, and route checks are handled by `npm run check:integrity`.

## Run

```bash
npm install
npm run check
npx expo start
```
