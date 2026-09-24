import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { createStaff, type CreateStaffResponse } from "./staffApi";

interface FormState {
  name: string;
  email: string;
}

const EMPTY_FORM: FormState = { name: "", email: "" };

export default function CreateStaffPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateStaffResponse | null>(null);

  function update(field: keyof FormState) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Belt-and-braces against a duplicate submission alongside the
    // disabled submit button below -- same pattern as CreateOrganizationPage.
    if (submitting || !token) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const response = await createStaff(token, {
        name: form.name.trim(),
        email: form.email.trim(),
      });
      setResult(response);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to create platform staff account. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Success state -- shown in place of the form, not auto-navigated away
  // from, so the one-time generated password can actually be read/copied
  // before it's gone. Same pattern as CreateOrganizationPage.
  if (result) {
    return (
      <section>
        <h2>Platform staff account created</h2>
        <p>
          <strong>{result.name}</strong> ({result.email}) was created successfully.
        </p>
        <dl>
          <dt>Generated password</dt>
          <dd>
            <code>{result.generated_password}</code>
          </dd>
        </dl>
        <p role="alert">Record this password now -- it will not be shown again.</p>
        <button type="button" onClick={() => navigate("/staff")}>
          Done -- Back to Platform Staff
        </button>
      </section>
    );
  }

  return (
    <section>
      <h2>Create Platform Staff Account</h2>

      <form onSubmit={handleSubmit}>
        <fieldset disabled={submitting}>
          <div>
            <label htmlFor="staff-name">Name *</label>
            <br />
            <input id="staff-name" type="text" value={form.name} onChange={update("name")} required />
          </div>
          <div>
            <label htmlFor="staff-email">Email *</label>
            <br />
            <input
              id="staff-email"
              type="email"
              value={form.email}
              onChange={update("email")}
              required
            />
          </div>
          <p>A temporary password will be generated automatically and shown once after creation.</p>
        </fieldset>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Platform Staff"}
        </button>{" "}
        <Link to="/staff">Cancel</Link>
      </form>
    </section>
  );
}
