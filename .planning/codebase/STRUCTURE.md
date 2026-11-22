# STRUCTURE.md — Directory Layout and Naming Conventions

**Generated:** 2026-11-22

## Directory Layout

```
salon-app/
├── public/                 # Static assets (images, icons, etc.)
│   └── icons/              # Product and UI icons
├── src/                    # Source code
│   ├── api/                # API client and endpoints
│   ├── assets/             # Brand and theme assets (images, SVGs)
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Layout-level components (AdminLayout, MainLayout)
│   │   └── ui/             # Generic UI components (Button, Card, Modal, etc.)
│   ├── data/               # Static data, constants, and mock data
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and helper classes
│   ├── pages/              # Top-level page components and route targets
│   │   └── admin/          # Admin-specific page components
│   ├── store/              # Zustand global state store
│   └── types/              # Centralized TypeScript type definitions
├── .planning/              # GSD project context, logs, and docs
│   └── codebase/           # Codebase analysis docs (you are here)
├── package.json            # Dependencies, scripts, project configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build and server configuration
```

## Naming Conventions

### Files and Directories

- **Components (`src/components/`)**: `PascalCase.tsx` (e.g., `AdminLayout.tsx`, `Button.tsx`, `ChristmasEffects.tsx`)
- **Pages (`src/pages/`)**: `PascalCase.tsx` ending with `Page.tsx` or prefixed with `Admin` (e.g., `BookingPage.tsx`, `AdminFinancial.tsx`, `ProfileSettings.tsx`)
- **Hooks (`src/hooks/`)**: `camelCase.ts` prefixed with `use` (e.g., `useSalon.ts`)
- **Utilities (`src/lib/`, `src/api/`)**: `camelCase.ts` (e.g., `utils.ts`, `natelieApi.ts`)
- **Types (`src/types/`)**: `index.ts` or `camelCase.ts` (e.g., `index.ts`)
- **Styles**: `index.css`, `App.css` (Tailwind CSS directives + custom utility classes)

### Code / TypeScript Conventions

- **React Components**: Named exports or default exports matching file name (`export default function AdminDashboard()`)
- **State Store**: Named exported hook `useSalonStore` from `src/store/salonStore.ts`
- **Interfaces / Types**: `PascalCase` matching domain entities (e.g., `Service`, `Appointment`, `FinancialRecord`, `User`)
- **Functions / Handlers**: `camelCase` (e.g., `handleSubmit`, `formatCurrency`, `fetchFinancials`)

## Key Locations

| Purpose | Location |
|---|---|
| **App Routes & Outer Layout** | `src/App.tsx` |
| **Global State (Zustand)** | `src/store/salonStore.ts` |
| **API Client & Endpoints** | `src/api/natelieApi.ts` |
| **Admin Shell / Layout** | `src/components/layout/AdminLayout.tsx` |
| **Public Shell / Layout** | `src/components/layout/MainLayout.tsx` |
| **Type Definitions** | `src/types/index.ts` |
| **Shared UI Primitives** | `src/components/ui/` |
| **Mock Data / Fallbacks** | `src/data/mockData.ts` |
| **Stripe Design Tokens & CSS** | `src/index.css` |
