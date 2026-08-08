"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.logoLink} aria-label="Nityagati home">
          <Image
            src="/nityagati_logo_primary_navyblue.png"
            alt="Nityagati"
            width={150}
            height={100}
            priority
            style={{ width: "88px", height: "auto" }}
          />
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/contact" className={`btn btnPrimary ${styles.desktopCta}`}>
          Contact Us
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className={styles.menuIcon} data-open={open} />
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className={styles.mobileNav}
          aria-label="Mobile"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <ul className={styles.mobileNavList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className={`btn btnPrimary ${styles.mobileCta}`}
            onClick={() => setOpen(false)}
          >
            Contact Us
          </Link>
        </nav>
      )}
    </header>
  );
}
