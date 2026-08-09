import Link from "next/link";
import styles from "./CTABand.module.css";

export default function CTABand({
  heading,
  copy,
  ctaLabel,
  ctaHref,
}: {
  heading: string;
  copy: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className={`section sectionNavy ${styles.band}`}>
      <div className="container">
        <span className={styles.terminus} aria-hidden="true" />
        <h2>{heading}</h2>
        <p className={styles.copy}>{copy}</p>
        <Link href={ctaHref} className="btn btnPrimary" style={{ background: "#fff", color: "var(--color-navy)" }}>
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
