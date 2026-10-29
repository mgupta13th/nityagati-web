# nityagati-web documentation

## Reading order

1. [../AGENTS.md](../AGENTS.md) — rules for working in this repository.
2. [project/status.md](project/status.md) — verified baseline: what exists, what is deployed, what is blocked.
3. [architecture/overview.md](architecture/overview.md) — applications, boundaries, backend integration, security principles.
4. The app you are working on:
   - Management Console: [requirements](management-console/requirements.md) →
     [security & audit](management-console/security-and-audit.md) →
     [API contracts](management-console/api-contracts.md)
   - Web ERP (future): [web-erp/README.md](web-erp/README.md)
5. [decisions/](decisions/README.md) — architecture decision records.

## Map

```text
docs/
├── README.md                          this index
├── architecture/overview.md           system & repository architecture (summary of FactoryFlow360 docs)
├── management-console/
│   ├── requirements.md                v1 scope, features, acceptance criteria, per-feature status
│   ├── security-and-audit.md          session, authorization, org status enforcement, audit, secrets
│   └── api-contracts.md               verified backend endpoints the Console uses
├── web-erp/README.md                  future customer-facing app: scope boundary and prerequisites
├── decisions/                         ADRs 0001–0006
└── project/status.md                  status matrix, evidence, issues, next actions
```

## Authoritative sources outside this repository

The platform architecture is owned by `FactoryFlow360/docs/architecture/Nityagati/`:

- *Nityagati Product & Application Architecture v1* — application map, hostnames, shared-code strategy
- *Nityagati API & Application Integration Architecture v1* — API strategy, Platform Admin API, OpenAPI
- *Nityagati Authentication & Session Model v1* — identity, membership, Platform Staff isolation
- *Nityagati Implementation & Transition Plan v1* — phases (Phase 4 Web ERP, Phase 5 Platform Admin)

Backend behaviour is verified against `FactoryFlow360/backend/app/` code and tests, not against these
documents alone. If a document here disagrees with backend code, the code is the fact; fix the document.
