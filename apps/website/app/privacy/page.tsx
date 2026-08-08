import type { Metadata } from "next";
import LegalDocumentView from "../../components/LegalDocumentView";
import { privacyPolicyDocument } from "../../content/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy — Nityagati",
  description: "Nityagati's Privacy Policy explains how we collect, use, and protect information.",
  alternates: { canonical: "https://nityagati.com/privacy" },
  openGraph: {
    title: "Privacy Policy — Nityagati",
    description:
      "Nityagati's Privacy Policy explains how we collect, use, and protect information.",
    url: "https://nityagati.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Privacy Policy</h1>
        <LegalDocumentView document={privacyPolicyDocument} />
      </div>
    </section>
  );
}
