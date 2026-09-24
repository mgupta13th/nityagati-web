import { apiRequest } from "../api/client";

export interface OrganizationSummary {
  id: string;
  name: string;
  mobile: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
}

export interface OrganizationListResponse {
  items: OrganizationSummary[];
  total: number;
  page: number;
  size: number;
  has_more: boolean;
}

export interface ListOrganizationsParams {
  search?: string;
  page?: number;
  size?: number;
}

export function fetchOrganizations(
  token: string,
  { search, page = 1, size = 50 }: ListOrganizationsParams = {},
): Promise<OrganizationListResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (search) {
    params.set("search", search);
  }

  return apiRequest<OrganizationListResponse>(
    `/platform-admin/organizations?${params.toString()}`,
    { token },
  );
}

// Mirrors the backend's PlatformOrganizationCreateRequest exactly
// (schemas/platform_admin.py) -- no operator (derived server-side from
// the authenticated Platform Staff principal) and no owner_password (the
// backend always generates one, returned once below).
export interface CreateOrganizationRequest {
  name: string;
  mobile?: string;
  email?: string;
  gstin?: string;
  pan?: string;
  address?: string;
  owner_name: string;
  owner_mobile: string;
  owner_email?: string;
}

// Mirrors the backend's OrganizationProvisioningResponse -- reused as-is
// by the new endpoint, so reused as-is here too.
export interface CreateOrganizationResponse {
  organization_id: string;
  organization_name: string;
  owner_id: string;
  owner_mobile: string;
  generated_password: string | null;
}

export function createOrganization(
  token: string,
  data: CreateOrganizationRequest,
): Promise<CreateOrganizationResponse> {
  return apiRequest<CreateOrganizationResponse>("/platform-admin/organizations", {
    method: "POST",
    token,
    body: data,
  });
}

// Mirrors the backend's PlatformOrganizationOwnerSummary exactly --
// name/mobile/email only, never a password hash or any auth field.
export interface OrganizationOwnerSummary {
  name: string;
  mobile: string;
  email: string | null;
}

// Mirrors the backend's PlatformOrganizationDetail exactly
// (schemas/platform_admin.py). updated_at is deliberately absent on the
// backend response too -- see that schema's own docstring.
export interface OrganizationDetail {
  id: string;
  name: string;
  is_active: boolean;
  mobile: string | null;
  email: string | null;
  address: string | null;
  gstin: string | null;
  pan: string | null;
  created_at: string;
  owner: OrganizationOwnerSummary | null;
}

export function fetchOrganization(token: string, organizationId: string): Promise<OrganizationDetail> {
  return apiRequest<OrganizationDetail>(`/platform-admin/organizations/${organizationId}`, {
    token,
  });
}

// Mirrors the backend's PlatformOrganizationUserSummary exactly --
// status is Membership.status (or a User.is_active-derived fallback),
// never a password hash or any other auth field.
export interface OrganizationUserSummary {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  role: string;
  status: string;
  created_at: string;
}

export interface OrganizationUserListResponse {
  items: OrganizationUserSummary[];
  total: number;
  page: number;
  size: number;
  has_more: boolean;
}

export interface ListOrganizationUsersParams {
  search?: string;
  page?: number;
  size?: number;
}

export function fetchOrganizationUsers(
  token: string,
  organizationId: string,
  { search, page = 1, size = 50 }: ListOrganizationUsersParams = {},
): Promise<OrganizationUserListResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (search) {
    params.set("search", search);
  }

  return apiRequest<OrganizationUserListResponse>(
    `/platform-admin/organizations/${organizationId}/users?${params.toString()}`,
    { token },
  );
}
