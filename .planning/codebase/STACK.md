# Technology Stack

**Analysis Date:** 2026-11-22

## Languages

**Primary:**
- TypeScript `~7.0.2` - Main frontend codebase in `src/` (`.ts` and `.tsx` components, pages, stores, and API definitions)

**Secondary:**
- JavaScript (ES Modules / Node.js) - Node.js backend runtime (`server.js`, external to this frontend repo) and build/tooling configuration (`postcss.config.js`)
- CSS3 / PostCSS - Global styles, custom design tokens, and utility classes (`src/index.css`, `postcss.config.js`)

## Runtime

**Environment:**
- Node.js (v18+ recommended) - Frontend Vite dev server / build environment and local backend runtime
- Web Browser (Modern SPA) - Target runtime for deployed React frontend on Vercel

**Package Manager:**
- npm (Node Package Manager)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React `^19.3.1` - UI framework (`src/App.tsx`, `src/pages/`, `src/components/`)
- React Router DOM `^7.18.5` - Client-side SPA routing (`src/App.tsx`)
- Express (Node.js) - Lightweight HTTP server handling SQLite persistence and WhatsApp integration (`server.js`)

**Testing & Quality:**
- Oxlint `^1.89.0` - Fast JS/TS linter configured via `.oxlintrc.json`
- TypeScript Compiler `tsc -b` - Build-time static type checking (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`)

**Build & Dev Tools:**
- Vite `^8.3.5` - Frontend bundler and HMR dev server (`vite.config.ts`)
- `@vitejs/plugin-react` `^6.1.2` - React plugin for Vite (`vite.config.ts`)
- PostCSS `^8.5.32` & Tailwind CSS PostCSS plugin `@tailwindcss/postcss` `^4.3.4` - CSS processing pipeline

## Key Dependencies

**UI & Styling:**
- Tailwind CSS `^4.3.4` - Utility-first styling framework configured via `@theme` tokens (`src/index.css`)
- Lucide React `^1.66.0` - Icon library used across public pages and admin layout (`src/components/layout/Header.tsx`, `src/components/layout/AdminLayout.tsx`)
- Framer Motion `^14.9.0` - UI animations and transition effects (`src/components/ChristmasEffects.tsx`, `src/pages/HomePage.tsx`)
- clsx `^2.1.1` & tailwind-merge `^3.7.0` - Conditional class name merging utilities (`src/lib/utils.ts`)

**State & Forms:**
- Zustand `^5.0.16` - Global application state management with `persist` middleware to `localStorage` (`src/store/salonStore.ts`)
- React Hook Form `^7.91.0` - Form state handling (`package.json`)
- Zod `^4.6.7` & `@hookform/resolvers` `^7.0.1` - Schema validation library (`package.json`)
- date-fns `^4.4.0` - Date manipulation and formatting helper (`src/pages/admin/AdminAgenda.tsx`)

## Configuration

**Environment:**
- Frontend Environment Variables loaded via Vite (`import.meta.env.VITE_API_URL`)
- Default API Fallback: `http://localhost:3001` when `VITE_API_URL` is omitted (`src/store/salonStore.ts`, `src/api/natelieApi.ts`)

**Build Configurations:**
- `vite.config.ts` - Vite React plugin configuration
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` - TypeScript compiler configurations
- `vercel.json` - SPA route rewrites (`/.*` -> `/index.html`)
- `.oxlintrc.json` - Linter rule overrides

## Platform Requirements

**Development:**
- Local Node.js v18+ environment running Vite (`npm run dev`)
- Express backend process (`server.js`) running on port `3001` with SQLite database file
- Ngrok agent forwarding local port `3001` to secure HTTPS tunnel URL (`https://cocoa-oblivion-throng.ngrok-free.dev`)

**Production:**
- Frontend: Deployed on Vercel (`salon-frontend-opal.vercel.app`)
- Backend: Local hybrid server exposed via active Ngrok tunnel or cloud host

---

*Stack analysis: 2026-11-22*
