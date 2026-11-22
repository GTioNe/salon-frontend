# TESTING.md — Test Structure and Practices

**Generated:** 2026-11-22

## Testing Framework

- **Vitest**: Configured as the test runner and assertion library.
- **@testing-library/react**: For rendering React components and querying the DOM.
- **@testing-library/user-event**: For simulating user interactions.
- **msw (Mock Service Worker)**: (If configured) For mocking API responses in integration tests.

## Test File Conventions

- **File Pattern**: `__tests__/*.test.ts` or `*.test.ts` at the component or feature level.
- **Component Tests**: `ComponentName.test.ts` placed adjacent to the component (`src/components/ComponentName/ComponentName.test.ts`).
- **Hook Tests**: `useHookName.test.ts` placed in the same directory as the hook.
- **Utility Tests**: `utilName.test.ts` placed in `src/lib/` or a dedicated test directory.

## Test Structure

### 1. Unit Tests (Utility Functions)

- Target `src/lib/utils.ts` functions (e.g., formatting currency, date calculations).
- Use `@vitest/coverage-v8` for coverage reporting.
- Example test pattern:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { formatCurrency } from '@/lib/utils';

  describe('formatCurrency', () => {
    it('formats a number as BRL currency', () => {
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
    });
  });
  ```

### 2. Component Tests

- **Critical Components**: `Button`, `Input`, `AdminFinancial`, `ProfileSettings`.
- **Accessibility**: Test `aria-label`, keyboard navigation, and focus management.
- **Mock Dependencies**: Mock Zustand store using `zustand/mock` or manual mocks.

### 3. Integration / E2E Tests

- **Critical User Flows**:
    1. **Booking flow**: Navigate to `/agendar`, select a service, submit the form.
    2. **Admin login flow**: Navigate to `/admin` (if authentication is added).
    3. **Financial operations**: Interact with `AdminFinancial.tsx`, submit transaction form.
- **Navigation**: Use `react-router-dom` testing utilities (`memoryRouter`, `createBrowserHistory`).

## Mocking Patterns

### API Responses

- **Vitest Mocks**: Use `vi.fn()` or `vi.mock(...)` to mock `natelieApi.ts`.
- **Store Mocks**: Use `create` from `zustand` to mock the store when testing UI interactions without the real store.

### Zustand Store Mock Example

```ts
import { create } from 'zustand';
import mockStore from './salonStore.mock';

// When testing a component that uses the store, you can swap it out:
// const useStore = mockStore || create(set => ({ ... }));
```

## Coverage Goals

- **Minimum**: 70% statement coverage for new features.
- **Critical Paths**: 100% coverage on financial transaction logic and appointment submission.
- **Accessibility**: Axe-core or similar tooling for accessibility checks on key pages.

## Test Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Lint + type check
npm run lint
npm run type-check
```

## Known Testing Gaps

- **No automated E2E tests** configured yet (would require Cypress or Playwright).
- **Store logic** is tested only through component integration, not in isolation.
- **Financial API validation** is manually tested via the UI; no automated mock test exists.
- **Cross-browser compatibility** is not formally tested.

**Note**: Tests should be added incrementally alongside new features. Do not delay shipping to build out a full test suite; focus on critical user flows first.