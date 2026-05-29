import {IEnvelopeDocument} from '@verdocs/js-sdk';

/**
 * We allow recipients to download 2 types of documents: 'attachment' | 'certificate'.
 *
 * - The 'attachment' documents consist of an envelope's document(s) and any file(s) that a
 *   recipient attaches via the 'attachment' field.
 * - The 'certificate' documents consist of the actual certificate that is generated once a
 *   recipient submits an envelope AND a PDF, which merges all of the previously mentioned
 *   documents into a single .pdf file.
 *
 * This utility allows us to distinguish between the two types of 'certificate' documents.
 * The single "merged" PDF file will always have more pages than the certificate by itself.
 * Remember, the "merged" document consists of 'attachment' documents + the certificate.
 */
export const parseCertificateDocuments = (envelopeDocuments?: IEnvelopeDocument[]) => {
  const sortedDocs = envelopeDocuments.filter(doc => doc.type === 'certificate').sort((a, b) => b.pages - a.pages);

  if (!sortedDocs || sortedDocs.length === 0) {
    return {certificate: undefined, combined: undefined, hasCertificate: false, hasCombined: false};
  }

  const certificate = sortedDocs[sortedDocs.length - 1];
  const combined = sortedDocs[0];
  const hasCertificate = sortedDocs.length > 0;
  const hasCombined = hasCertificate && combined.id !== certificate.id;

  return {
    certificate,
    combined,
    hasCertificate,
    hasCombined,
  };
};
