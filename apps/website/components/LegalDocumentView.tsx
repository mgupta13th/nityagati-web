import type { ReactNode } from "react";
import type { LegalDocumentContent, LegalSection } from "../content/legal-types";
import styles from "./LegalDocumentView.module.css";

// Renders a LegalDocumentContent (Privacy Policy / Terms of Service) exactly
// as authored -- no summarizing or rewording happens here. Paragraphs
// beginning with "• " are grouped into a <ul>, preserving the exact
// original sequence of prose and bullet groups (a bullet list can appear
// in the middle of a section, followed by more prose).

function renderParagraphs(paragraphs: string[]) {
  const blocks: ReactNode[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = (key: string) => {
    if (bulletBuffer.length > 0) {
      blocks.push(
        <ul className={styles.bulletList} key={`ul-${key}`}>
          {bulletBuffer.map((b, i) => (
            <li key={i}>{b.replace(/^•\s*/, "")}</li>
          ))}
        </ul>,
      );
      bulletBuffer = [];
    }
  };

  paragraphs.forEach((paragraph, i) => {
    if (paragraph.startsWith("• ")) {
      bulletBuffer.push(paragraph);
    } else {
      flushBullets(`b${i}`);
      blocks.push(<p key={i}>{paragraph}</p>);
    }
  });
  flushBullets("end");

  return blocks;
}

function Section({ section }: { section: LegalSection }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{section.heading}</h2>
      {renderParagraphs(section.paragraphs)}
    </section>
  );
}

export default function LegalDocumentView({
  document,
}: {
  document: LegalDocumentContent;
}) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.meta}>
        Effective date: {document.effectiveDate}
        {document.lastUpdated && <> · Last updated: {document.lastUpdated}</>}
        {document.version && <> · Version {document.version}</>}
      </p>

      {renderParagraphs(document.introParagraphs)}

      {document.sections.map((section) => (
        <Section key={section.heading} section={section} />
      ))}

      {document.footerText && (
        <p className={styles.footerText}>{document.footerText}</p>
      )}
    </div>
  );
}
