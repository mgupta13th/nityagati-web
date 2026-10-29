# ADR-0001 — Management Console and Web ERP are separate applications sharing one backend

- **Status:** Accepted
- **Source:** *Nityagati Product & Application Architecture v1* §13–18, 27 (FactoryFlow360 repo)

## Context

Nityagati needs an internal console for Platform Staff and, later, a customer-facing web ERP. Both talk to
the existing FastAPI + PostgreSQL backend, which also serves the FactoryFlow360 and Workforce Android apps.

## Decision

- `apps/admin` (Management Console) and `apps/erp` (Web ERP) are independent SPAs in the `nityagati-web` repository,
  each with its own hostname (`admin.` / `erp.nityagati.com`), deployment, authentication boundary,
  token storage, and dependency install ([ADR-0006](0006-independent-app-installs.md)).
- Both use the single shared backend (`api.nityagati.com`). There are no app-specific backends or BFFs.
- `apps/website` stays independent and calls no backend.
- Shared `packages/*` are extracted only after real duplication exists between two shipped apps.

## Consequences

- A compromised or buggy ERP session cannot reach Platform Staff capability, because the token types, secrets and
  routes differ.
- Sharing one repository is for tooling convenience, not for security. Security comes from backend enforcement.
- Backend changes for either app must preserve Android client compatibility.
