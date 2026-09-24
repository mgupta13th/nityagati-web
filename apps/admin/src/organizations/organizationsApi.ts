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
