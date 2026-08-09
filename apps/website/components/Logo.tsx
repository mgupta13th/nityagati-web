import styles from "./Logo.module.css";

const SRC = {
  default: "/nityagati_logo.svg",
  inverted: "/nityagati_logo_inverted.svg",
} as const;

/**
 * Finalized Nityagati logo, paired with the "Nityagati" wordmark (set in
 * Aldrich via the shared `brandWord` global style -- see globals.css).
 * The SVG files are used as-supplied and are never modified, cropped, or
 * regenerated.
 *
 * `variant="inverted"` swaps in the supplied white-badge/navy-N asset
 * (apps/website/public/nityagati_logo_inverted.svg) for dark/navy
 * backgrounds (currently: the footer). The default variant
 * (apps/website/public/nityagati_logo.svg, navy badge/white N) is used
 * everywhere else, including light-background contexts like the header
 * and the hero product panel.
 *
 * The previous PNG logo assets (nityagati_logo_horizontal.png,
 * nityagati_logo_primary_navyblue.png, nityagati_logo_primary_white.png,
 * nityagati_symbol_navy.png, nityagati_symbol_white.png) remain in
 * public/ untouched but deprecated -- no longer referenced here.
 *
 * `suffix` (e.g. "ERP") is rendered inside the *same* text span as
 * "Nityagati", not as a separate flex sibling -- two flex items (an
 * icon+text lockup and a plain text item) never reliably share a
 * baseline across browsers. Keeping both words in one inline run lets
 * ordinary text-baseline rules align them correctly every time.
 */
export default function Logo({
  className = "",
  variant = "default",
  suffix,
}: {
  className?: string;
  variant?: keyof typeof SRC;
  suffix?: string;
}) {
  return (
    <span className={`${styles.logo} ${className}`}>
      <img src={SRC[variant]} alt="" width={32} height={32} className={styles.mark} />
      <span className={styles.text}>
        <span className="brandWord">Nityagati</span>
        {suffix && <span className={styles.suffix}> {suffix}</span>}
      </span>
    </span>
  );
}
