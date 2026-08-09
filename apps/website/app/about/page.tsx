import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Nityagati — Practical Business Software for Manufacturers",
  description:
    "Learn about Nityagati, a technology platform built to help manufacturing businesses manage their operations simply and practically.",
  alternates: { canonical: "https://nityagati.com/about" },
  openGraph: {
    title: "About Nityagati — Practical Business Software for Manufacturers",
    description:
      "Learn about Nityagati, a technology platform built to help manufacturing businesses manage their operations simply and practically.",
    url: "https://nityagati.com/about",
    images: ["/nityagati_logo.svg"],
  },
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>About Nityagati</h1>

        <h2>What Nityagati Is</h2>
        <p className="lede">
          Nityagati is a technology platform built for businesses that need
          practical, everyday software — not complicated enterprise
          systems. The first Nityagati product, Nityagati Business ERP,
          helps manufacturing businesses manage their daily operations from
          one application.
        </p>

        <h2>The Problem We&apos;re Solving</h2>
        <p className="lede">
          Many manufacturing businesses run on a mix of spreadsheets,
          notebooks, WhatsApp messages, and separate accounting software.
          Nityagati Business ERP brings this together into one
          straightforward application, so business information
          doesn&apos;t have to live in five different places.
        </p>

        <h2>Our Approach</h2>
        <p className="lede">
          We believe business software should be simple enough to use
          without training, and practical enough to solve real daily
          problems — not a system built for a different kind of business.
        </p>

        <h2>Looking Ahead</h2>
        <p className="lede">
          Nityagati Business ERP is the first product built on the
          Nityagati platform. Over time, Nityagati is intended to grow into
          a broader set of tools for the businesses we serve.
        </p>

        <h2>Who&apos;s Behind Nityagati</h2>
        <p className="lede">
          Nityagati is developed and operated by FalgunSoft Technologies.
        </p>
      </div>
    </section>
  );
}
