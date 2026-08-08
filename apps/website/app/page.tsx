import type { Metadata } from "next";
import Link from "next/link";
import CapabilityList from "../components/CapabilityList";
import ValuePropGrid from "../components/ValuePropGrid";
import CTABand from "../components/CTABand";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Nityagati — Business Management for Manufacturing Businesses",
  description:
    "Nityagati Business ERP helps manufacturing businesses manage accounting, inventory, production, sales, and workforce operations from one mobile-first platform.",
  alternates: { canonical: "https://nityagati.com/" },
  openGraph: {
    title: "Nityagati — Business Management for Manufacturing Businesses",
    description:
      "Nityagati Business ERP helps manufacturing businesses manage accounting, inventory, production, sales, and workforce operations from one mobile-first platform.",
    url: "https://nityagati.com/",
    images: ["/nityagati_logo_primary_navyblue.png"],
  },
};

const CAPABILITIES = [
  { title: "Sales & Orders" },
  { title: "Purchases" },
  { title: "Inventory & Stock" },
  { title: "Production" },
  {
    title: "Accounting & Reports",
    detail: "Ledger, Trial Balance, Profit & Loss, and Balance Sheet.",
  },
  { title: "Attendance & Payroll" },
];

const VALUE_PROPS = [
  {
    title: "Everything in one place",
    detail:
      "Accounting, inventory, production, and workforce data live together instead of being scattered across spreadsheets, notebooks, and messaging apps.",
  },
  {
    title: "Built for mobile, not adapted to it",
    detail:
      "Nityagati Business ERP is mobile-first, so business information is available wherever the owner actually is.",
  },
  {
    title: "Your data stays yours",
    detail:
      "Nityagati does not sell business data and does not claim ownership of it.",
  },
  {
    title: "Straightforward, not overwhelming",
    detail:
      "Designed around how a small manufacturing business actually operates, not as a scaled-down enterprise system.",
  },
  {
    title: "Secure by design",
    detail:
      "HTTPS/TLS encryption, password hashing, role-based access, and organization-level data isolation.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className={`section ${styles.hero}`}>
        <div className="container">
          <h1 className={styles.heroHeading}>
            Simple business management for growing manufacturers.
          </h1>
          <p className="lede">
            Nityagati brings accounting, inventory, production, and
            workforce management into one simple platform — built for small
            and growing manufacturing businesses.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/contact" className="btn btnPrimary">
              Get in Touch
            </Link>
            <Link href="/products" className="btn btnOutline">
              Explore Nityagati Business ERP
            </Link>
          </div>
        </div>
      </section>

      {/* What Nityagati Is */}
      <section className="section">
        <div className="container">
          <h2>A platform for running your business.</h2>
          <p className="lede">
            Nityagati is a technology platform built for businesses that
            need practical, everyday software — not complicated enterprise
            systems. The first Nityagati product, Nityagati Business ERP,
            helps manufacturing businesses manage their daily operations
            from one application.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="section sectionAlt">
        <div className="container">
          <h2>Built for how small manufacturing businesses actually work.</h2>
          <p className="lede">
            Many manufacturing businesses run on a mix of spreadsheets,
            notebooks, WhatsApp messages, and separate accounting software.
            Nityagati Business ERP brings this together into one
            straightforward application, so business information
            doesn&apos;t have to live in five different places.
          </p>
        </div>
      </section>

      {/* Product Spotlight */}
      <section className="section">
        <div className="container">
          <h2>Nityagati Business ERP</h2>
          <p className="lede">
            The essential tools for managing your manufacturing business, in
            one mobile app.
          </p>
          <CapabilityList capabilities={CAPABILITIES} />
          <p className={styles.availability}>
            Nityagati Business ERP is currently available as a mobile
            application on Android.
          </p>
          <Link href="/products" className="btn btnPrimary">
            Explore Nityagati Business ERP
          </Link>
        </div>
      </section>

      {/* Who It's For */}
      <section className="section sectionAlt">
        <div className="container">
          <h2>Built for manufacturing businesses.</h2>
          <p className="lede">
            Nityagati Business ERP is designed for small and growing
            manufacturing businesses — and for the people who run them day
            to day, from business owners to office and operations staff.
          </p>
        </div>
      </section>

      {/* Why Nityagati */}
      <section className="section">
        <div className="container">
          <h2>Why Nityagati</h2>
          <ValuePropGrid items={VALUE_PROPS} />
        </div>
      </section>

      {/* Why We Built Nityagati */}
      <section className="section sectionAlt">
        <div className="container">
          <h2>Why we built Nityagati.</h2>
          <p className="lede">
            Nityagati was built around a simple idea: small and growing
            manufacturing businesses deserve business software that fits
            how they actually work — not a complex enterprise system
            designed for someone else&apos;s business.
          </p>
          <Link href="/about">Learn more about Nityagati →</Link>
        </div>
      </section>

      {/* CTA band */}
      <CTABand
        heading="Want to learn more?"
        copy="Get in touch and we'll walk you through what Nityagati Business ERP can do for your business."
        ctaLabel="Get in Touch"
        ctaHref="/contact"
      />
    </>
  );
}
