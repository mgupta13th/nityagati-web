# Management Console — security, authorization and audit

Behaviour below is verified against `FactoryFlow360/backend` code at commit `1ec20d4` (tag
`v3.15.0-platform-staff-console`) and its test suites, run locally on 2026-10-30. File references are
relative to `FactoryFlow360/backend/`.

## Credentials and secrets

| Credential | Used by | May appear in browser? |
|---|---|---|
| Platform Staff email + password | Console login form | Typed by the user only. Never stored. |
| Platform Staff access token (JWT, `PLATFORM_STAFF_JWT_SECRET_KEY`) | Console → `/platform-admin/*` | Yes, in `sessionStorage` only |
| `PLATFORM_ADMIN_API_KEY` (`X-Platform-Admin-Key`) | Operator tooling: org reset/delete | **Never** |
| `ORGANIZATION_PROVISIONING_API_KEY` (`X-Organization-Provisioning-Key`) | Operator tooling: `POST /organization-provisioning` | **Never** |
| Customer JWT (`JWT_SECRET_KEY`) | ERP and Workforce apps | Never in the Console |
| Generated owner and staff passwords | Shown once in the success response | Displayed once. Never stored or logged by the UI. |

Any `VITE_*` variable is compiled into public JavaScript. So no secret may ever be read through
`import.meta.env`. If a future Console feature needs an API-key-protected capability, the backend must
expose a Platform Staff–authenticated equivalent instead. This is how org creation was done
(`api/platform_staff_organizations.py` reuses the provisioning service behind `require_platform_staff`).
See [ADR-0004](../decisions/0004-no-provisioning-secrets-in-browser.md).

## Session model

- Login: `POST /platform-admin/auth/login`. It returns `access_token` and a staff summary. There is no refresh token.
- Lifetime: `PLATFORM_STAFF_TOKEN_EXPIRE_MINUTES`, default **60** (`app/dependencies/platform_staff.py:84`).
- Storage: `sessionStorage["nityagati_admin_platform_staff_token"]`, so the session ends when the tab closes.
- On load: the token is validated with `GET /platform-admin/auth/me` before the UI is rendered.
- Live re-check: every request reloads the `PlatformStaff` row and rejects it if it is missing or inactive
  (`app/dependencies/platform_staff.py:181`). A staff member who is deactivated loses access on their next request.
- Self-protection: staff cannot deactivate their own account (`app/services/platform_staff_management_service.py`).
- Separation: customer and staff tokens are signed with different secrets and are mutually rejected
  (`tests/platform_staff_auth/test_authorization.py`). If the staff secret is not configured, staff routes return 503.

Known limitations: there is no idle timeout separate from expiry, no server-side revocation beyond `is_active`,
and no MFA. Login rate limiting is **Unknown**.

## Authorization

- The only staff authorization check is `require_platform_staff`: an authenticated, active staff account.
  There are no staff roles. Every active staff member has full Console capability.
- Platform Staff are cross-organization by design. The organization is identified by the URL path parameter,
  never by a body field.
- `/platform-admin/organizations/{id}` **DELETE**, `/reset-preview`, `/reset-business-data` and
  `/deletion-preview` sit under the same prefix but are protected by `require_platform_admin` (static key),
  not by staff sessions. The Console must not call them.

## Organization status enforcement

**Background:** an earlier review found that `Organization.is_active` was stored but checked nowhere. Customers of a
"deactivated" organization could keep working.

**Finding (2026-10-30): resolved in code and covered by tests. Production behaviour is not verified.**

Enforcement points in current code:

| # | Point | Behaviour | Code |
|---|---|---|---|
| 1 | Customer login `POST /auth/login` | 403 `Organization is deactivated`, checked after the user-active check and before password verification | `app/services/auth_service.py:45-51` |
| 2 | Every authenticated customer request | `get_current_user` reloads the organization through the live Membership and returns 403 if it is missing or inactive | `app/dependencies/auth.py:133-149` |
| 3 | Workforce app requests | Inherited from #2 (`resolve_current_worker` depends on `get_current_user`) | `app/dependencies/workforce.py` |

Why this is complete for token-based access: `get_current_user` is the only place a customer JWT is decoded
(`decode_token` has a single caller, `app/dependencies/auth.py:35`). So no authenticated customer route
can skip check #2. Unauthenticated routes (login, health, bootstrap `POST /organizations`) do not act on an
existing organization's data.

Test evidence (`tests/platform_staff_organizations/test_organization_status.py`, 15 tests, passing):
`test_deactivation_blocks_new_customer_login`, `test_deactivation_rejects_existing_customer_jwt_on_next_request`,
`test_reactivation_restores_customer_access`, `test_status_change_does_not_affect_other_organizations`,
`test_repeated_deactivation_is_idempotent`, `test_deactivation_produces_audit_event`,
`test_activation_produces_audit_event`.

Still to verify or decide:

1. **Production** — deactivate a test organization in production, confirm login and an existing session are
   rejected, then reactivate. This needs explicit authorization because it changes production data.
2. **Mobile UX** — the Android apps sign out only on 401, so a 403 `Organization is deactivated` leaves the
   user signed in with failing screens. Options: return 401 from `get_current_user` for this case, or teach both
   apps to treat this 403 as a forced sign-out with a message. This is an approval-gated contract decision.
3. **Background jobs / scripts** — scripts that act on organizations directly (e.g. seeding, provisioning
   scripts) do not go through `get_current_user`. This is acceptable for operator tooling, but it is not
   status-aware.

## Error handling contract

| Status | Meaning on staff routes | Console behaviour |
|---|---|---|
| 401 | Missing, invalid, or expired token, or inactive staff | Global logout → `/login` (except on the login call itself) |
| 403 | Not used by `require_platform_staff` today | Inline message |
| 404 | Unknown organization or staff ID | "Not found" state |
| 409 | Duplicate organization name or mobile, duplicate staff email | Inline backend message |
| 422 | Request validation (FastAPI) | Inline message. `detail` is an array, so the client falls back to status text. ⚠️ Not user-friendly. |
| 503 | Staff JWT secret not configured | Inline message |

## Audit behaviour

There are two channels:

- **Application log** (`log_audit_event`): structured log lines. Not queryable from the Console.
- **Durable table** `platform_audit_events` (migration `0019`), written by `log_platform_audit_event`.
  Read through `GET /platform-admin/audit-events` (filters: `organization_id`, `actor_email`, `event_type`;
  newest first; paginated). It is append-only from the API; there are no update or delete endpoints.

| Event | Log | Durable | Actor |
|---|---|---|---|
| `ORGANIZATION_PROVISIONED` (via Console) | ✅ | ✅ | staff email |
| `ORGANIZATION_PROVISIONED` (via API-key route) | ✅ | ❌ | free-text `operator` |
| `ORGANIZATION_STATUS_CHANGED` | ✅ | ✅ | staff email. Metadata includes name and old/new status |
| `PLATFORM_STAFF_ACCOUNT_CREATED` | ✅ | ✅ | staff email |
| `PLATFORM_STAFF_ACCOUNT_STATUS_CHANGED` | ✅ | ✅ | staff email |
| `PLATFORM_STAFF_LOGIN_SUCCEEDED` / `_FAILED` | ✅ | ❌ | — |
| `ORGANIZATION_RESET_*`, `ORGANIZATION_DELETION_*` (API-key routes) | ✅ | ❌ | — |

Audit events never contain passwords, hashes, tokens or API keys (`test_no_secret_fields_ever_exposed`).
**Durable audit is best-effort, not transactional.** `log_platform_audit_event` runs *after* the business
transaction has committed and writes its row in a separate commit. If that write fails, the error is
logged to `factoryflow360.platform_audit_persistence` and swallowed. The business change stands, and no
durable event is recorded (`app/services/platform_audit_event_service.py`). The application-log event is
still emitted. For v1 the table is a reliable operational trail, not a guaranteed-complete compliance
record. Making it transactional would be a backend design change that needs approval.

Required behaviour for **new** privileged Console mutations: write a durable event in the same service call,
with the actor taken from the staff principal, a `target_type`/`target_id`, and no secrets in metadata.
