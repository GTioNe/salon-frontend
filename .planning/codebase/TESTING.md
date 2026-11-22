# Testing Patterns

**Analysis Date:** 2026-11-22

## Test Framework

**Runner:**
- No automated test runner (Jest, Vitest, Playwright, or Cypress) is currently installed or configured in `package.json`.

**Build Validation (Primary Quality Gate):**
- Automated verification relies strictly on TypeScript compilation and Vite production builds via `npm run build` (`tsc -b && vite build`).
- Linting is performed via `oxlint` (`npm run lint`).

**Run Commands:**
```bash
npm run build          # Typecheck and production build
npm run lint           # Run oxlint checks
npm run dev            # Start Vite development server
```

## Test File Organization

**Location:**
- No test files (`*.test.ts`, `*.spec.tsx`) found in the codebase. All validation is conducted via manual builds and browser testing against mock data and local storage state.

## Testing Strategy & Recommendations

**Current Approach:**
- Frequent manual builds (`npm run build`) to catch TypeScript errors, missing exports, and syntax regressions.
- Runtime verification in the browser (`http://localhost:5173`) for multi-step booking workflows, administrative dashboards, and WhatsApp URL generation.

**Future Testing Additions (When Needed):**
- Add Vitest + React Testing Library for component unit tests if business logic grows.
- Add lightweight Playwright E2E tests for the booking wizard flow if production regressions occur.

---

*Testing analysis: 2026-11-22*
