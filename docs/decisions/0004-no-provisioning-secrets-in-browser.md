# ADR-0004 — No provisioning or admin secrets in browser code

- **Status:** Accepted (implemented and verified 2026-10-30: no `X-Platform-Admin-Key` or
  `X-Organization-Provisioning-Key` in `apps/admin/src`, `.env*` or `dist/`)

## Context

The backend has static-key operator routes: `POST /organization-provisioning`
(`ORGANIZATION_PROVISIONING_API_KEY`) and org reset/delete (`PLATFORM_ADMIN_API_KEY`). Anything shipped to a
browser, including every `VITE_*` variable, is public.

## Decision

- Browser code never holds, requests or forwards these keys, or any signing secret.
- The Console reaches privileged capability only through Platform Staff–authenticated routes. When the
  Console needs a capability that exists only behind a static key, the backend adds a staff-authenticated
  equivalent that derives the actor from the session. Organization creation is the precedent:
  `POST /platform-admin/organizations`.
- Generated passwords are returned once in a response, displayed once, and never persisted by the UI.

## Consequences

- Org reset and deletion are not available in the Console until staff-authenticated routes exist for
  them. That is deliberate (Deferred).
- Code review must reject any `import.meta.env.*KEY*` / `*SECRET*` usage.
