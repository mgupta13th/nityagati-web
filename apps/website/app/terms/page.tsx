import type { Metadata } from "next";
import LegalDocumentView from "../../components/LegalDocumentView";
import { termsOfServiceDocument } from "../../content/terms-of-service";

export const metadata: Metadata = {
  title: "Terms of Service — Nityagati",
  description: "Nityagati's Terms of Service govern the use of the Nityagati platform and applications.",
  alternates: { canonical: "https://nityagati.com/terms" },
  openGraph: {
    title: "Terms of Service — Nityagati",
    description:
      "Nityagati's Terms of Service govern the use of the Nityagati platform and applications.",
    url: "https://nityagati.com/terms",
  },
};

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Terms of Service</h1>
        <LegalDocumentView document={termsOfServiceDocument} />
      </div>
    </section>
  );
}
