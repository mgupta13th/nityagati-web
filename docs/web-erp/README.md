# Web ERP (future) — `apps/erp`

**Status: Planned. Not started. `apps/erp/` does not exist.** Nothing in this document authorizes
implementation. Starting it needs its own approved plan.

## What it is

A customer-facing web version of Factory Flow 360 for office and desktop use by an organization's own
members (Owner, Admin, Manager, Accountant, …). It complements the Android app and does not replace it.
Target host: `erp.nityagati.com`. Source: *Nityagati Product & Application Architecture v1* §17 and
*Implementation & Transition Plan v1* §11–12 and Phase 4 (in `FactoryFlow360/docs/architecture/Nityagati/`).

## Boundaries (fixed)

- It is a separate app from the Management Console, with a separate hostname, deployment, login, token storage key
  and router ([ADR-0001](../decisions/0001-separate-apps-shared-backend.md)).
- It authenticates with the existing customer login (`POST /auth/login`, mobile + password) and customer JWT.
  It never uses Platform Staff tokens or routes.
- Its organization context comes from the token / live Membership only, never from a client-chosen ID. Organization
  switching follows the *Authentication & Session Model v1* when multi-membership exists.
- It uses the **same** ERP endpoints as the Android app. No web-only business logic. Any backend change must
  remain compatible with the Flutter app.
- Accounting and inventory invariants are enforced by the backend: every financial posting goes through
  `LedgerPostingService`, and stock is derived only from `StockTransaction` rows. The Web ERP displays and submits
  data. It never computes balances or stock of its own.
- Organization status enforcement already applies: a deactivated organization receives 403 on login and on every
  request ([security-and-audit.md](../management-console/security-and-audit.md#organization-status-enforcement)).

## Navigation and modules (indicative, not committed)

The likely order follows office-heavy work: dashboard and day book → sales/purchase entry and lists → receipts and
payments → ledgers and outstanding → stock reports → masters (parties, products) → reports. The final module
order is to be set in an approved roadmap.

## Prerequisites before any implementation

1. The Management Console is deployed and stable (its shared patterns get proven there first).
2. Frontend stack decisions are finalized ([ADR-0002](../decisions/0002-frontend-stack.md)), including the UI library.
3. OpenAPI client generation is evaluated ([ADR-0005](../decisions/0005-hand-written-api-client-until-openapi-generation.md)).
   The ERP surface is far larger than the Console's, so hand-mirroring it is not sustainable.
4. The backend CORS configuration includes `https://erp.nityagati.com`.
5. A decision on 403 handling for deactivated organizations (the same question as for the mobile apps).

## Acceptance criteria for "Web ERP v1" (to be refined when planned)

- An Owner can sign in with existing credentials and see only their organization's data.
- Every transaction created on web is identical in backend effect to one created on Android.
- No regression in the Android app (verified with its existing test suite and a device check).
- No business rule exists only in web code.
