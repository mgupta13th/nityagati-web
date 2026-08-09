import type { Metadata } from "next";
import Link from "next/link";
import HeroPanel from "../components/HeroPanel";
import BrandWord from "../components/BrandWord";
import ConnectedSystem from "../components/ConnectedSystem";
import InsideNityagati from "../components/InsideNityagati";
import Capabilities from "../components/Capabilities";
import WhySection from "../components/WhySection";
import CTABand from "../components/CTABand";
import Icon from "../components/icons";
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
    images: ["/nityagati_logo.svg"],
  },
};

function Kicker({ children }: { children: string }) {
  return (
    <span className="kicker">
      <span className="kickerTick" />
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <div className={styles.pageShell}>
      <div className={styles.pageSpine} aria-hidden="true" />

      {/* Hero */}
      <section className={`section ${styles.hero}`}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <Kicker>Nityagati ERP</Kicker>
            <h1 className={styles.heroHeading}>
              Simple business management for growing manufacturers.
            </h1>
            <p className="lede">
              Nityagati brings accounting, inventory, production, and
              workforce management into one simple platform — built for
              small and growing manufacturing businesses.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/products" className="btn btnPrimary">
                <span>Explore <BrandWord /> ERP</span>
              </Link>
              <Link href="/contact" className="btn btnOutline">
                Get in Touch
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <HeroPanel />
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="section">
        <div className={`container ${styles.problemGrid}`}>
          <div>
            <Kicker>The problem</Kicker>
            <p className={styles.problemStatement}>
              Many manufacturing businesses run on a mix of spreadsheets,
              notebooks, WhatsApp messages, and separate accounting
              software.{" "}
              <em>
                Nityagati Business ERP brings this together into one
                straightforward application, so business information
                doesn&apos;t have to live in five different places.
              </em>
            </p>
          </div>

          <div className={styles.scatter} aria-hidden="true">
            <span className={styles.scatterChip}>
              <span className={`iconPlate ${styles.scatterIcon}`}>
                <Icon name="spreadsheet" />
              </span>
              Spreadsheets
            </span>
            <span className={styles.scatterChip}>
              <span className={`iconPlate ${styles.scatterIcon}`}>
                <Icon name="chat" />
              </span>
              Messaging apps
            </span>
            <span className={styles.scatterChip}>
              <span className={`iconPlate ${styles.scatterIcon}`}>
                <Icon name="notebook" />
              </span>
              Notebooks
            </span>
            <span className={styles.scatterArrow}>→</span>
            <span className={styles.scatterResult}>
              <img
                src="/nityagati_logo_inverted.svg"
                alt=""
                width={24}
                height={24}
                className={styles.scatterLogo}
              />
              <BrandWord />
            </span>
          </div>
        </div>
      </section>

      {/* Connected system */}
      <section className="section sectionAlt">
        <div className="container">
          <div className={styles.sectionHead}>
            <Kicker>The connected system</Kicker>
            <h2>One platform, not five.</h2>
          </div>

          <ConnectedSystem />

          <p className={styles.systemNote}>
            An order placed in Sales affects Inventory the moment it&apos;s
            confirmed, Production the moment it&apos;s scheduled, and
            Accounts the moment it&apos;s billed — while Workforce keeps its
            own record of who did the work. One connected system, not five
            separate tools.
          </p>
        </div>
      </section>

      {/* Inside Nityagati */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHead}>
            <Kicker>Inside Nityagati</Kicker>
            <h2>Five parts, one product.</h2>
          </div>
          <p className={styles.fragmentsIntro}>
            The screens below are illustrative representations of Nityagati
            ERP, built to show how the modules connect — not live
            screenshots.
          </p>

          <InsideNityagati />
        </div>
      </section>

      {/* Capabilities */}
      <section className="section sectionAlt">
        <div className="container">
          <div className={styles.sectionHead}>
            <Kicker>Capabilities</Kicker>
            <h2>The essential tools, in one app.</h2>
          </div>

          <Capabilities />

          <p className={styles.availability}>
            Nityagati ERP is currently available as a mobile application on
            Android.
          </p>
        </div>
      </section>

      {/* Why Nityagati */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHead}>
            <Kicker>Why Nityagati</Kicker>
            <h2>
              Why <BrandWord />
            </h2>
          </div>

          <WhySection />
        </div>
      </section>

      {/* Closing CTA */}
      <CTABand
        heading="Want to learn more?"
        copy="Get in touch and we'll walk you through what Nityagati Business ERP can do for your business."
        ctaLabel="Get in Touch"
        ctaHref="/contact"
      />
    </div>
  );
}
