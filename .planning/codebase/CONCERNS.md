# Codebase Concerns

**Analysis Date:** 2026-11-22

## Tech Debt

**[No Admin Authentication]:**
- Issue: Admin routes (`/admin`, `/admin/*`) have no authentication guard. Direct access works without login.
- Files: `src/App.tsx` (lines 27-35), `src/components/layout/AdminLayout.tsx` (no auth check)
- Impact: Anyone can navigate to the admin portal; no protection for admin-only data and actions
- Fix approach: Add auth state check before rendering AdminLayout; implement login flow or session guard

**[Mock Data Dependency]:**
- Issue: Zustand store initializes with MOCK_SERVICES, MOCK_PROFESSIONALS, MOCK_CLIENTS, MOCK_APPOINTMENTS. Admin pages fall back to local/demo data when API fails.
- Files: `src/store/salonStore.ts` (lines 85-88), `src/pages/admin/AdminPage.tsx` (lines 29-65, 64: "Usando dados locais de demonstração"), `src/pages/admin/AdminFinancial.tsx` (lines 37-38)
- Impact: Admin dashboard shows placeholder data; financial data only visible with active ngrok; client list shows "Exibidos via API / Admin local"
- Fix approach: Replace default mock imports with real API fetch logic; ensure empty/fallback states are intentional, not accidental

**[ngrok Tunnel Dependency]:**
- Issue: All API calls include `ngrok-skip-browser-warning` header. Frontend production connectivity depends on ngrok tunnel being active. Vercel deployment uses `VITE_API_URL=https://cocoa-oblivion-throng.ngrok-free.dev`.
- Files: `src/api/natelieApi.ts` (lines 5, 13, 36, 49, 59), `src/store/salonStore.ts` (lines 17, 59), `src/pages/admin/AdminFinancial.tsx` (line 8)
- Impact: If ngrok tunnel expires, all API calls fail; financeiro page shows error "Não foi possível conectar ao servidor. Verifique se o backend e o ngrok estão ativos."
- Fix approach: Make API base URL configurable via environment; add fallback to localhost for development; document ngrok renewal process

**[LocalStorage Persistence Without Encryption]:**
- Issue: Zustand persist middleware uses localStorage without encryption. User data (appointments, clients, services) stored as plain JSON.
- Files: `src/store/salonStore.ts` (lines 272-281)
- Impact: Sensitive data (client names, phone numbers, appointment details) stored unencrypted in browser storage
- Fix approach: Add encryption layer (e.g., crypto-js) or switch to sessionStorage with explicit clearing; assess data sensitivity

**[Type Safety — `as any` Usage]:**
- Issue: Several files use `as any` type assertions circumventing TypeScript checks.
- Files: `src/api/natelieApi.ts` (line 31: `extra?: Record<string, any>`), `src/store/salonStore.ts` (line 58: `p.specialties.includes(specialty as any)`), `src/pages/ServicesPage.tsx` (line 190: `as any`), `src/hooks/useSalon.ts` (line 58)
- Impact: Reduced type safety; potential runtime errors hidden from compiler
- Fix approach: Replace with proper types or partial types; add type narrowing where needed

**[ProfileSettings UTF-8 Encoding Issue]:**
- Issue: HANDOFF.md notes "O arquivo apresenta caracteres portugueses corrompidos (`Configura����es`, etc.); corrigir a codificação UTF-8 antes de publicar."
- Files: `src/pages/ProfileSettings.tsx`
- Impact: Display corruption if browser/editor defaults to different encoding; user-facing text may appear broken
- Fix source: Ensure file is saved as UTF-8 without BOM; verify `index.html` charset and Vite config

**[No Test Coverage]:**
- Issue: No test files found (`*.test.ts`, `*.spec.tsx`). Quality gates rely solely on `npm run build` and `npm run lint`.
- Files: None in `src/`
- Impact: Regressions in admin flows, booking wizard, or API changes go undetected; manual build verification only
- Fix approach: Add Vitest + React Testing Library; write unit tests for store actions, component validation, API mock responses

## Risks

**[Ngrok Tunnel Expiry — Production Blocking]:**
- Risk: The ngrok-free tunnel URL is temporary. If it expires, the Vercel-deployed frontend cannot reach the local backend API, rendering reservation, slot lookup, and financial data features inoperable.
- Files: `vercel.json`, `vite.config.ts`, `src/api/natelieApi.ts`, `src/pages/admin/AdminFinancial.tsx`
- Impact: Published site loses backend connectivity; bookings cannot be confirmed; financial data cannot load; appointments API returns errors
- Mitigation: Document ngrok renewal process; consider adding a secondary tunnel or proxy; make API URL fully configurable

**[Admin Panel Unauthorized Access]:**
- Risk: No authentication on `/admin` routes. Any user who discovers the admin URL can access the full admin portal, view client data, modify financial records, and manage services without restriction.
- Files: `src/App.tsx` (lines 27-35), `src/components/layout/AdminLayout.tsx`
- Impact: Data leakage, unauthorized modifications, potential abuse of admin functions
- Mitigation: Implement auth guard (check token/session before rendering AdminLayout); add login page; restrict to known users

**[Backend Not in Repo — Single Point of Failure]:**
- Risk: `server.js` is not present in the frontend directory. The backend process on `localhost:3001` with SQLite is external to this repo. If the backend goes down, the entire frontend functionality is lost.
- Files: `README.md` (lines 29-30), `src/store/salonStore.ts` (line 7), `src/api/natelieApi.ts` (line 1)
- Impact: No frontend feature works without the backend; deployments to Vercel rely on the tunnel to a local process
- Mitigation: Include backend in repo or document exact deployment requirements; consider mock/resilient frontend mode

**[Financeiro Page Completely ngrok-Dependent]:**
- Risk: `AdminFinancial.tsx` makes API call to `/api/admin/financials` with ngrok header. If ngrok is offline, the entire finance page shows error state and no data is visible.
- Files: `src/pages/admin/AdminFinancial.tsx` (lines 7-8, 37-38)
- Impact: Financial operations completely blocked when ngrok not active; no offline fallback; bookkeeping interrupted
- Mitigation: Add localStorage/cache fallback for financial data; implement periodic sync when connection restores; add warning UI explaining ngrok requirement

**[WhatsApp Number Hardcoded]:**
- Risk: WhatsApp contact number `5511947609116` is hardcoded across multiple files (`BookingPage.tsx`, `HomePage.tsx`). Any change to the salon's WhatsApp requires updating every occurrence.
- Files: `src/pages/BookingPage.tsx` (line 226: `https://wa.me/5511947609116`), `src/pages/HomePage.tsx` (line 20: `https://wa.me/5511947609116`)
- Impact: Contact change requires coordinated multi-file update; risk of missed occurrences
- Fix approach: Extract to single environment variable or constant; add search for all occurrences on change

## Pending Items

**[Implement Admin Authentication Guard]:**
- Action: Add auth state check in `AdminLayout.tsx` or `App.tsx` before rendering admin routes. Consider adding a simple login page or session token check.
- Priority: High — security concern; currently anyone can access admin panel
- Blockers: No auth backend defined; decide on approach (simple password, token-based, or integrate with future backend)

**[Replace Mock Data with Real API Calls in Store]:**
- Action: Modify `src/store/salonStore.ts` to not default to MOCK_SERVICES/MOCK_PROFESSIONALS/MOCK_CLIENTS/MOCK_APPOINTments on first load. Either fetch from API on init or provide clear opt-in mock mode.
- Priority: Medium — mock data masks real API issues; admin pages show placeholder data
- Blockers: Backend API not fully defined in this repo; coordinate with backend team

**[Fix ProfileSettings UTF-8 Encoding]:**
- Action: Ensure `src/pages/ProfileSettings.tsx` is saved as UTF-8 without BOM. Verify editor/IDE settings. Check for any non-ASCII characters in strings.
- Priority: Low — cosmetic, but mentioned in HANDOFF.md as blocker before publish
- Blockers: None identified; standard UTF-8 file save

**[Add API Endpoint for Admin Settings Persistence]:**
- Action: Implement real API routes for saving salon info, hours, and settings. Currently AdminSettings changes only update local state, not API/localStorage persistently.
- Priority: Medium — settings lost on refresh; no persistence layer
- Blockers: Backend `server.js` not in repo; define contract first

**[Extract WhatsApp Number to Config]:**
- Action: Move `PIX_KEY` and WhatsApp number to environment variable or constant file. Update all references.
- Priority: Low — maintenance concern
- Blockers: None

**[Add Unit Tests]:**
- Action: Add Vitest + React Testing Library tests for: store actions (CRUD on services/appointments), booking wizard validation, admin page data fetching, API error handling.
- Priority: Medium — improve confidence on changes; currently zero test coverage
- Blockers: None beyond tooling setup

**[Decide `/perfil` Route Purpose]:**
- Action: Clarify if `/perfil` is client profile, admin profile, or both. Currently in public layout with no auth protection.
- Priority: Medium — route semantics and auth alignment
- Blockers: None identified

---
*Concerns audit: 2026-11-22*