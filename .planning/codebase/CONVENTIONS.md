# Coding Conventions

**Analysis Date:** 2026-11-22

## Naming Patterns

**Files:**
- Components and Pages: PascalCase (`BookingPage.tsx`, `AdminDashboard.tsx`, `Button.tsx`)
- Hooks: camelCase starting with `use` (`useSalon.ts`)
- Stores: camelCase (`salonStore.ts`)
- Utilities/APIs: camelCase (`utils.ts`, `natelieApi.ts`)

**Functions:**
- camelCase (`formatCurrency`, `getAvailableSlots`, `validateStep`)
- Event handlers: prefixed with `handle` or inline lambdas (`handleSubmit`, `onNext`, `onSelectServices`)

**Variables & Constants:**
- Constants: UPPER_SNAKE_CASE for global constants (`API_BASE`, `PIX_KEY`, `MOCK_SERVICES`, `STEPS`)
- Local state and props: camelCase (`selectedServices`, `clientData`, `currentStep`)

**Types & Interfaces:**
- PascalCase for TypeScript interfaces and types (`ClientData`, `ConfirmationData`, `Service`, `Professional`, `Appointment`)

## Code Style

**Formatting & Linting:**
- Tool: `oxlint` configured via `package.json` (`npm run lint`)
- Type checking: strict TypeScript compilation via `tsc -b`
- Styling: Tailwind CSS (v4) with custom Stripe design system tokens (`bg-[#1c1e54]`, `text-stripe-primary`, champagne/luxury themes, smooth rounded-xl borders, subtle gradients).

## Import Organization

**Order:**
1. External React / library imports (`react`, `react-router-dom`, `framer-motion`, `lucide-react`)
2. UI components and shared UI modules (`../components/ui`)
3. Layout / specific components (`../components/ChristmasEffects`)
4. Utility functions and store (`../lib/utils`, `../store/salonStore`)
5. Types and mock data (`../types`, `../data/mockData`)

**Path Aliases:**
- Relative path imports used extensively (`../components/ui`, `../store/salonStore`)

## Error Handling

**Patterns:**
- Try/catch blocks around asynchronous calls (`fetch`, localStorage persistence)
- User-facing error states tracked in component state (`errors`, `submitError`) with accessible `role="alert"` attributes
- Graceful fallbacks for local store data and mock definitions

## Logging

**Framework:** `console.error` and `console.log` for debug/error tracing in async boundaries (`useAvailableSlots`, API reservation handlers).

## Comments

**When to Comment:**
- Documenting specific business rules (e.g., December high-demand season rules, Pix deposit requirements, `ponytail:` comments marking locked visual constraints or frozen dimensions).
- JSDoc / TSDoc is minimal; relies on clear TypeScript interfaces.

## Function Design & State Management

**Size & Modularity:**
- Components broken down into small wizard steps (`Step1Services`, `Step2DateTime`, `Step3ClientData`, `Step4Confirmation`).
- State managed globally via Zustand (`useSalonStore`) and locally via React `useState`.

---

*Convention analysis: 2026-11-22*
