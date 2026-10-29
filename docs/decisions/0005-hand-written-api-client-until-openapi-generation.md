# ADR-0005 — Hand-written API client until OpenAPI generation is adopted

- **Status:** Accepted (interim)
- **Source:** *Product & Application Architecture v1* §22, §26, and *API & Application Integration Architecture v1*
  §21–24 call for clients generated from FastAPI's OpenAPI schema.

## Decision

For the Management Console's small surface (11 operations), keep the hand-written `fetch` wrapper
(`apps/admin/src/api/client.ts`) and hand-mirrored types (`*Api.ts`). Each type cites its backend schema,
and [api-contracts.md](../management-console/api-contracts.md) records the verified contract.

Adopt OpenAPI type generation (for example `openapi-typescript`, from the backend's `/openapi.json`) **before**
`apps/erp` starts. Its surface is too large to mirror by hand safely.

## Consequences

- Drift risk exists today. It is mitigated by the contracts doc and by the review rule in AGENTS.md.
- When generation is adopted, `*Api.ts` types are replaced by generated ones, and this ADR is superseded.
- The integration architecture lists known OpenAPI gaps in the backend (§24). Those must be checked before
  generated types are trusted.
