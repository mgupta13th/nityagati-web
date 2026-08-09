import Icon, { type IconName } from "./icons";
import styles from "./Capabilities.module.css";

interface CapabilityRow {
  icon: IconName;
  name: string;
  detail: string;
}

const ROWS: CapabilityRow[] = [
  { icon: "sales", name: "Sales & Orders", detail: "Record orders and track them through to dispatch." },
  { icon: "purchases", name: "Purchases", detail: "Raise and track purchases from suppliers." },
  { icon: "inventory", name: "Inventory & Stock", detail: "Know what's in stock, without a manual count." },
  { icon: "production", name: "Production", detail: "Track what's being made and where it stands." },
  {
    icon: "accounting",
    name: "Accounting & Reports",
    detail: "Ledger, Trial Balance, Profit & Loss, and Balance Sheet.",
  },
  { icon: "workforce", name: "Attendance & Payroll", detail: "Track attendance and run payroll from the same app." },
];

export default function Capabilities() {
  return (
    <div className={styles.list}>
      {ROWS.map((row, i) => (
        <div key={row.name} className={styles.row}>
          <span className="iconPlate">
            <Icon name={row.icon} />
          </span>
          <div>
            <span className={styles.index}>0{i + 1}</span>
            <span className={styles.name}>{row.name}</span>
            <span className={styles.detail}>{row.detail}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
