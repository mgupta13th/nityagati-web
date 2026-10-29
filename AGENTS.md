# AGENTS.md — nityagati-web

Repository-wide instructions for anyone (human or AI agent) changing this repository.

## Read first

1. [docs/README.md](docs/README.md) — documentation index and reading order.
2. [docs/project/status.md](docs/project/status.md) — what is actually implemented, verified, deployed, or blocked.
3. The documentation for the app you are touching (`docs/management-console/` or `docs/web-erp/`).

The platform-wide architecture (backend domains, identity, membership, API strategy) is owned by the
`FactoryFlow360` repository under `docs/architecture/Nityagati/`. This repository's docs summarize and link
to it; they do not redefine it.

## Repository layout

| Path | What it is | Owner boundary |
|---|---|---|
| `apps/website/` | Public website `nityagati.com` (Next.js, static export) | Must stay unaffected by admin/ERP work |
| `apps/admin/` | Nityagati Management Console — internal, Platform Staff only | Separate auth boundary from the ERP |
| `apps/erp/` | *Not created.* Future customer-facing Web ERP | Do not create without an approved plan |

**Not an npm workspace.** Each app has its own `package.json` and `package-lock.json`, and is installed and
built from its own directory. The root `package.json` has no `workspaces`, no dependencies, and no scripts;
there is no root lockfile. Do not add a root `workspaces` field or run `npm install` at the repo root
([ADR-0006](docs/decisions/0006-independent-app-installs.md)). No Turborepo/Nx. No `packages/` until
duplication between two real apps is demonstrated ([ADR-0001](docs/decisions/0001-separate-apps-shared-backend.md)).

## Commands

```bash
cd apps/admin   && npm ci && npm run build   # Management Console: tsc --noEmit + vite build (the only automated check today)
cd apps/admin   && npm run dev               # Management Console dev server (Vite)
cd apps/website && npm ci && npm run build   # public website static export to apps/website/out/
```

**The public website deploys automatically.** Cloudflare Pages is connected to this GitHub repository and
builds on every push (a `Cloudflare Pages` check run is on `ed99844`; `nityagati-web.pages.dev` serves the
same build as `nityagati.com`). **A push to `develop` is a production website deploy.** Any change to the
root `package.json`, `.npmrc`, `.nvmrc` or anything under `apps/website/` must be verified with a Linux
`npm ci && npm run build` from `apps/website/` before pushing.

The admin app reads `VITE_API_BASE_URL` from `apps/admin/.env.development` / `.env.production`.
Those files contain only public base URLs. Anything prefixed `VITE_` ships to the browser.

## Hard rules

1. **No secrets in browser code.** Never put `PLATFORM_ADMIN_API_KEY`, `ORGANIZATION_PROVISIONING_API_KEY`,
   JWT signing secrets, or any other credential in `apps/*` source, `.env*` files, or build output. The
   Management Console authenticates only with a Platform Staff session token
   ([ADR-0004](docs/decisions/0004-no-provisioning-secrets-in-browser.md)).
2. **The Console never calls API-key routes.** `/organization-provisioning` and the
   `/platform-admin/organizations/{id}` reset/delete routes are operator tooling protected by static keys.
   They share a URL prefix with Platform Staff routes; do not wire them into the UI.
3. **Backend owns business rules.** Authorization, validation, status enforcement and auditing live in the
   FastAPI backend. The frontend may pre-validate for UX but must never be the only check.
4. **Never invent API contracts.** Request/response types in `apps/admin/src/**/\*Api.ts` mirror backend
   Pydantic schemas. Verify against backend code or `GET /openapi.json` before adding or changing one, and
   record it in [docs/management-console/api-contracts.md](docs/management-console/api-contracts.md).
5. **Backward compatibility.** The FactoryFlow360 Flutter app and Nityagati Workforce app use the same
   backend. Backend changes driven by this repository must not break their contracts.
6. **Do not touch `apps/website/`** as a side effect of admin/ERP work.
7. **No production changes from this repository's workflow** — no deploys, no production data writes, no
   production migrations, unless explicitly authorized for that specific action.

## Git

- Default branch: `develop` (remote `origin` → `github.com/mgupta13th/nityagati-web`).
- Do not reset, force-push, rewrite history, or delete branches. Commit or push only when asked.
- One feature per commit, conventional prefix (`feat(admin): …`, `fix: …`, `docs: …`).

## Definition of done for a change

1. `npm run build` in `apps/admin/` passes (type check + build). If anything the website build can see
   changed, `npm run build` in `apps/website/` passes too.
2. Relevant backend tests pass, run **one suite per pytest process** (see
   [status.md — Verification evidence](docs/project/status.md#verification-evidence)).
3. Docs updated in the same change: feature status in `docs/project/status.md`, contracts in
   `api-contracts.md`, and a new ADR for any significant decision.
4. Claims of "verified" or "deployed" carry evidence (command, date, result). Otherwise label them
   *Unknown — requires verification*.

## Status vocabulary (use exactly these labels in docs)

- **Verified** — implemented, and evidence is recorded.
- **Implemented (unverified)** — code exists; not yet verified in the stated environment.
- **Partial** — some acceptance criteria unmet.
- **Planned** — agreed, not started.
- **Blocked** — cannot proceed; blocker named.
- **Unknown** — requires verification.
- **Deferred** — explicitly out of the current scope.
