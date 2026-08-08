// Plain-data model for a legal document (Privacy Policy, Terms of Service).
// Mirrors frontend/lib/features/settings/legal/legal_document.dart in the
// FactoryFlow360 repository exactly, so content ported from there keeps the
// same shape and can be kept in sync by inspection.

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDocumentContent {
  title: string;
  effectiveDate: string;
  lastUpdated?: string;
  version?: string;
  introParagraphs: string[];
  sections: LegalSection[];
  footerText?: string;
}
