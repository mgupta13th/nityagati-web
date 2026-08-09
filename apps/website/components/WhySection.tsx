import Icon from "./icons";
import styles from "./WhySection.module.css";

export default function WhySection() {
  return (
    <div className={styles.grid}>
      <div className={styles.feature}>
        <span className="iconPlate">
          <Icon name="grid" />
        </span>
        <h3>Everything in one place</h3>
        <p>
          Accounting, inventory, production, and workforce data live
          together instead of being scattered across spreadsheets,
          notebooks, and messaging apps.
        </p>
      </div>

      <div className={styles.secondary}>
        <div className={styles.item}>
          <span className="iconPlate iconPlateSm">
            <Icon name="mobile" />
          </span>
          <h4>Built for mobile, not adapted to it</h4>
          <p>
            Nityagati ERP is mobile-first for owners and teams on the move,
            with a dedicated web experience for office operations.
          </p>
        </div>
        <div className={styles.item}>
          <span className="iconPlate iconPlateSm">
            <Icon name="lock" />
          </span>
          <h4>Your data stays yours</h4>
          <p>Nityagati does not sell business data and does not claim ownership of it.</p>
        </div>
        <div className={styles.item}>
          <span className="iconPlate iconPlateSm">
            <Icon name="lineNode" />
          </span>
          <h4>Straightforward, not overwhelming</h4>
          <p>
            Designed around how a small manufacturing business actually
            operates, not as a scaled-down enterprise system.
          </p>
        </div>
        <div className={styles.item}>
          <span className="iconPlate iconPlateSm">
            <Icon name="shield" />
          </span>
          <h4>Secure by design</h4>
          <p>
            HTTPS/TLS encryption, password hashing, role-based access, and
            organization-level data isolation.
          </p>
        </div>
      </div>
    </div>
  );
}
