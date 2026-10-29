# ADR-0002 — Frontend stack

- **Status:** Accepted. Partially adopted. UI library choice open.
- **Source:** Project direction for Nityagati Web (restated 2026-10-30). React + Vite is also in *Product &
  Application Architecture v1* §17.

## Decision

| Concern | Choice |
|---|---|
| Language / build | TypeScript, React, Vite |
| Routing | React Router |
| Server state | TanStack Query |
| Forms / validation | React Hook Form + Zod |
| Component library | MUI **or** Mantine. **Not yet chosen.** |

The stack applies to `apps/admin` and to the future `apps/erp`.

## Current state (verified 2026-10-30 from `apps/admin/package.json` and source)

`apps/admin` uses React 19, Vite 8, TypeScript 5.9 and `react-router` 7. It does **not** use TanStack Query,
React Hook Form, Zod or any component library. Data loading uses `useEffect`/`useState`, forms are controlled
inputs, and the markup is unstyled HTML.

The implementation is not wrong. It was deliberately minimal, scaffold-first work. But it does not yet match
this decision.

## Consequences / required follow-up (approval-gated)

1. Choose MUI or Mantine. Recommendation: **Mantine**. It is lighter, it has a good built-in table, form and
   notification set for a data-dense internal tool, and it carries less theming overhead. MUI is equally
   viable if Material alignment with the Flutter app matters more.
2. Migrate `apps/admin` in small, behaviour-preserving commits: TanStack Query for reads and mutations first,
   then the UI library, then RHF + Zod on the two create forms. No feature changes in those commits.
3. `apps/erp` starts directly on the full stack.
