# Architecture decision records

Short records of significant decisions that affect this repository. Platform-wide decisions live in
`FactoryFlow360/docs/architecture/Nityagati/` and `FactoryFlow360/docs/decisions/decision_log.md`. The ADRs here
record how this repository applies them.

| ADR | Decision | Status |
|---|---|---|
| [0001](0001-separate-apps-shared-backend.md) | Console and Web ERP are separate apps sharing one backend | Accepted |
| [0002](0002-frontend-stack.md) | Frontend stack: React + Vite + TS, React Router, TanStack Query, RHF + Zod, MUI or Mantine | Accepted. Partially adopted. UI library open |
| [0003](0003-platform-staff-session-model.md) | Platform Staff session: short-lived bearer token in `sessionStorage` | Accepted (implemented) |
| [0004](0004-no-provisioning-secrets-in-browser.md) | No provisioning or admin secrets in browser code | Accepted (implemented) |
| [0005](0005-hand-written-api-client-until-openapi-generation.md) | Hand-written API client until OpenAPI generation is adopted | Accepted (interim) |
| [0006](0006-independent-app-installs.md) | Each app installs independently; no root npm workspace | Accepted |

New ADR: copy the format of an existing one, use the next number, and add a row here. Supersede an ADR
instead of editing its decision.
