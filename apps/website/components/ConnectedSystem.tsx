"use client";

import { useEffect, useRef } from "react";
import Icon, { type IconName } from "./icons";
import styles from "./ConnectedSystem.module.css";

const STAGES: { icon: IconName; name: string }[] = [
  { icon: "sales", name: "Sales & Orders" },
  { icon: "inventory", name: "Inventory & Stock" },
  { icon: "production", name: "Production" },
  { icon: "accounting", name: "Accounting & Reports" },
  { icon: "workforce", name: "Workforce" },
];

export default function ConnectedSystem() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      el.classList.add(styles.trackFillVisible);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add(styles.trackFillVisible);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.trackWrap}>
      <div className={styles.trackLine} />
      <div ref={fillRef} className={styles.trackFill} />
      <div className={styles.trackChevrons} aria-hidden="true">
        <span>›</span>
        <span>›</span>
        <span>›</span>
        <span>›</span>
      </div>
      <div className={styles.nodes}>
        {STAGES.map((stage, i) => (
          <div key={stage.name} className={styles.node}>
            <span className={styles.nodeDotOuter}>
              <span className={styles.nodeDot} />
            </span>
            <span className={styles.nodeTag}>
              <span className={`iconPlate iconPlateSm`}>
                <Icon name={stage.icon} />
              </span>
              <span className={styles.nodeTagText}>
                <span className={styles.num}>Stage 0{i + 1}</span>
                <span className={styles.name}>{stage.name}</span>
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
