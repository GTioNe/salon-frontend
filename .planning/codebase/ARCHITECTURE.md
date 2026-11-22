# Architecture

**Analysis Date:** 2026-11-22

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Frontend SPA (React)                     │
│  ┌─────────────────┐  ┌─────────────────────────────────┐ │
│  │  Public Routes  │  │        Admin Routes               │ │
│  │  (MainLayout)   │  │  (AdminLayout)                    │ │
│  │  └── /          │  │  └── /admin                       │ │
│  │  └── /agendar   │  │  └── /admin/agenda                │ │
│  │  └── /servicos  │  │  └── /admin/financeiro            │ │
│  │  └── /perfil    │  │  └── /admin/clientes              │ │
│  └─────────────────┘  │  └── /admin/servicos              │ │
                       │  └── /admin/ajustes              │ │
                       └───────────────┬───────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     Zustand Global State                      │
│  (`src/store/salonStore.ts`)                                  │
│  State: services, professionals, clients, appointments        │
│  UI: isDarkMode, sidebarOpen                                 │
│  Actions: CRUD + computed metrics                            │
└─────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (`src/api/natelieApi.ts`)      │
│  Base URL: VITE_API_URL env var || http://localhost:3001/api │
│  Fetch wrapper with ngrok-skip-browser-warning header        │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| **App** | Root router with BrowserRouter, Routes, public vs admin branch | `src/App.tsx` |
| **MainLayout** | Header, Footer, motion-animated section container with Outlet for public routes | `src/components/layout/MainLayout.tsx` |
| **AdminLayout** | Sidebar nav, top header, main content area with Outlet for admin routes | `src/components/layout/AdminLayout.tsx` |
| **AdminDashboard** | KPI strip (revenue, appointments, new clients) + quick-action buttons | `src/pages/admin/AdminDashboard.tsx` |
| **Zion Salon Store** | Global Zustand state with localStorage persistence, API base URL, all CRUD actions | `src/store/salonStore.ts` |
| **API Client** | fetch wrapper for all backend calls (`/api/services`, `/api/slots`, `/api/reserve`, etc.) | `src/api/natelieApi.ts` |
| **useAppointments / useServices / useProfessionals / useClients** | React hooks that read from + sync with Zustand store | `src/hooks/useSalon.ts` |
| **UI Kit** | Button, Card, Input, Modal, Select, Avatars, etc. shared across layouts | `src/components/ui/` |
| **Type Layer** | TypeScript interfaces: Service, Professional, Client, Appointment, Status enums | `src/types/index.ts` |

## Pattern Overview

**Overall:** SPA with layered architecture — Presentation → Routing → State Management → API → Mock/Data

**Key Characteristics:**
- React 19 + React Router 7 + Vite 5
- Zustand 5 for global state (with persist middleware to localStorage)
- Unified layout pattern: MainLayout for public, AdminLayout for admin area
- All admin navigation flows through AdminLayout sidebar + Outlet
- API base URL is configured once in store and shared across fetch calls
- Type-safe data layer with shared `src/types/index.ts`

## Layers

**[Presentation Layer]:**
- Purpose: UI rendering, layout, navigation
- Location: `src/components/layout/`, `src/pages/`, `src/components/ui/`
- Contains: MainLayout, AdminLayout, all page components, UI widgets
- Depends on: React Router, Zustand, Lucide icons, Tailwind CSS
- Used by: App router, user navigation

**[State Management Layer]:**
- Purpose: Global state, persistence, API base URL, computed metrics
- Location: `src/store/salonStore.ts`
- Contains: SalonState interface, create store with persist middleware, all actions and getters
- Depends on: zustand, zustand/middleware, types
- Used by: useSalon hooks, page components via `useSalonStore()`

**[API Layer]:**
- Purpose: Remote communication with backend, request formatting
- Location: `src/api/natelieApi.ts`
- Contains: fetch wrapper, API base resolution, all endpoint functions (services, slots, reserve, confirm, cancel)
- Depends on: env vars (VITE_API_URL), fetch API
- Used by: useSalonStore getAvailableSlots, could be used by any component

**[Routing Layer]:**
- Purpose: SPA routing, layout switching, route guarding
- Location: `src/App.tsx`
- Contains: BrowserRouter, Routes, public routes (MainLayout), admin routes (AdminLayout), Navigate fallback
- Depends on: react-router-dom
- Used by: All page components

## Data Flow

### Primary Request Path

1. **App** renders `<BrowserRouter>` → `<Routes>` (`src/App.tsx:1-39`)
2. Route match determines layout:
   - Public routes → `<MainLayout />` with nested routes (`src/App.tsx:19-24`)
   - Admin routes → `<AdminLayout />` with nested routes (`src/App.tsx:27-36`)
3. **Layout renders Outlet** (`src/components/layout/MainLayout.tsx:133` / `AdminLayout.tsx:133`)
4. Nested page component mounts
5. Page hooks use `useSalonStore()` to read/store data (`src/hooks/useSalon.ts`)
6. Store actions dispatch Zustand state changes, possibly calling `fetchApi()` (`src/store/salonStore.ts:12-22`)
7. `fetchApi()` resolves base URL from `import.meta.env.VITE_API_URL` or default, fetches from `${baseUrl}/api...` (`src/api/natelieApi.ts`)

### [Secondary Flow: Slot Lookup]

1. Component calls `useAvailableSlots(date, profId, duration)` (`src/hooks/useSalon.ts:91-114`)
2. Hook reads `getAvailableSlots` from store (`src/store/salonStore.ts:217-232`)
3. `getAvailableSlots` calls `fetchApi<string[]>(/api/slots/...)` (`src/store/salonStore.ts:225`)
4. `fetchApi` resolves base URL, constructs endpoint, performs fetch (`src/store/salonStore.ts:12-22`)

### State Management:

- Global state stored in Zustand store with localStorage persistence
- Partialize saves: services, professionals, clients, appointments, isDarkMode, sidebarOpen
- Computed `getDashboardMetrics` derives revenue, appointment counts, occupancy rate from store state
- UI toggles (dark mode, sidebar) use simple setState patterns

## Key Abstractions

**[SalonState]:**
- Purpose: Centralized global state for all salon data and UI flags
- Examples: `src/store/salonStore.ts` (full state interface + store creation)
- Pattern: Zustand `create()` with `persist` middleware + `partialize`

**[fetchApi]:**
- Purpose: Unified fetch wrapper with API base URL injection
- Examples: `src/store/salonStore.ts:12-22`, `src/api/natelieApi.ts`
- Pattern: Higher-order function that prepends base URL, adds ngrok skip header

## Entry Points

**[App]:**
- Location: `src/App.tsx`
- Triggers: App initialization, root route render
- Responsibilities: Sets up React Router, defines public vs admin route branches, selects layout per branch

## Architectural Constraints

- **Threading:** Single-threaded JavaScript event loop (standard React/Vite development)
- **Global state:** Zustand store with persist middleware using localStorage — data survives page reload
- **Circular imports:** None detected; `src/store/salonStore.ts` imports types but not UI; hooks import store and types — no cycles
- **[Other constraint]:** API base URL derived from `VITE_API_URL` env var with fallback to `http://localhost:3001` — must match backend base path

## Anti-Patterns

### [Over-fetching in useSalonStore]

**What happens:** The `SalonState` interface includes all appointment/service/professional/client arrays plus UI flags in a single store. While convenient, any component importing `useSalonStore` triggers a subscription re-render for *all* state changes, even unrelated ones (e.g., toggling dark mode causes all components subscribed to services to re-render).

**Why it's wrong:** Can cause unnecessary re-renders across the app as state grows.

**Do this instead:** Split store into domain-specific stores (e.g., separate services store, appointments store) or use selectors more granularly. Currently acceptable for app scale, but worth monitoring.

### [Hardcoded default API URL]

**What happens:** `getApiBase()` in `src/store/salonStore.ts:6-10` defaults to `http://localhost:3001` when `VITE_API_URL` is not set. If deployed without the env var, all API calls fail silently (caught and re-thrown as generic errors).

**Why it's wrong:** Production deployment requires the env var; there's no graceful degradation path.

**Do this instead:** Ensure `VITE_API_URL` is always set in production, or add a runtime warning/fallback to a known staging endpoint.

## Error Handling

**Strategy:** Errors from `fetchApi()` are thrown as `Error` objects with status/message. Individual endpoints (`fetchServices`, `reserveAppointment`, etc.) catch and re-throw with domain-specific messages. UI components catch these with try/catch and display error states (not shown in current code, but pattern is established).

**Patterns:**
- `try { const data = await fetchApi(...) } catch (e) { setError((e as Error).message) }`
- `useAvailableSlots` catches fetch errors and returns `[]` instead of propagating (graceful degradation for non-critical data)

## Cross-Cutting Concerns

**Logging:** `console.error` used in `useSalonStore.getAvailableSlots` (line 228) and `fetchApi` (line 20) for API failures. No centralized logging service configured.

**Validation:** Manual validation via regex (`validateCPF`, `validatePhone`, `validateEmail` in `src/lib/utils.ts`) and form-level checks. No centralized Zod/yup validation schema observed.

**Authentication:** Not implemented in current codebase. Admin layout assumes authenticated user; no auth guard or token management visible. Route protection relies on AdminLayout being server-side or handled externally.

**Environment:** `VITE_API_URL` env var required for production API calls. Defined in `.env*` files (not present in repo; likely at build/deploy time).

---

*Architecture analysis: 2026-11-22*