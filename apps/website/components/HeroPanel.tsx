import Logo from "./Logo";
import styles from "./HeroPanel.module.css";

const TABS = ["Sales", "Inventory", "Production", "Accounts", "Workforce"];

/**
 * Illustrative preview of Nityagati ERP shown in the hero. Deliberately
 * built as a small tabbed app window (not a full dashboard) so it reads
 * as real software without dominating the hero. All figures are sample
 * data, not real customer results.
 */
export default function HeroPanel() {
  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <div className={styles.topbar}>
          <Logo className={styles.topbarMark} suffix="ERP" />
        </div>

        <div className={styles.tabs}>
          {TABS.map((tab, i) => (
            <span key={tab} className={`${styles.tab} ${i === 0 ? styles.tabActive : ""}`}>
              {tab}
            </span>
          ))}
        </div>

        <div className={styles.flowstrip} aria-hidden="true">
          {TABS.map((tab, i) => (
            <span key={tab} className={styles.flowSegment}>
              <span className={`${styles.fdot} ${i === 0 ? styles.fdotActive : ""}`} />
              {i < TABS.length - 1 && <span className={styles.fline} />}
            </span>
          ))}
        </div>

        <div className={styles.content}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>New Orders</span>
              <span className={styles.statValue}>6</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Pending Payments</span>
              <span className={styles.statValue}>₹86,400</span>
            </div>
          </div>

          <div className={styles.rows}>
            <div className={styles.row}>
              <span>Order #1042 — Customer A</span>
              <span className={styles.chip}>Dispatched</span>
            </div>
            <div className={styles.row}>
              <span>Order #1041 — Customer B</span>
              <span className={styles.chip}>Packed</span>
            </div>
            <div className={styles.row}>
              <span>Order #1040 — Customer C</span>
              <span className={styles.chip}>Confirmed</span>
            </div>
          </div>
        </div>

        <p className={styles.caption}>Illustrative preview — not an actual screenshot</p>
      </div>
    </div>
  );
}
