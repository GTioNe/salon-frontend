# CONCERNS.md — Technical Debt and Issues

**Generated:** 2026-11-22

## Critical Issues

### 1. UTF-8 Encoding Corruption (`HIGH`)

- **File**: `src/pages/ProfileSettings.tsx`
- **Problem**: Portuguese characters are corrupted (e.g., `Configura����es`). The file is likely encoded in a non-UTF-8 encoding (ISO-8859-1 / Windows-1252) or was written with a broken encoding.
- **Impact**: Broken UI text; potential build failures if TypeScript parser chokes on invalid sequences.
- **Fix**: Convert the file to UTF-8 and replace corrupted strings with correct Portuguese text. Then run `npm run build`.

### 2. No Authentication on Admin Routes (`HIGH`)

- **Problem**: `/admin`, `/admin/agenda`, `/admin/financeiro`, etc. are publicly accessible. Any visitor can view and mutate admin data (including financial transactions).
- **Impact**: Data leakage and unauthorized financial operations.
- **Fix**: Add an auth guard (route protection + login flow) before exposing admin routes. Do not mark admin as "ready" until this exists.

### 3. Financial API Persistence Unverified (`HIGH`)

- **Problem**: `AdminFinancial.tsx` does `POST /api/admin/financials` and then optimistically adds the object to local state after `res.ok`. It is unconfirmed whether the backend actually persists the record to SQLite or returns the persisted entity/ID.
- **Impact**: Financial records may appear saved in the UI but be lost on reload.
- **Fix**: Verify backend behavior (check response body, reload the list). Confirm the backend persists and returns the record. Do not claim "saved" until verified.

### 4. Backend / Ngrok Availability (`HIGH`)

- **Problem**: The backend `server.js` is not in this repo. The ngrok tunnel (`https://cocoa-oblivion-throng.ngrok-free.dev`) can expire at any time. The Vercel env var `VITE_API_URL` may point to a dead tunnel.
- **Impact**: Financial data fails to load; no error surfaced to the user.
- **Fix**: Before any frontend changes related to finance, verify backend + tunnel status. Add explicit error states when the API is unreachable.

## Medium Issues

### 5. Placeholder Settings & Profile Persistence (`MEDIUM`)

- **Files**: `src/pages/admin/AdminSettings.tsx`, `src/pages/ProfileSettings.tsx`
- **Problem**: Forms update local component state and show a visual "saved" confirmation, but nothing persists (no API call, no localStorage).
- **Impact**: Users believe their settings/profile are saved; data is lost on refresh.
- **Fix**: Either wire up real persistence (API or localStorage) or remove the "saved" claim and mark the UI as non-functional.

### 6. Ambiguous `/perfil` Ownership (`MEDIUM`)

- **Problem**: `/perfil` sits in the public layout. It is unclear whether it is the client's profile or the admin's profile. If it is meant for admins, it should be inside `AdminLayout`.
- **Impact**: Wrong audience sees the page; admin-only data could leak.
- **Fix**: Decide the owner. If client → keep in public layout. If admin → move route under `/admin` and into `AdminLayout`.

### 7. Bundle Size Warning (`MEDIUM`)

- **Problem**: `npm run build` warns the bundle exceeds 500 kB.
- **Impact**: Slower initial load; potential mobile performance issues.
- **Fix**: Investigate large dependencies (e.g., `date-fns` full import, `framer-motion`). Use tree-shaking, code-splitting, or lighter alternatives.

### 8. Design Drift (`MEDIUM`)

- **Problem**: User explicitly wants structural UX/layout evolution, not just color swaps. Recent work has been token changes (Stripe design system).
- **Impact**: If only colors change, the user will be unsatisfied.
- **Fix**: Prioritize layout/UX improvements (spacing, hierarchy, navigation, mobile ergonomics) over color-only changes.

## Low / Informational

### 9. Uncommitted Local Work

- **Files**: `src/App.tsx`, `src/components/layout/AdminLayout.tsx`, `src/index.css`, `src/pages/admin/AdminDashboard.tsx`, `src/pages/admin/AdminFinancial.tsx`, `src/pages/admin/AdminSettings.tsx`, `src/pages/ProfileSettings.tsx`
- **Problem**: These contain recent, uncommitted work. `git status --short` shows them as modified/untracked.
- **Fix**: Do not reset/checkout. Review the diff, build, test, then commit atomically.

### 10. Mock Data Reliance

- **File**: `src/data/mockData.ts`
- **Problem**: Some UI flows may still fall back to mock data rather than live API data.
- **Impact**: Users see fake data; trust issues.
- **Fix**: Audit each page. Replace mock fallbacks with real API data where the backend supports it; keep mocks only for loading/empty states.

### 11. TypeScript / ESLint Drift

- **Problem**: Build currently passes, but there is no confirmation that linting and type-checking are enforced in CI.
- **Fix**: Add `npm run lint` and `npm run type-check` to CI if a pipeline exists.

## Summary of Priority Order

1. Fix UTF-8 in `ProfileSettings.tsx` + run build.
2. Verify financial API persistence (backend + ngrok).
3. Decide `/perfil` ownership; relocate if admin-only.
4. Wire real persistence for settings/profile or remove false "saved" claims.
5. Add auth guard for admin routes.
6. Address bundle size.
7. Structural UX work (not color-only).
8. Commit reviewed changes atomically.

**Rule**: Never declare a feature "done" if it is local state, a placeholder, or `alert()`-only. Validate at trust boundaries and verify persistence.