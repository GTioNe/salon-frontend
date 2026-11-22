# Codebase Structure

**Analysis Date:** 2026-11-22

## Directory Layout

```
salon-app/
├── src/
│   ├── api/
│   │   └── natelieApi.ts      # API integration functions (services, slots, reserve, confirm, cancel)
│   ├── assets/
│   │   ├── hero.png           # Hero section images and icons
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx # Admin portal wrapper with sidebar and top header
│   │   │   ├── Footer.tsx     # Public footer with brand info, contact, and hours
│   │   │   ├── Header.tsx     # Public sticky header with brand and booking CTA
│   │   │   ├── MainLayout.tsx # Public layout container with Header, Footer, Outlet
│   │   │   └── index.ts       # Layout barrel export
│   │   ├── ui/
│   │   │   ├── Avatar.tsx     # User avatar component
│   │   │   ├── Badge.tsx      # Status badges
│   │   │   ├── Button.tsx     # Reusable button component
│   │   │   ├── Card.tsx       # Card container components
│   │   │   ├── Input.tsx      # Input fields and textareas
│   │   │   ├── Modal.tsx      # Modal / ConfirmDialog components
│   │   │   ├── Select.tsx     # Custom select dropdown
│   │   │   ├── Separator.tsx  # Divider lines
│   │   │   ├── Skeleton.tsx   # Loading placeholders
│   │   │   ├── Tabs.tsx       # Tab navigation
│   │   │   ├── Tooltip.tsx    # Tooltips
│   │   │   └── index.ts       # UI component barrel export
│   │   ├── ChristmasEffects.tsx # Seasonal decoration widget
│   │   └── HandBraidingInline.tsx # Interactive braiding feature
│   ├── data/
│   │   └── mockData.ts        # Mock services, professionals, clients, appointments
│   ├── hooks/
│   │   └── useSalon.ts        # Custom React hooks (useAppointments, useServices, useClients, useAvailableSlots, etc.)
│   ├── lib/
│   │   └── utils.ts           # Utility functions (formatting, validation, WhatsApp link generation)
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminAgenda.tsx    # Admin appointment scheduling calendar
│   │   │   ├── AdminClients.tsx   # Admin client management table
│   │   │   ├── AdminDashboard.tsx # Admin metrics and today's appointments
│   │   │   ├── AdminFinancial.tsx # Admin financial reports and revenue charts
│   │   │   ├── AdminPage.tsx      # Admin entry point/overview
│   │   │   ├── AdminReports.tsx   # Analytics and reports
│   │   │   ├── AdminServices.tsx  # Service catalogue management
│   │   │   └── AdminSettings.tsx  # Salon settings and business hours
│   │   ├── BookingPage.tsx    # Public appointment booking flow
│   │   ├── HomePage.tsx       # Landing page with hero, services preview, reviews
│   │   ├── ProfileSettings.tsx # Client profile and booking history
│   │   └── ServicesPage.tsx   # Full catalogue of salon services
│   ├── store/
│   │   └── salonStore.ts      # Zustand global state (services, professionals, clients, appointments, UI)
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces and constants (Service, Professional, Client, etc.)
│   ├── App.css
│   ├── App.tsx                # Root component with BrowserRouter and route declarations
│   ├── index.css              # Tailwind and custom theme CSS rules
└── package.json
```

## Directory Purposes

**`src/api/`:**
- Purpose: Network calls and backend integration for Nateliê Hair backend
- Contains: `natelieApi.ts` for service fetching, slot reservation, and appointment management
- Key files: `src/api/natelieApi.ts`

**`src/components/`:**
- Purpose: Reusable UI elements, layout wrappers, and feature-specific components
- Contains: `layout/`, `ui/`, and feature components
- Key files: `src/components/layout/MainLayout.tsx`, `src/components/layout/AdminLayout.tsx`

**`src/data/`:**
- Purpose: Static mock data for services, professionals, and initial state
- Contains: `mockData.ts`
- Key files: `src/data/mockData.ts`

**`src/hooks/`:**
- Purpose: Custom React hooks for data access, state syncing, debouncing, and local storage
- Contains: `useSalon.ts`
- Key files: `src/hooks/useSalon.ts`

**`src/lib/`:**
- Purpose: Shared utility functions for currency, date formatting, validation, WhatsApp link generators
- Contains: `utils.ts`
- Key files: `src/lib/utils.ts`

**`src/pages/`:**
- Purpose: Screen-level components representing application routes
- Contains: Public pages (Home, Booking, Services, Profile) and admin portal pages (`admin/`)
- Key files: `src/pages/HomePage.tsx`, `src/pages/BookingPage.tsx`, `src/pages/admin/AdminDashboard.tsx`

**`src/store/`:**
- Purpose: Global state management using Zustand
- Contains: `salonStore.ts`
- Key files: `src/store/salonStore.ts`

**`src/types/`:**
- Purpose: Shared TypeScript interfaces, types, and constants
- Contains: `index.ts`
- Key files: `src/types/index.ts`

## Key File Locations

**Entry Points:**
- `src/main.tsx`: React DOM root mounting point
- `src/App.tsx`: Router configuration and layout switcher

**Configuration:**
- `package.json`: Project dependencies, scripts (dev, build, lint)
- `vite.config.ts`: Vite build and plugin configuration
- `tsconfig.json`: TypeScript configuration

**Core Logic & State:**
- `src/store/salonStore.ts`: Zustand store with persistence and API sync
- `src/hooks/useSalon.ts`: Custom hooks wrapping store and API interactions

**Testing:**
- Not detected (No unit or E2E testing framework configured in `package.json`)

## Naming Conventions

**Files:**
- PascalCase for React components and page files: `AdminDashboard.tsx`, `BookingPage.tsx`, `MainLayout.tsx`
- camelCase for hooks, utilities, stores, and API clients: `useSalon.ts`, `utils.ts`, `salonStore.ts`, `natelieApi.ts`

**Directories:**
- lowercase for all primary source directories: `api`, `assets`, `components`, `data`, `hooks`, `lib`, `pages`, `store`, `types`
- lowercase with specific grouping: `admin/` for admin portal pages

## Where to Add New Code

**New Feature (Page):**
- Primary code: `src/pages/[FeatureName].tsx`
- Routing: Add route in `src/App.tsx` under either `MainLayout` (public) or `AdminLayout` (admin)

**New Component/Module:**
- Implementation: `src/components/[category]/[ComponentName].tsx`
- Export: Add to `src/components/[category]/index.ts`

**New State / Action:**
- Implementation: Extend `SalonState` interface and store definition in `src/store/salonStore.ts`

**New API Endpoint:**
- Implementation: Add function to `src/api/natelieApi.ts` or `src/store/salonStore.ts` fetch wrapper

**Utilities:**
- Shared helpers: Add to `src/lib/utils.ts`

## Special Directories

**`src/components/ui/`:**
- Purpose: Reusable design system primitives (Button, Card, Input, Modal, etc.)
- Generated: No
- Committed: Yes

**`src/pages/admin/`:**
- Purpose: Admin management portal screens
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-11-22*