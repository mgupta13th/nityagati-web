# ADR-0003 — Platform Staff session model

- **Status:** Accepted (implemented: `apps/admin/src/auth/`, `apps/admin/src/api/client.ts`;
  backend `app/dependencies/platform_staff.py`)

## Decision

- The backend issues a short-lived JWT (default 60 minutes), signed with `PLATFORM_STAFF_JWT_SECRET_KEY`. That
  secret is separate from the customer secret. There is no refresh token.
- The Console stores the token in `sessionStorage`, not `localStorage`, so the session does not outlive the tab.
- On load, a stored token is validated with `GET /platform-admin/auth/me` before the UI trusts it.
- The backend re-checks the staff account's `is_active` on every request. Deactivation takes effect on the next
  request, with no revocation list.
- Any token-bearing 401 triggers one global logout handler. The login request's own 401 is a form error.

## Consequences

- An XSS flaw could still read `sessionStorage`. The mitigations are: no third-party scripts, no
  `dangerouslySetInnerHTML`, and a CSP at hosting time (planned).
- Users are logged out at expiry with no warning. An expiry warning, or a silent re-login prompt that
  preserves the current page, is a planned UX improvement. Moving to httpOnly cookies would be a backend
  change and needs a new ADR.
