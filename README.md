# Divvy

A device-local PWA for splitting restaurant bills by item ownership.

## Commands

```bash
npm run dev
npm run check
```

## Architecture

- `app/` contains the route, providers, metadata, and global styles.
- `features/bill/components/` mirrors the runtime component tree.
- `features/bill/model/` contains schemas, state transitions, and pure calculations.
- `features/bill/hooks/` owns client lifecycle integration.
- `features/bill/repositories/` is the IndexedDB persistence boundary.

Imports flow from routes to features, then from components to hooks/model/repositories. Monetary values are stored as integer cents and allocated deterministically.
