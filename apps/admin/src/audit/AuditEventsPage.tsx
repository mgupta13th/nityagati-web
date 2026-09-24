import { useEffect, useState, type FormEvent } from "react";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { fetchAuditEvents, type AuditEventSummary } from "./auditEventsApi";

const PAGE_SIZE = 20;

type LoadState = "loading" | "loaded" | "error";

function targetLabel(event: AuditEventSummary): string {
  if (!event.target_type || !event.target_id) {
    return "—";
  }
  return `${event.target_type} ${event.target_id}`;
}

export default function AuditEventsPage() {
  const { token } = useAuth();

  const [items, setItems] = useState<AuditEventSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [organizationInput, setOrganizationInput] = useState("");
  const [actorInput, setActorInput] = useState("");
  const [eventTypeInput, setEventTypeInput] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [actorEmail, setActorEmail] = useState("");
  const [eventType, setEventType] = useState("");

  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;
    setState("loading");
    setError(null);

    fetchAuditEvents(token, {
      organizationId: organizationId || undefined,
      actorEmail: actorEmail || undefined,
      eventType: eventType || undefined,
      page,
      size: PAGE_SIZE,
    })
      .then((response) => {
        if (cancelled) return;
        setItems(response.items);
        setTotal(response.total);
        setHasMore(response.has_more);
        setState("loaded");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError ? err.message : "Unable to load audit events. Please try again.",
        );
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [token, organizationId, actorEmail, eventType, page]);

  function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setOrganizationId(organizationInput.trim());
    setActorEmail(actorInput.trim());
    setEventType(eventTypeInput.trim());
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section>
      <h2>Audit Events</h2>

      <form onSubmit={handleFilterSubmit}>
        <label htmlFor="audit-organization">Organization ID</label>
        <br />
        <input
          id="audit-organization"
          type="text"
          value={organizationInput}
          onChange={(event) => setOrganizationInput(event.target.value)}
          placeholder="Organization ID"
        />
        <br />
        <label htmlFor="audit-actor">Actor email</label>
        <br />
        <input
          id="audit-actor"
          type="text"
          value={actorInput}
          onChange={(event) => setActorInput(event.target.value)}
          placeholder="Actor email"
        />
        <br />
        <label htmlFor="audit-event-type">Event type</label>
        <br />
        <input
          id="audit-event-type"
          type="text"
          value={eventTypeInput}
          onChange={(event) => setEventTypeInput(event.target.value)}
          placeholder="e.g. ORGANIZATION_STATUS_CHANGED"
        />
        <br />
        <button type="submit">Filter</button>
      </form>

      {state === "loading" && <p>Loading audit events...</p>}

      {state === "error" && <p role="alert">{error}</p>}

      {state === "loaded" && items.length === 0 && <p>No audit events found.</p>}

      {state === "loaded" && items.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Actor</th>
                <th>Organization</th>
                <th>Target</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {items.map((event) => (
                <tr key={event.id}>
                  <td>{event.event_type}</td>
                  <td>{event.actor_email}</td>
                  <td>{event.organization_id ?? "—"}</td>
                  <td>{targetLabel(event)}</td>
                  <td>{new Date(event.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>
            Page {page} of {totalPages} ({total} total)
          </p>
          <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
            Previous
          </button>
          <button type="button" disabled={!hasMore} onClick={() => setPage((current) => current + 1)}>
            Next
          </button>
        </>
      )}
    </section>
  );
}
