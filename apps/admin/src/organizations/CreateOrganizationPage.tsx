import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { createOrganization, type CreateOrganizationResponse } from "./organizationsApi";

interface FormState {
  name: string;
  mobile: string;
  email: string;
  gstin: string;
  pan: string;
  address: string;
  owner_name: string;
  owner_mobile: string;
  owner_email: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  mobile: "",
  email: "",
  gstin: "",
  pan: "",
  address: "",
  owner_name: "",
  owner_mobile: "",
  owner_email: "",
};

export default function CreateOrganizationPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateOrganizationResponse | null>(null);

  function update(field: keyof FormState) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Belt-and-braces against a duplicate submission alongside the
    // disabled submit button below (covers a fast double Enter-press
    // that fires before React re-renders the disabled state).
    if (submitting || !token) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const response = await createOrganization(token, {
        name: form.name.trim(),
        mobile: form.mobile.trim() || undefined,
        email: form.email.trim() || undefined,
        gstin: form.gstin.trim() || undefined,
        pan: form.pan.trim() || undefined,
        address: form.address.trim() || undefined,
        owner_name: form.owner_name.trim(),
        owner_mobile: form.owner_mobile.trim(),
        owner_email: form.owner_email.trim() || undefined,
      });
      setResult(response);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to create organization. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Success state -- shown in place of the form, not auto-navigated away
  // from, so the one-time generated password can actually be read/copied
  // before it's gone. "Navigate back to Organizations List" is the
  // explicit button below, not an automatic redirect.
  if (result) {
    return (
      <section>
        <h2>Organization created</h2>
        <p>
          <strong>{result.organization_name}</strong> was created successfully.
        </p>
        <dl>
          <dt>Owner mobile</dt>
          <dd>{result.owner_mobile}</dd>
          {result.generated_password && (
            <>
              <dt>Generated owner password</dt>
              <dd>
                <code>{result.generated_password}</code>
              </dd>
            </>
          )}
        </dl>
        {result.generated_password && (
          <p role="alert">Record this password now -- it will not be shown again.</p>
        )}
        <button type="button" onClick={() => navigate("/organizations")}>
          Done -- Back to Organizations List
        </button>
      </section>
    );
  }

  return (
    <section>
      <h2>Create Organization</h2>

      <form onSubmit={handleSubmit}>
        <fieldset disabled={submitting}>
          <legend>Organization</legend>

          <div>
            <label htmlFor="org-name">Name *</label>
            <br />
            <input id="org-name" type="text" value={form.name} onChange={update("name")} required />
          </div>
          <div>
            <label htmlFor="org-mobile">Mobile</label>
            <br />
            <input id="org-mobile" type="text" value={form.mobile} onChange={update("mobile")} />
          </div>
          <div>
            <label htmlFor="org-email">Email</label>
            <br />
            <input id="org-email" type="email" value={form.email} onChange={update("email")} />
          </div>
          <div>
            <label htmlFor="org-gstin">GSTIN</label>
            <br />
            <input id="org-gstin" type="text" value={form.gstin} onChange={update("gstin")} />
          </div>
          <div>
            <label htmlFor="org-pan">PAN</label>
            <br />
            <input id="org-pan" type="text" value={form.pan} onChange={update("pan")} />
          </div>
          <div>
            <label htmlFor="org-address">Address</label>
            <br />
            <textarea id="org-address" value={form.address} onChange={update("address")} />
          </div>
        </fieldset>

        <fieldset disabled={submitting}>
          <legend>Owner</legend>

          <div>
            <label htmlFor="owner-name">Name *</label>
            <br />
            <input
              id="owner-name"
              type="text"
              value={form.owner_name}
              onChange={update("owner_name")}
              required
            />
          </div>
          <div>
            <label htmlFor="owner-mobile">Mobile *</label>
            <br />
            <input
              id="owner-mobile"
              type="text"
              value={form.owner_mobile}
              onChange={update("owner_mobile")}
              required
            />
          </div>
          <div>
            <label htmlFor="owner-email">Email</label>
            <br />
            <input
              id="owner-email"
              type="email"
              value={form.owner_email}
              onChange={update("owner_email")}
            />
          </div>
          <p>A temporary password will be generated automatically and shown once after creation.</p>
        </fieldset>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Organization"}
        </button>{" "}
        <Link to="/organizations">Cancel</Link>
      </form>
    </section>
  );
}
