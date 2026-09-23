import { apiRequest } from "../api/client";

export interface PlatformStaffSummary {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  platform_staff: PlatformStaffSummary;
}

export interface MeResponse {
  platform_staff_id: string;
  email: string;
  name: string;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/platform-admin/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function fetchMe(token: string): Promise<MeResponse> {
  return apiRequest<MeResponse>("/platform-admin/auth/me", { token });
}
