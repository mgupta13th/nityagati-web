# nityagati-web

Nityagati web applications. Each app installs and builds independently from its own directory, with its
own `package-lock.json`. This is not an npm workspace, and there is nothing to install at the repo root.

```bash
cd apps/website && npm ci && npm run build   # public website → apps/website/out/
cd apps/admin   && npm ci && npm run build   # Management Console → apps/admin/dist/
```

Pushing to `develop` triggers a Cloudflare Pages build and deploy of the public website.

## Contents

- `apps/website/` — public marketing website (`nityagati.com`), Next.js static export. Live.
- `apps/admin/` — **Nityagati Management Console**, the internal Platform Staff application for managing
  organizations. React + Vite + TypeScript. Calls the shared Nityagati backend (`api.nityagati.com`).
  Not yet deployed — see [docs/project/status.md](docs/project/status.md).

## Not yet present

- `apps/erp/` — the future customer-facing Factory Flow 360 Web ERP (`erp.nityagati.com`). See
  [docs/web-erp/README.md](docs/web-erp/README.md).
- `packages/*` — shared code, extracted only once real duplication between two apps exists.

## Relationship to FactoryFlow360

The backend (FastAPI + PostgreSQL) and the Android apps live in separate repositories. This repository
shares no build, deploy or Git history with them. The public website calls no backend; the Management
Console calls only the Platform Staff API (`/platform-admin/*`).

## Documentation

Start with [AGENTS.md](AGENTS.md) and [docs/README.md](docs/README.md).

## Branding

Visual identity follows `docs/BRANDING.md` in the `FactoryFlow360` repository and the approved brand assets
under `apps/website/public/`, copied from `FactoryFlow360/frontend/assets/branding/`.
