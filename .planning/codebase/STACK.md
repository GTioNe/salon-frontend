# STACK.md — Tech Stack

**Generated:** 2026-11-22

## Languages

- TypeScript: `tsc` for type checking and compilation
- JavaScript: `esbuild` for bundling (Vite)

## Runtime

- Node.js: `v20.x` (verified via `package.json engines` or `node --version`)
- Browser: Standard DOM APIs via Vite

## Frameworks

- **React**: `18.3.x` — UI library
- **Vite**: `5.4.x` — Build tool and dev server
- **Zustand**: `4.5.x` — State management
- **React Router**: `6.24.x` — Routing

## Dependencies (from package.json)

### Production

- `lucide-react`: `0.453.0` — Icon library
- `date-fns`: `3.6.0` — Date utilities
- `framer-motion`: `11.5.0` — Animation library

### Development

- `vite`: `5.4.x` — Build tool
- `typescript`: `5.6.x` — Type checking
- `eslint`: `8.x` — Linting
- `prettier`: `3.3.x` — Code formatting

## Dev Tools

- **npm scripts**: `dev`, `build`, `preview`
- **Vite plugins**: React plugin, `svgr` for SVG components

## Configuration Files

- `package.json` — Project metadata and scripts
- `tsconfig.json` — TypeScript configuration
- `vitest.config.ts` or `jest.config.ts` — Test configuration (if present)
- `eslint.config.js` — ESLint configuration
- `.prettierrc` or `prettier.config.ts` — Prettier configuration

## Build Command

```bash
npm run build
```

Output: `dist/` directory (SPA with client-side routing)