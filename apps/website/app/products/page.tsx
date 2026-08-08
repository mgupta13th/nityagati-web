import type { Metadata } from "next";
import CapabilityList from "../../components/CapabilityList";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Nityagati Business ERP — Business Management for Manufacturers",
  description:
    "Nityagati Business ERP helps manufacturing businesses manage sales, purchases, inventory, production, accounting, and payroll from one mobile application.",
  alternates: { canonical: "https://nityagati.com/products" },
  openGraph: {
    title: "Nityagati Business ERP — Business Management for Manufacturers",
    description:
      "Nityagati Business ERP helps manufacturing businesses manage sales, purchases, inventory, production, accounting, and payroll from one mobile application.",
    url: "https://nityagati.com/products",
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

export default function ProductsPage() {
  return (
    <>
      <section className="section">
        <div className="container">
          <h1>Nityagati Business ERP</h1>
          <p className="lede">
            Nityagati Business ERP is the first product on the Nityagati
            platform — a mobile-first application that helps manufacturing
            businesses manage their daily operations.
          </p>

          <p className={`eyebrow ${styles.eyebrowSpacing}`}>Available now</p>
          <CapabilityList capabilities={CAPABILITIES} />
          <p className={styles.availability}>
            Nityagati Business ERP is currently available as a mobile
            application on Android.
          </p>
        </div>
      </section>

      <section className="section sectionAlt">
        <div className="container">
          <p className="eyebrow">Planned</p>
          <ul className={styles.plannedList}>
            <li className="card">
              <h3>Nityagati Business ERP Web</h3>
              <p>A browser-based version for office use, planned for the future.</p>
            </li>
            <li className="card">
              <h3>Nityagati Workforce</h3>
              <p>
                A future application for workers to view their own
                attendance and pay information.
              </p>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
