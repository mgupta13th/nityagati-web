import styles from "./CapabilityList.module.css";

export interface Capability {
  title: string;
  detail?: string;
}

export default function CapabilityList({
  capabilities,
}: {
  capabilities: Capability[];
}) {
  return (
    <ul className={styles.grid}>
      {capabilities.map((item) => (
        <li key={item.title} className={`card ${styles.item}`}>
          <h3 className={styles.title}>{item.title}</h3>
          {item.detail && <p className={styles.detail}>{item.detail}</p>}
        </li>
      ))}
    </ul>
  );
}
