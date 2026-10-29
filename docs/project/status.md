# Project status — verified baseline

**Last verified:** 2026-10-30. Re-verify anything older than the latest backend or web commit before relying on it.

## Summary

The Management Console v1 is **code-complete locally and backed by passing backend tests**. It is **not deployed**
and **cannot work in production as configured**, because `admin.nityagati.com` has no DNS record and the
production API's CORS policy rejects that origin. The web repository has **12 commits that are not pushed**: 9 Console commits, the independent-install build fix, and two documentation commits.

## Repository state

| Item | Observed | Evidence |
|---|---|---|
| `nityagati-web` branch | `develop`, **ahead of `origin/develop` by 12**, behind 0 | `git rev-list --left-right --count origin/develop...HEAD` → `0 12` |
| Post-Console commits (local, unpushed) | `436dd82` build fix: root `workspaces` and root `package-lock.json` removed, `apps/admin/package-lock.json` added ([ADR-0006](../decisions/0006-independent-app-installs.md)). `08c0874`: this documentation set. Then a status-update commit. Working tree clean | `git log origin/develop..HEAD`, `git status` |
| Unpushed commits | `6474b8e` scaffold → `361a37d` audit events page (all Console work) | `git log` |
| `nityagati-web` tags | none | `git tag` |
| `FactoryFlow360` | `master` == `origin/master` at `1ec20d4`; tag `v3.15.0-platform-staff-console` → `1ec20d4` | `git rev-parse v3.15.0-platform-staff-console^{commit}` |
| Backend latest migration | `0019_platform_audit_events.py` | `backend/migrations/versions/` |
| `apps/erp/` | does not exist | file listing |

## Deployment state

| Item | Status | Evidence (2026-10-30, read-only requests) |
|---|---|---|
| Backend at `api.nityagati.com` running | **Verified** | `GET /health` → 200 |
| Backend includes all Console endpoints | **Verified** | `GET /openapi.json` lists every path in [api-contracts.md](../management-console/api-contracts.md) |
| Deployed backend commit == `1ec20d4` | **Unknown** | The paths match `31109c6`+. `1ec20d4` changes only deploy config, which OpenAPI cannot show |
| Production DB at revision `0019` | **Unknown** | Previously reported. Not verifiable without authenticated or DB access |
| Platform Staff env vars set in production | **Unknown** | Wired in `docker-compose.yml` by `1ec20d4`. Values not observable |
| A Platform Staff account exists in production | **Unknown** | — |
| Console hosted at `admin.nityagati.com` | **Blocked** — not deployed | DNS: *Non-existent domain* |
| Production CORS allows Console origin | **Blocked** | `OPTIONS` with `Origin: https://admin.nityagati.com` → 400, no `access-control-allow-origin` |
| Public website `nityagati.com` | **Verified** live | `GET` → 200 |
| Website build/deploy pipeline | **Verified:** Cloudflare Pages Git integration, building on push | GitHub check run `Cloudflare Pages` → "Deploy successful" on `ed99844`; `nityagati-web.pages.dev` and `nityagati.com` serve the same build (`page-838289aafaf50938.js`) |
| Pages root directory / build command / Node version | **Unknown** | Cloudflare dashboard not inspected. Inferred root dir `apps/website` (at `ed99844` the repo root had no lockfile or scripts) |

## Feature status — Management Console v1

Details and acceptance criteria: [requirements.md](../management-console/requirements.md).

| Feature | Backend | Frontend | Production |
|---|---|---|---|
| Staff login & session | Verified (tests) | Implemented (build passes) | Blocked |
| Organizations list | Verified | Implemented | Blocked |
| Create organization | Verified | Implemented | Blocked |
| Organization details | Verified | Implemented | Blocked |
| Organization users (read-only) | Verified | Implemented | Blocked |
| Activate / deactivate | Verified | Implemented | Blocked |
| `Organization.is_active` enforcement | Verified (code + tests) | n/a | Unknown |
| Staff accounts | Verified | Implemented | Blocked |
| Audit events viewer | Verified | Implemented | Blocked |
| UI library / TanStack Query / RHF+Zod | n/a | **Not adopted** ([ADR-0002](../decisions/0002-frontend-stack.md)) | — |
| Frontend automated tests | n/a | **None** | — |

"Implemented" for the frontend means it type-checks and builds, and its code was reviewed. No browser walkthrough
against a running backend was performed in this verification.

## Verification evidence

**Backend tests** (`FactoryFlow360/backend`, local PostgreSQL, disposable per-suite databases; never the dev or production DB):

| Suite | Result (2026-10-30) |
|---|---|
| `tests/platform_staff_auth` | 13 passed |
| `tests/platform_staff_organizations` | 59 passed |
| `tests/platform_staff_accounts` | 24 passed |
| `tests/platform_audit_events` | 17 passed |
| `tests/organization_provisioning` | 15 passed |
| `tests/platform_admin` | 20 passed |
| `tests/authentication` | 80 passed |
| **Total** | **228 passed, 0 failed** |

⚠️ When these suites run **in a single pytest process**, 38 tests fail (190 passed). Each suite's `conftest.py`
sets process-wide `os.environ` secrets (`JWT_SECRET_KEY`, `PLATFORM_STAFF_JWT_SECRET_KEY`) and database names at
import time, so the suites collide. This is a test-harness defect, not a product defect. Until it is fixed, run
one suite per process:

```bash
cd FactoryFlow360/backend
for s in platform_staff_auth platform_staff_organizations platform_staff_accounts \
         platform_audit_events organization_provisioning platform_admin authentication; do
  python -m pytest tests/$s -q -p no:cacheprovider
done
```

**Independent installs** ([ADR-0006](../decisions/0006-independent-app-installs.md)), 2026-10-30. Linux = WSL Ubuntu 22.04 x86_64,
Node 22.15.1 / npm 10.9.2, from LF exports matching what GitHub serves. This is **not** the Cloudflare Pages build image.

| Check | Result |
|---|---|
| `apps/website/package.json` + `package-lock.json` vs `origin/develop` | Byte-identical (`git diff --quiet origin/develop -- apps/website`) |
| `npm prefix` in `apps/website` / `apps/admin` | Each resolves to its own directory (was the repo root under the workspace) |
| Website Linux `npm ci` from `apps/website` (baseline `ed99844` vs fixed tree) | Both exit 0. Installed tree identical (31 entries), including `@next/swc-linux-x64-gnu` and `@img/sharp-linux-x64` from the lockfile. `next` 15.5.23, `react`/`react-dom` 19.2.8 |
| Website Linux `npm run build` | Both exit 0, 49 exported files, no runtime SWC download |
| Website export comparison | Differs only in webpack runtime chunk ordering. Two builds of the *same* baseline differ identically (control), and the fixed tree's `webpack-30c06512dfc025f3.js` equals one of the baseline's variants |
| Admin `npm ci && npm run build` from `apps/admin`, clean (Linux and Windows) | Exit 0. Linux rolldown/lightningcss bindings installed. Versions unchanged (react 19.3.0, vite 8.3.0, typescript 5.9.3). Bundle `index-DbTw5_gj.js` is byte-identical to the pre-fix build. `npm ci` leaves the lockfile unchanged |

There are no automated test suites for `apps/website` or `apps/admin`. The type check in `npm run build` is the only check.

**Secrets:** a search of `apps/admin/src`, `apps/admin/.env*` and `apps/admin/dist/` for `X-Platform-Admin-Key`,
`X-Organization-Provisioning-Key` and `*_API_KEY` finds none. The `.env` files contain only `VITE_API_BASE_URL`.

## Findings

| # | Finding | Severity | Status |
|---|---|---|---|
| 1 | 12 unpushed commits (Console, build fix, docs) exist only on one local machine | High (loss risk) | Open. Push needs approval |
| 2 | Production CORS does not allow `https://admin.nityagati.com` | Blocker for deploy | Open. Backend env change needs approval |
| 3 | `admin.nityagati.com` has no DNS or hosting | Blocker for deploy | Open |
| 4 | `Organization.is_active` was previously unenforced | — | **Resolved in code** (`141f053`), with tests. Prod check pending |
| 5 | Android apps sign out only on 401; a deactivated org returns 403, leaving the user stuck on failing screens | Medium (UX) | Open. Decision needed |
| 6 | Durable audit is best-effort (post-commit, swallowed failures). Staff logins and API-key provisioning are log-only | Medium | Open. Accepted for v1 unless changed |
| 7 | No staff roles. Any active staff member can create staff and deactivate orgs | Medium | Accepted for v1. Revisit when staff count > ~3 |
| 8 | Backend test suites collide in one process | Low | Open |
| 9 | Frontend stack not aligned with ADR-0002. No UI library, no tests, no error boundary | Medium | Planned |
| 10 | 422 validation errors render as status text, not field messages | Low | Planned |
| 11 | Stale descriptions: `apps/admin/package.json` and `vite.config.ts` comments say "scaffold only"; `apps/website/components/README.md` and `content/README.md` say "intentionally empty" | Low | Not changed (app/website files out of scope for a docs-only pass) |
| 12 | Login rate limiting for Platform Staff | Unknown | Verify |
| 13 | Root npm workspace (`6474b8e`) silently moved the website build onto a root lockfile that has Windows-only Next.js/sharp binaries and React 19.3.0, so a push would have changed the production website build | High (prod website) | **Fixed and committed locally** in `436dd82` ([ADR-0006](../decisions/0006-independent-app-installs.md)). Not yet pushed. It ships in the same push as the 9 Console commits, so the workspace layout is never deployed |

## Open decisions

1. **403 vs 401 for a deactivated organization** (finding 5): either change the backend to 401 (simplest; both
   Android apps already sign out on 401, but they lose the specific message), or keep 403 and update both
   Android apps. Recommendation: keep 403 and handle `Organization is deactivated` explicitly in both apps,
   because it keeps the "your organization is deactivated" message.
2. **UI library**: MUI vs Mantine (ADR-0002 recommends Mantine).
3. **Console hosting target** for `admin.nityagati.com`. It must serve SPA fallback to `index.html` and allow CSP headers.
4. **Durable audit guarantees**: whether audit failure should fail the operation (finding 6).

## Next actions (prioritized)

See the implementation plan below. Nothing here has been started.

### P0 — protect and unblock (no feature work)

1. ~~Commit the independent-install fix and docs~~ (done: `436dd82`, `08c0874`). Push all 12 commits of `nityagati-web/develop` to `origin` in one push *(needs approval)*.
   **The push deploys the public website** through Cloudflare Pages: watch the Pages build log and check `nityagati.com` afterwards.
2. Choose hosting for the Console. Create DNS for `admin.nityagati.com`.
3. Add `https://admin.nityagati.com` to production `CORS_ALLOWED_ORIGINS` and restart the API *(production change, needs approval)*.
4. Confirm in production that migration `0019` is applied and that `PLATFORM_STAFF_JWT_SECRET_KEY` is set. Create the first
   staff account through the documented operator path *(production, needs approval)*.

### P1 — first deployment and production verification

5. Deploy `apps/admin` (static build with `VITE_API_BASE_URL=https://api.nityagati.com`, SPA fallback, CSP, HTTPS).
6. Run a production smoke test with a dedicated test organization: login → list → create → details → users →
   deactivate (confirm Android login is blocked) → reactivate → audit events show both changes. *(Creates
   production data; needs approval.)*
7. Tag the web release.

### P2 — hardening the Console

8. Decide and implement the 403 handling for deactivated orgs in both Android apps (open decision 1).
9. Add frontend tests (Vitest + Testing Library) for the auth flow, the 401 handler, and the create-org one-time password.
10. Add a global error boundary. Show 422 field errors. Add an expiry warning or re-login prompt that keeps the current page.
11. Add copy-to-clipboard and a leave-page guard on the one-time password screens.
12. Fix the backend test-suite isolation so the full suite runs in one process.

### P3 — stack alignment (behaviour-preserving)

13. Adopt TanStack Query → UI library → RHF + Zod in `apps/admin`, one commit each (ADR-0002).
14. Evaluate OpenAPI type generation (ADR-0005). It must be in place before `apps/erp`.

### Deferred

Staff roles, durable login audit, org editing, reset/delete through the Console (needs staff-authenticated
backend routes first), entitlements, billing, and the Web ERP.
