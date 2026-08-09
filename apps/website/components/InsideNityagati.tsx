import Icon, { type IconName } from "./icons";
import styles from "./InsideNityagati.module.css";

function Connector({ down }: { down?: boolean }) {
  return (
    <div className={`${styles.connector} ${down ? styles.connectorDown : ""}`} aria-hidden="true">
      <svg width="30" height="60" viewBox="0 0 30 60">
        <line x1="2" y1="4" x2="28" y2="56" />
        <circle cx="28" cy="56" r="3" />
      </svg>
    </div>
  );
}

function FragHead({ icon, name, tag }: { icon: IconName; name: string; tag: string }) {
  return (
    <div className={styles.fragHead}>
      <span className="iconPlate iconPlateSm">
        <Icon name={icon} />
      </span>
      <span className={styles.fragName}>{name}</span>
      <span className={styles.fragTag}>{tag}</span>
    </div>
  );
}

export default function InsideNityagati() {
  return (
    <div className={styles.board}>
      <div className={styles.frag}>
        <FragHead icon="sales" name="Sales & Orders" tag="01" />
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
        <p className={styles.caption}>Illustrative — sample data</p>
      </div>

      <Connector down />

      <div className={styles.frag}>
        <FragHead icon="inventory" name="Inventory & Stock" tag="02" />
        <div className={styles.row}>
          <span>Raw Material A</span>
          <span className={styles.val}>240 kg</span>
        </div>
        <div className={styles.row}>
          <span>Raw Material B</span>
          <span className={styles.val}>18 kg</span>
        </div>
        <div className={styles.row}>
          <span>Finished Good A</span>
          <span className={styles.val}>560 pcs</span>
        </div>
        <p className={styles.caption}>Illustrative — sample data</p>
      </div>

      <Connector />

      <div className={styles.frag}>
        <FragHead icon="production" name="Production" tag="03" />
        <p className={styles.row} style={{ paddingBottom: 0 }}>
          Batch #212
        </p>
        <div className={styles.prodTrack}>
          <div className={`${styles.prodStep} ${styles.prodStepDone}`} />
          <div className={`${styles.prodStep} ${styles.prodStepDone}`} />
          <div className={styles.prodStep} />
        </div>
        <p className={styles.caption}>Illustrative — sample data</p>
      </div>

      <Connector down />

      <div className={styles.frag}>
        <FragHead icon="accounting" name="Accounting & Reports" tag="04" />
        <div className={styles.row}>
          <span>Receivables</span>
          <span className={styles.val}>₹2.1L</span>
        </div>
        <div className={styles.row}>
          <span>Payables</span>
          <span className={styles.val}>₹94,200</span>
        </div>
        <p className={styles.caption}>Illustrative — sample data</p>
      </div>

      <Connector />

      <div className={styles.frag}>
        <FragHead icon="workforce" name="Workforce" tag="05" />
        <div className={styles.row}>
          <span>Present today</span>
          <span className={styles.val}>12</span>
        </div>
        <div className={styles.row}>
          <span>On leave</span>
          <span className={styles.val}>2</span>
        </div>
        <p className={styles.caption}>Illustrative — sample data</p>
      </div>
    </div>
  );
}
