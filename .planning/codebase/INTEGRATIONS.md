# External Integrations

**Analysis Date:** 2026-11-22

## APIs & External Services

**Salon Backend REST API:**
- Custom Express backend (`server.js`, not committed to this frontend repo) - Salon operations API
  - Service catalog consumption: `GET /api/services`
  - Availability computation: `GET /api/slots?date=...&serviceId=...`
  - Booking persistence: `POST /api/reserve`
  - Booking confirmation flow: `POST /api/confirm`
  - Booking cancellation: `POST /api/cancel`
  - Admin financial data: `GET /api/admin/financials`, `POST /api/admin/financials`
  - Admin reservations: `GET /api/admin/reservations`, `GET /api/admin/stats`
- Base URL resolution: `VITE_API_URL` env var (fallback `http://localhost:3001`)
- Custom headers sent with all API calls:
  - `Content-Type: application/json`
  - `ngrok-skip-browser-warning: ''` (required by ngrok browser warning bypass)

## Data Storage

**Databases:**
- SQLite - Local file-based database (`server.js`) for salon appointments, financial records, and operational data

**File Storage:**
- Local filesystem / static assets - Served via Vercel static hosting (`dist/`)

**Caching:**
- None

## Authentication & Identity

**Auth Provider:**
- None implemented - No authentication layer exists for admin routes; `/admin` routes are publicly accessible by design per `HANDOFF.md`

## Monitoring & Observability

**Error Tracking:**
- Not configured

**Logs:**
- Not configured

## CI/CD & Deployment

**Hosting:**
- Vercel - Frontend hosting at `https://salon-frontend-opal.vercel.app` (SPA config via `vercel.json` with catch-all rewrite to `/index.html`)

**CI Pipeline:**
- Not configured

## Environment Configuration

**Required env vars:**
- `VITE_API_URL` - Backend API base URL (e.g., `https://cocoa-oblivion-throng.ngrok-free.dev` in current testing setup)

**Secrets location:**
- Not committed to repo (no secrets committed)

## Webhooks & Callbacks

**Incoming:**
- Not configured (no public webhook endpoints)

**Outgoing:**
- Not configured

---

*Integration audit: 2026-11-22*
