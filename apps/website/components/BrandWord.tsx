/**
 * The single source of truth for how "Nityagati" is set whenever it
 * appears as the brand name inside a larger piece of UI text (hero CTA,
 * the ERP preview panel, the problem-section highlight, the "Why
 * Nityagati" heading). Always renders exactly "Nityagati" in the
 * `brandWord` global style (Aldrich) -- see globals.css. `Logo` (header/
 * footer wordmark) uses the same `brandWord` class directly rather than
 * this component, since it also needs the icon markup around it.
 */
export default function BrandWord() {
  return <span className="brandWord">Nityagati</span>;
}
