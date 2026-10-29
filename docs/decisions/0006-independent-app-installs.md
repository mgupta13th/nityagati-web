# ADR-0006 — Each app installs independently; no root npm workspace

- **Status:** Accepted (2026-10-30). Supersedes the root `"workspaces": ["apps/*"]` setup introduced in `6474b8e`.

## Context

Commit `6474b8e` turned the repository root into an npm workspace and added a root `package-lock.json`. The
public website is built by Cloudflare Pages on every push to GitHub. A review on 2026-10-30 showed that this
silently changed the website build:

- npm walks up from the current directory. If an ancestor `package.json` lists the current folder under
  `workspaces`, npm uses that ancestor as the project (`@npmcli/config` `loadLocalPrefix`). So even
  `npm ci` run inside `apps/website/` used the **root** lockfile, and `apps/website/package-lock.json` was
  ignored. npm also ignores a `.npmrc` placed inside a workspace folder, so that could not be used to opt out.
- The root lockfile had been generated on Windows with `node_modules` already present. It recorded the
  website's native binaries (`@next/swc-*`, `@img/sharp-*`) for `win32-x64` only. A Linux `npm ci` therefore
  installed no Next.js compiler binary, and `next build` only succeeded by downloading one at build time.
- The website's `react` / `react-dom` moved from the locked 19.2.8 to 19.3.0.

## Decision

- No `workspaces` field and no lockfile at the repository root.
- `apps/website/` and `apps/admin/` each own a `package.json` and `package-lock.json`, and are installed and
  built from their own directory (`npm ci && npm run build`).
- `apps/admin/package-lock.json` was generated in a clean directory, with no `node_modules` anywhere above it, so
  it records every platform's optional binaries. It keeps the exact versions the Console was built and
  tested with.

## Consequences

- The website's install is again defined only by `apps/website/package-lock.json`, the same as the deployed
  `ed99844`.
- Shared dev tooling across apps is duplicated per app. That is accepted, because there are only two apps and
  little overlap.
- Reintroducing workspaces (for example for `packages/*`) needs a new ADR. It also needs the website's
  Cloudflare Pages build verified on Linux before any push.
- Lockfiles must be regenerated in a clean checkout (or with `npm install --package-lock-only` and no
  `node_modules` above the app) to avoid dropping other platforms' optional dependencies.
