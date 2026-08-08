# nityagati-web

Nityagati public web applications.

## Contents

- `apps/website/` — the public marketing website (`nityagati.com`), a Next.js application configured for static export. No page content yet -- this is a foundation/scaffold only.

## Not yet present (added only when actually needed)

- `apps/erp/` — the future Nityagati Business ERP Web (`erp.nityagati.com`)
- `apps/admin/` — the future Nityagati Platform Admin (`admin.nityagati.com`)
- `packages/*` — shared API client, auth, and UI packages, extracted from real duplication once a second app exists

## Independence

This repository is completely independent of the `FactoryFlow360` repository (the existing backend + mobile ERP). It shares no build, deploy, runtime, or Git history with it. It does not call `api.nityagati.com` or any other backend service.

## Branding

Visual identity follows `docs/BRANDING.md` in the `FactoryFlow360` repository (naming authority) and the approved brand assets under `apps/website/public/`, copied from `FactoryFlow360/frontend/assets/branding/`.
