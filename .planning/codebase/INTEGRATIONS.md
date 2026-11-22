# INTEGRATIONS.md — External Services and APIs

**Generated:** 2026-11-22

## Backend API

- **Primary**: `http://localhost:3001` (Local development)
- **Production**: `https://cocoa-oblivion-throng.ngrok-free.dev` (Via Vercel env var `VITE_API_URL`)
- **Endpoints Used**:
    - `GET /api/admin/financials` (Read)
    - `POST /api/admin/financials` (Write/Transaction)
- **Backend State**: The backend itself (`server.js`) is *not* present in this frontend directory; it's an external process.

## Data Persistence

- **Database**: SQLite (implied by backend logic, not directly accessed by frontend)
- **State Management**: Zustand (`src/store/salonStore.ts`) holds *local* state/API responses.

## Authentication & Security

- **Current State**: No authentication implemented on frontend routes (e.g., `/admin` is public).
- **Security Note**: Sensitive operations (password change, session management) currently use local state placeholders only; no real API endpoints confirmed for persistence.
- **Tokens**: No JWTs or session tokens confirmed in frontend code.

## Messaging

- **Service**: WhatsApp (for confirmations, reminders, cancellation)
- **Mechanism**: Handled via specific message syntax (`cancelar CODIGO`) in service responses/logic.

## Deployment

- **Frontend Host**: Vercel (`https://salon-frontend-opal.vercel.app`)
- **Build Process**: `npm run build` creates the production asset bundle (SPA).

**⚠️ CRITICAL WARNING**: The ngrok URL (`https://cocoa-oblivion-throng.ngrok-free.dev`) is temporary and **will expire**. Always verify the backend/tunnel status *before* modifying the frontend if finance data fails to load.