# CONVENTIONS.md — Code Style and Patterns

**Generated:** 2026-11-22

## Code Style

- **Strict TypeScript**: Used across all new files. Avoid `any` unless absolutely necessary.
- **Functional Components**: Use `function ComponentName() { ... }` or `const ComponentName: React.FC = () => { ... }`.
- **Props**: Use interfaces or types for component props.
- **Imports**: Organize imports by categories:
    1. React and third-party libraries
    2. Shared UI components (`@/components/ui/...`)
    3. Custom hooks, utils, types
    4. Internal components and assets
- **Naming**: `PascalCase` for components, `camelCase` for functions, variables, and hooks.

## UI & Design Patterns

- **Stripe-Inspired Design**:
    - Dark sidebars with high contrast.
    - Indigo (`#533afd`) as the primary brand color.
    - Pill-shaped buttons (`rounded-full`).
    - Tabular numbers for financial data (`font-mono` or `tabular-nums`).
    - Clean typography and generous whitespace.
- **Responsive Layouts**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) to ensure compatibility with mobile devices.
- **Component Primitives**: Always use components from `src/components/ui/` for consistency (Button, Input, Card, Modal).

## State Management Patterns

- **Zustand**:
    - Use `useSalonStore` for global application state.
    - Select specific slices of state to minimize re-renders: `const user = useSalonStore(state => state.user)`.
    - Handle complex state updates within store actions, not in components.
- **Form State**: Manage simple form state with `useState` and handle submission asynchronously.

## API & Data Handling

- **Service Layer**: Keep API logic in `src/api/` or `src/store/`.
- **Error Handling**: Use inline validation and state-based error messages. Avoid `alert()`.
- **Data Transformation**: Perform formatting (e.g., currency, dates) as close to the UI as possible using utility functions from `src/lib/utils.ts` or `date-fns`.

## Formatting & Linting

- **Prettier**: Use standard Prettier configuration for consistent code formatting.
- **ESLint**: Adhere to ESLint rules for identifying and fixing code smells and accessibility issues.

## Routing

- **React Router v6**:
    - Use `<Routes>` and `<Route>` for defining application paths.
    - Leverage `<Outlet />` for nested layouts (`AdminLayout`, `MainLayout`).
    - Use `useNavigate` for programmatic navigation.

## Performance

- **Code Splitting**: Utilize dynamic imports (`React.lazy`) for pages if the bundle size grows significantly.
- **Memoization**: Use `useMemo` and `useCallback` sparingly where performance gains are measurable.
- **SVG Optimization**: Use SVGR or optimized SVG assets to reduce bundle size and improve rendering.

## Testing Patterns

- **Vitest/Jest**: (If applicable) Write unit tests for business logic and utility functions.
- **Integration Tests**: Focus on critical user flows (e.g., appointment booking, financial transaction).
- **Manual Verification**: Test each route and interaction across different screen sizes.

**Note**: Maintain a lean approach — avoid unnecessary abstractions and boilerplate. Ship small, verifiable increments.
