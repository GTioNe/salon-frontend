# ARCHITECTURE.md — System Design and Patterns

**Generated:** 2026-11-22

## System Architecture

### Layers

1. **Presentation Layer** (React + Vite)
   - Components: `src/components/`
   - Pages: `src/pages/`
   - Routing: React Router v6 (`src/pages/admin`, `src/pages/profile`)

2. **State Management Layer**
   - Zustand Store: `src/store/salonStore.ts` — Central state for appointments, user profile, etc.
   - Local Storage: Used for temporary data (e.g., form state).

3. **Data Layer**
   - API Client: `src/api/natelieApi.ts` — Service layer for HTTP requests.
   - Backend: External Node.js server (`localhost:3001` or ngrok URL) with SQLite database.

4. **UI Layer**
   - Components: Reusable UI elements (`src/components/ui/`) — Buttons, Inputs, Cards, Modals.
   - Layouts: `src/components/layout/` — `AdminLayout`, `MainLayout`.

5. **Assets Layer**
   - Images: `src/assets/` — Hero images, icons.
   - SVGs: `src/assets/react.svg`, `vite.svg`.

### Data Flow

1. **User Interaction** → React Component → State Update (Zustand) → Re-render
2. **API Call** → `salonStore.ts` → `natelieApi.ts` → HTTP Request → Backend (Node.js + SQLite)
3. **Response** → State Update → UI Update

### Key Files and Locations

- **Main Entry**: `src/main.tsx` — ReactDOM.render()
- **Routing**: `src/pages/` — Each page is a React component with its own route
- **Admin Area**: `src/pages/admin/` — Separate layout (`AdminLayout`) for administrative features
- **Public Area**: `src/pages/` — Standard layout (`MainLayout`) for customer-facing features
- **API Layer**: `src/api/` — Service layer for HTTP requests
- **State**: `src/store/` — Zustand store for application state
- **UI Components**: `src/components/` — Reusable components (Button, Input, Card, etc.)
- **Layouts**: `src/components/layout/` — Page-specific layouts (AdminLayout, MainLayout)

## Key Patterns

### 1. Layout Pattern

- **Two Layouts**:
  - `MainLayout`: Public area (Home, Services, Profile)
  - `AdminLayout`: Administrative area (Dashboard, Financials, Clients)

- **Navigation**: 
  - Top navigation bar with search and profile options.
  - Sidebar menu for admin area (Agenda, Financeiro, Clientes, Serviços, Ajustes).

### 2. State Management

- **Zustand Store**: `salonStore.ts` manages:
  - User profile data
  - Appointment state
  - API response state
  - Local form state

### 3. API Pattern

- **Service Layer**: `natelieApi.ts` abstracts HTTP calls.
- **Error Handling**: Inline validation with `error` state in components (no `alert()`).

### 4. Component Structure

- **Atomic Components**: Small, reusable components (e.g., `Button`, `Input`, `Card`).
- **Page-Specific Components**: `AdminDashboard`, `AdminFinancial`, `ProfileSettings`.

### 5. Type System

- **TypeScript**: Used throughout for type safety.
- **Type Definitions**: `src/types/index.ts` — Centralized types for data models.

## File Organization

- **src/components/layout/**: Page-specific layouts (AdminLayout, MainLayout)
- **src/components/ui/**: Reusable UI components
- **src/pages/**: Route components (Home, Admin, Profile)
- **src/pages/admin/**: Administrative pages with dedicated layout
- **src/store/**: Zustand store implementation
- **src/api/**: API service layer
- **src/data/**: Mock data for development

## Critical Paths

1. **Admin Dashboard** → `AdminLayout` → `AdminDashboard.tsx` → Zustand store → API calls
2. **Financial Operations** → `AdminFinancial.tsx` → `POST /api/admin/financials` → Backend validation
3. **Profile Management** → `ProfileSettings.tsx` → `/perfil` route → Zustand store

## Dependencies

- **Zustand**: Central state management
- **React Router**: Client-side routing
- **Framer Motion**: Animation support
- **Date-fns**: Date manipulation

## Potential Issues

- **Public Admin Routes**: `/admin` is currently accessible without authentication.
- **Backend Reliability**: ngrok tunnel may expire; local dev server (`localhost:3001`) must be running.
- **Data Persistence**: Frontend currently uses local state; backend must persist financial transactions.

**Note**: This architecture is designed for a single-page application (SPA) with client-side routing and state management. The backend is separate and must be running for API calls to work.