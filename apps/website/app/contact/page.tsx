import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Nityagati",
  description: "Get in touch with Nityagati to learn more about Nityagati Business ERP.",
  alternates: { canonical: "https://nityagati.com/contact" },
  openGraph: {
    title: "Contact Nityagati",
    description:
      "Get in touch with Nityagati to learn more about Nityagati Business ERP.",
    url: "https://nityagati.com/contact",
    images: ["/nityagati_logo.svg"],
  },
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Get in Touch</h1>
        <p className="lede">
          Have a question about Nityagati Business ERP or want to learn
          more? Reach out and we&apos;ll get back to you.
        </p>
        <p>
          <a href="mailto:support@nityagati.com" className="btn btnPrimary">
            support@nityagati.com
          </a>
        </p>
      </div>
    </section>
  );
}
