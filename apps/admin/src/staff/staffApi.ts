import { apiRequest } from "../api/client";

// Mirrors the backend's PlatformStaffAccountSummary exactly
// (schemas/platform_staff.py) -- never a password hash or any other
// authentication field.
export interface StaffAccountSummary {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface StaffAccountListResponse {
  items: StaffAccountSummary[];
  total: number;
  page: number;
  size: number;
  has_more: boolean;
}

export interface ListStaffParams {
  search?: string;
  page?: number;
  size?: number;
}

export function fetchStaff(
  token: string,
  { search, page = 1, size = 50 }: ListStaffParams = {},
): Promise<StaffAccountListResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (search) {
    params.set("search", search);
  }

  return apiRequest<StaffAccountListResponse>(`/platform-admin/staff?${params.toString()}`, {
    token,
  });
}

// Mirrors the backend's PlatformStaffCreateRequest exactly -- no password
// field; the backend always generates one, returned once below.
export interface CreateStaffRequest {
  name: string;
  email: string;
}

// Mirrors the backend's PlatformStaffCreateResponse exactly.
export interface CreateStaffResponse {
  id: string;
  name: string;
  email: string;
  generated_password: string;
}

export function createStaff(token: string, data: CreateStaffRequest): Promise<CreateStaffResponse> {
  return apiRequest<CreateStaffResponse>("/platform-admin/staff", {
    method: "POST",
    token,
    body: data,
  });
}

// Mirrors the backend's PlatformStaffStatusUpdateResponse exactly.
export interface StaffStatusUpdateResponse {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
}

export function setStaffStatus(
  token: string,
  staffId: string,
  active: boolean,
): Promise<StaffStatusUpdateResponse> {
  return apiRequest<StaffStatusUpdateResponse>(`/platform-admin/staff/${staffId}/status`, {
    method: "PATCH",
    token,
    body: { active },
  });
}
