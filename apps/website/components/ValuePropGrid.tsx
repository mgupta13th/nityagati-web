import styles from "./ValuePropGrid.module.css";

export interface ValueProp {
  title: string;
  detail: string;
}

export default function ValuePropGrid({ items }: { items: ValueProp[] }) {
  return (
    <ul className={styles.grid}>
      {items.map((item) => (
        <li key={item.title} className={`card ${styles.item}`}>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.detail}>{item.detail}</p>
        </li>
      ))}
    </ul>
  );
}
