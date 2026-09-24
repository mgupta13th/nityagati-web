import { apiRequest } from "../api/client";

// Mirrors the backend's PlatformAuditEventSummary exactly
// (schemas/platform_audit_event.py) -- never a password hash, JWT, API
// key, or any other authentication secret; see that model's own
// docstring for what is and isn't ever written to event_metadata.
export interface AuditEventSummary {
  id: string;
  event_type: string;
  actor_email: string;
  organization_id: string | null;
  target_type: string | null;
  target_id: string | null;
  event_metadata: Record<string, unknown>;
  created_at: string;
}

export interface AuditEventListResponse {
  items: AuditEventSummary[];
  total: number;
  page: number;
  size: number;
  has_more: boolean;
}

export interface ListAuditEventsParams {
  organizationId?: string;
  actorEmail?: string;
  eventType?: string;
  page?: number;
  size?: number;
}

export function fetchAuditEvents(
  token: string,
  { organizationId, actorEmail, eventType, page = 1, size = 50 }: ListAuditEventsParams = {},
): Promise<AuditEventListResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (organizationId) {
    params.set("organization_id", organizationId);
  }
  if (actorEmail) {
    params.set("actor_email", actorEmail);
  }
  if (eventType) {
    params.set("event_type", eventType);
  }

  return apiRequest<AuditEventListResponse>(`/platform-admin/audit-events?${params.toString()}`, {
    token,
  });
}
