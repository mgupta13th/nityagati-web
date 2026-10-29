# Management Console — v1 requirements

The Nityagati Management Console (`apps/admin`, target host `admin.nityagati.com`) is the internal
application Nityagati Platform Staff use to provision and manage customer organizations. It is not
customer-facing.

Status labels follow [AGENTS.md](../../AGENTS.md#status-vocabulary-use-exactly-these-labels-in-docs).
"Verified (local)" means verified against backend tests and a local frontend build on 2026-10-30. **No
Console feature is verified in production**, because the Console is not deployed
([status](../project/status.md)).

## Scope

### In scope for v1

| # | Feature | Status |
|---|---|---|
| 1 | Platform Staff login and secure session | Verified (local) |
| 2 | Organizations list | Verified (local) |
| 3 | Organization creation and provisioning | Verified (local) |
| 4 | Organization details | Verified (local) |
| 5 | Organization users (read-only) | Verified (local) |
| 6 | Organization activation / deactivation | Verified (local); mobile UX gap, see F6 |
| 7 | Authorization, error handling, audit | Partial, see F7 |

### Built beyond the original seven items (already in the codebase)

| Feature | Status |
|---|---|
| Platform Staff accounts: list, create, activate/deactivate (`/staff`) | Verified (local) |
| Audit Events viewer with filters and pagination (`/audit-events`) | Verified (local) |

These are needed in practice: staff accounts would otherwise need database access to create, and the audit
trail for feature 7 would have no reader. They are kept in v1.

### Deferred (not v1)

Subscriptions, payments, billing, invoices, support/ticketing, complex analytics, product entitlement
management, membership editing, user editing, organization editing, organization reset/deletion through the
UI, and staff roles/permissions.

## Feature specifications

Each feature lists its acceptance criteria. ✅ = met (with evidence), ⚠️ = partial, ❌ = not met, ❓ = unknown.

### F1. Platform Staff login and session

Route `/login`. Email + password → `POST /platform-admin/auth/login`.

- ✅ Successful login stores the access token in `sessionStorage` and shows the staff name and email in the header.
- ✅ Wrong credentials show the backend's message inline. They do not trigger a global logout.
- ✅ On page load, a stored token is validated with `GET /platform-admin/auth/me` before it is trusted.
- ✅ Any token-bearing 401 clears the session and redirects to `/login` (`api/client.ts` → `AuthContext`).
- ✅ Deactivated staff are rejected on their next request (backend re-checks `PlatformStaff.is_active`).
- ✅ Customer JWTs are rejected, and staff tokens are rejected by customer routes
  (`tests/platform_staff_auth/test_authorization.py`).
- ⚠️ The token expires after 60 minutes by default (`PLATFORM_STAFF_TOKEN_EXPIRE_MINUTES`). There is no refresh
  and no warning, so the user is logged out mid-task.
- ❓ Login rate limiting / lockout: not found in the code reviewed. Needs verification.
- ❌ After an expiry redirect, the user is not returned to the page they were on (they land on `/`).

### F2. Organizations list

Routes `/` and `/organizations`. `GET /platform-admin/organizations?search&page&size`.

- ✅ Shows name, mobile, email, active status, and created date, paginated (default size 50).
- ✅ Search is server-side.
- ✅ Each row links to the organization's details page.
- ✅ Only Platform Staff can call it (`tests/platform_staff_organizations/test_list_organizations.py`).

### F3. Organization creation and provisioning

Route `/organizations/new`. `POST /platform-admin/organizations`.

- ✅ Required fields: organization name, owner name, and owner mobile. Optional fields: mobile, email, GSTIN, PAN, address, and owner email.
- ✅ The backend always generates the owner password. A password sent in the body is ignored
  (`test_owner_password_in_request_body_is_ignored`).
- ✅ The generated password is shown once on the success screen, with a warning. There is no automatic redirect.
- ✅ The operator is taken from the staff session, never from client text (`test_operator_is_derived_from_platform_staff_identity`).
- ✅ Provisioning is atomic. A failure rolls everything back (`test_failed_creation_rolls_back`). The full
  bootstrap (ledgers, units, categories) is created (`test_successful_creation_produces_complete_bootstrap`).
- ✅ A duplicate name or mobile returns 409 with a readable message.
- ✅ Double-submit is guarded on the client.
- ✅ A durable `ORGANIZATION_PROVISIONED` audit event is written.
- ⚠️ There is no copy-to-clipboard for the password, and nothing blocks navigation away before the password is recorded.
- ⚠️ There is no client-side format validation (mobile, GSTIN, PAN). The backend validation is authoritative. The UI only shows its message.

### F4. Organization details

Route `/organizations/:organizationId`. `GET /platform-admin/organizations/{id}`.

- ✅ Shows the organization fields, active status, created date, and owner summary (name, mobile, email). No auth fields are shown.
- ✅ An unknown ID shows "Organization not found" (404).
- ✅ Links to the users page.
- ✅ Hosts the activate/deactivate control (F6).

### F5. Organization users (read-only)

Route `/organizations/:organizationId/users`. `GET /platform-admin/organizations/{id}/users`.

- ✅ Shows name, mobile, email, role, status (Membership status), and created date, with search and pagination.
- ✅ Returns only the requested organization's users. No password hash or auth fields
  (`test_only_users_from_requested_organization_are_returned`, `test_sensitive_fields_are_not_exposed`).
- ✅ Read-only. No mutation endpoints exist for organization users on the staff surface.

### F6. Organization activation / deactivation

Control on the details page. `PATCH /platform-admin/organizations/{id}/status` with `{ "active": bool }`.

- ✅ Deactivation asks for confirmation. Activation does not.
- ✅ The response replaces local state (same shape as details).
- ✅ Idempotent (`test_repeated_deactivation_is_idempotent`). Other organizations are unaffected.
- ✅ Deactivation blocks new customer logins (403 `Organization is deactivated`) and rejects existing customer
  JWTs on their next request. Reactivation restores access. See
  [security-and-audit.md](security-and-audit.md#organization-status-enforcement).
- ✅ A durable `ORGANIZATION_STATUS_CHANGED` audit event is written for both directions.
- ⚠️ **Mobile UX gap:** the FactoryFlow360 and Workforce Android apps clear the session only on **401**.
  A deactivated organization returns **403**, so a signed-in mobile user stays on screen and every request
  fails with an error instead of being signed out. Access is still blocked, so this is a UX issue, not a security hole.
  Needs a decision (see [status](../project/status.md#open-decisions)).
- ⚠️ No reason or note is captured with a status change.

### F7. Authorization, error handling, audit

- ✅ Every route the Console uses depends on `require_platform_staff`.
- ✅ The UI never calls the API-key routes (verified by searching `apps/admin/src` and `dist/`).
- ✅ Errors show the backend `detail` message. Network failures fall back to generic text.
- ✅ Durable audit covers provisioning, organization status changes, staff creation, and staff status changes.
- ⚠️ Platform Staff login success and failure go only to the application log, not the durable audit table.
- ⚠️ Provisioning through the API-key route (`/organization-provisioning`) goes only to the application log. There is no durable event.
- ⚠️ There is a single staff privilege level. Every active staff member can do everything, including creating staff.
- ❌ No global error boundary. A rendering error shows a blank page.
- ❌ No automated frontend tests.

## Non-functional requirements

| Requirement | Status |
|---|---|
| No secrets in browser code or bundle | ✅ Verified (source + `dist/` search, 2026-10-30) |
| Desktop-first, usable on a laptop | ⚠️ Functional, but unstyled HTML |
| Type check + production build passes | ✅ `npm ci && npm run build` in `apps/admin/` (2026-10-30, Windows and Linux) |
| Accessible form labels / `role="alert"` errors | ✅ Present on all forms |
| Deployable as a static SPA with history fallback | ❓ No hosting configured; SPA routes need rewrite-to-`index.html` |
