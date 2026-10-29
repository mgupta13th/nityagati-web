# Architecture overview

Summary of the parts of the Nityagati architecture that matter to this repository. The authoritative
platform architecture is in `FactoryFlow360/docs/architecture/Nityagati/`.

## System

```text
nityagati.com        → apps/website   (static, no backend calls)
admin.nityagati.com  → apps/admin     (Management Console, Platform Staff only)      ── not deployed
erp.nityagati.com    → apps/erp       (future customer Web ERP)                      ── not created
                              │
                              ▼
api.nityagati.com    → FactoryFlow360 backend (FastAPI modular monolith) → PostgreSQL
                              ▲
     FactoryFlow360 Android ERP app, Nityagati Workforce Android app
```

One backend serves every client. Each web app is a separate static SPA with its own hostname and deployment
([ADR-0001](../decisions/0001-separate-apps-shared-backend.md)).

## Application boundaries

| | Management Console (`apps/admin`) | Web ERP (`apps/erp`, future) |
|---|---|---|
| Users | Nityagati Platform Staff (internal) | Customer organization members (Owner, Admin, …) |
| Identity | `PlatformStaff` table, separate JWT secret (`PLATFORM_STAFF_JWT_SECRET_KEY`) | `User` + `Membership`, customer JWT (`JWT_SECRET_KEY`) |
| Backend surface | `/platform-admin/auth/*`, `/platform-admin/organizations*`, `/platform-admin/staff*`, `/platform-admin/audit-events` | Existing ERP endpoints (`/auth/login`, `/sales`, …) |
| Organization scope | Cross-organization by design | Exactly one organization, derived from the token |

The two token types are not interchangeable: a customer JWT cannot call Platform Staff routes and vice versa
(backend: `app/dependencies/platform_staff.py`, `app/dependencies/auth.py`; tests:
`tests/platform_staff_auth/test_authorization.py`). The Console and ERP must never share a session, a
token storage key, or a login screen.

## Backend integration

- **Transport:** JSON over HTTPS, `Authorization: Bearer <token>`.
- **Client:** `apps/admin/src/api/client.ts` — hand-written `fetch` wrapper. Extracts `{"detail": "..."}`
  or `{"detail": {"message": "..."}}` errors. Any token-bearing 401 clears the session globally.
- **Contracts:** TypeScript interfaces hand-mirrored from backend Pydantic schemas. The platform
  architecture calls for OpenAPI-generated clients; that is not yet adopted
  ([ADR-0005](../decisions/0005-hand-written-api-client-until-openapi-generation.md)).
- **CORS:** the backend allows origins from `CORS_ALLOWED_ORIGINS` plus a localhost regex
  (`app/core/config.py`). Production must explicitly list the Console origin before it can work in a browser
  (currently not configured, see [status](../project/status.md)).
- **Pagination shape** used by all list endpoints: `{ items, total, page, size, has_more }`.

## Frontend stack

| Concern | Established direction | Current `apps/admin` |
|---|---|---|
| Build | React + Vite + TypeScript | ✅ React 19, Vite 8, TS 5.9 |
| Routing | React Router | ✅ `react-router` 7 (`BrowserRouter`) |
| UI library | MUI or Mantine (choice open) | ❌ none — unstyled HTML |
| Server state | TanStack Query | ❌ none — `useEffect` + `useState` |
| Forms | React Hook Form + Zod | ❌ none — controlled inputs |
| Tests | — (not specified) | ❌ none |

See [ADR-0002](../decisions/0002-frontend-stack.md). Adoption into the existing Console is a planned,
approval-gated change, not something to do incidentally.

## Security principles

1. Backend is the only enforcement point; the UI only reflects it.
2. Organization scope comes from the token or the URL path for Platform Staff — never from a request body.
3. No secrets in the browser ([ADR-0004](../decisions/0004-no-provisioning-secrets-in-browser.md)).
4. Short-lived Platform Staff tokens in `sessionStorage`, validated against `/platform-admin/auth/me` on load
   ([ADR-0003](../decisions/0003-platform-staff-session-model.md)).
5. Account and organization status are re-checked on every request, so deactivation takes effect without
   token revocation lists.
6. Generated passwords are shown once and never retrievable again.
7. Privileged mutations write a durable audit event ([security & audit](../management-console/security-and-audit.md)).
