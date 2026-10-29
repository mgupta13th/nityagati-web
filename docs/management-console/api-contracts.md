# Management Console — API contracts

The endpoints the Console calls. They were verified on 2026-10-30 in two ways:

- **Code:** `FactoryFlow360/backend/app/api/platform_staff_*.py`, `platform_audit_events.py` and `schemas/platform_*.py` at `1ec20d4`.
- **Deployed:** `GET https://api.nityagati.com/openapi.json` lists every path below.

The TypeScript mirrors live in `apps/admin/src/**/*Api.ts` and match these schemas field-for-field.

All routes require `Authorization: Bearer <platform staff token>`, except login. Timestamps are ISO-8601
strings and IDs are UUID strings.

## Shared shapes

```ts
type Page<T> = { items: T[]; total: number; page: number; size: number; has_more: boolean };
// List query params: page (>=1, default 1), size (1..200, default 50)
// Errors: { detail: string } | { detail: { message: string } } | 422 { detail: ValidationError[] }
```

## Authentication

| Method & path | Request | Response | Backend schema |
|---|---|---|---|
| `POST /platform-admin/auth/login` | `{ email, password }` | `{ access_token, token_type, platform_staff: { id, email, name } }` | `PlatformStaffLoginRequest` / `PlatformStaffLoginResponse` |
| `GET /platform-admin/auth/me` | — | `{ platform_staff_id, email, name }` | `PlatformStaffMeResponse` |

## Organizations

| Method & path | Request | Response | Backend schema |
|---|---|---|---|
| `GET /platform-admin/organizations` | `?search` (name, mobile, or email) `&page&size` | `Page<{ id, name, mobile?, email?, is_active, created_at }>` | `PlatformOrganizationListResponse` |
| `POST /platform-admin/organizations` → **201** | `{ name, owner_name, owner_mobile, mobile?, email?, gstin?, pan?, address?, owner_email? }` | `{ organization_id, organization_name, owner_id, owner_mobile, generated_password? }` | `PlatformOrganizationCreateRequest` / `OrganizationProvisioningResponse` |
| `GET /platform-admin/organizations/{id}` | — | `{ id, name, is_active, mobile?, email?, address?, gstin?, pan?, created_at, owner?: { name, mobile, email? } }` | `PlatformOrganizationDetail` |
| `GET /platform-admin/organizations/{id}/users` | `?search&page&size` | `Page<{ id, name, mobile, email?, role, status, created_at }>` | `PlatformOrganizationUserListResponse` |
| `PATCH /platform-admin/organizations/{id}/status` | `{ active: boolean }` | `PlatformOrganizationDetail` | `PlatformOrganizationStatusUpdateRequest` |

Notes:

- The create request has no `operator` and no `owner_password`. The backend derives the operator from the
  session and always generates the password. Field validators (name, mobile, email, GSTIN, PAN) return **422**.
- `generated_password` is typed optional because the response schema is shared with the API-key route. On
  the staff route it is always present.
- `users[].status` is `Membership.status` (for example `ACTIVE`, `SUSPENDED`).

## Platform Staff accounts

| Method & path | Request | Response | Backend schema |
|---|---|---|---|
| `GET /platform-admin/staff` | `?search` (name or email) `&page&size` | `Page<{ id, name, email, is_active, created_at }>` | `PlatformStaffAccountListResponse` |
| `POST /platform-admin/staff` → **201** | `{ name, email }` | `{ id, name, email, generated_password }` | `PlatformStaffCreateRequest` / `PlatformStaffCreateResponse` |
| `PATCH /platform-admin/staff/{id}/status` | `{ active: boolean }` | `{ id, name, email, is_active }` | `PlatformStaffStatusUpdateResponse` |

409 is returned for a duplicate email and for self-deactivation.

## Audit events

| Method & path | Request | Response | Backend schema |
|---|---|---|---|
| `GET /platform-admin/audit-events` | `?organization_id&actor_email&event_type&page&size` | `Page<{ id, event_type, actor_email, organization_id?, target_type?, target_id?, event_metadata, created_at }>` | `PlatformAuditEventListResponse` |

Newest first. Read-only.

## Routes the Console must NOT call

These share the `/platform-admin/organizations` prefix or sit beside it, but they use static API keys
(`X-Platform-Admin-Key`, `X-Organization-Provisioning-Key`) that must never reach a browser:

- `GET /platform-admin/organizations/{id}/reset-preview`, `POST …/reset-business-data`
- `GET /platform-admin/organizations/{id}/deletion-preview`, `DELETE /platform-admin/organizations/{id}`
- `POST /organization-provisioning`

## Changing a contract

1. Change the backend schema and its tests in `FactoryFlow360` first. The change must stay backward compatible
   for the Android apps.
2. Update the mirror in `apps/admin/src/**/*Api.ts` and this file in the same change.
3. Once OpenAPI client generation is adopted ([ADR-0005](../decisions/0005-hand-written-api-client-until-openapi-generation.md)),
   this file becomes a summary and the generated types become the contract.
