import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Image
            src="/nityagati_logo_primary_white.png"
            alt="Nityagati"
            width={150}
            height={100}
            style={{ width: "64px", height: "auto" }}
          />
          <p className={styles.tagline}>
            Business management for manufacturing businesses.
          </p>
        </div>

        <div>
          <h3 className={styles.heading}>Navigation</h3>
          <ul className={styles.list}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={styles.heading}>Legal</h3>
          <ul className={styles.list}>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={styles.heading}>Contact</h3>
          <ul className={styles.list}>
            <li>
              <a href="mailto:support@nityagati.com">support@nityagati.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© 2026 FalgunSoft Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
}
