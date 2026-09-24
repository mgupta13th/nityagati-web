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
