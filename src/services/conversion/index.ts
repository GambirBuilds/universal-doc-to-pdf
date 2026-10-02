import JSZip from 'jszip';
import { ConversionSettings, FileItem } from '../../types';
import { getFileExtension, getPdfFilename } from '../../utils/fileValidation';
import { convertDocToPdf, convertDocxToPdf, convertOdtToPdf, convertRtfToPdf, convertTxtToPdf } from './documentConverter';
import { convertSpreadsheetToPdf } from './spreadsheetConverter';
import { convertPresentationToPdf } from './presentationConverter';
import { convertImageToPdf } from './imageConverter';
import { convertHtmlToPdf, convertJsonToPdf, convertMarkdownToPdf, convertXmlToPdf } from './codeAndDataConverter';

export interface ConversionSuccessResult {
  pdfBlob: Blob;
  pdfUrl: string;
  convertedSize: number;
  conversionTimeMs: number;
  pageCount: number;
}

/**
 * Universal document to PDF converter engine
 * Routes each format to its optimized conversion implementation
 */
export async function convertDocumentToPdf(
  fileItem: FileItem,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<ConversionSuccessResult> {
  const startTime = performance.now();
  const ext = getFileExtension(fileItem.name);
  const file = fileItem.file;

  let pdfBlob: Blob;

  switch (ext) {
    // Documents
    case 'docx':
      pdfBlob = await convertDocxToPdf(file, settings, onProgress);
      break;
    case 'doc':
      pdfBlob = await convertDocToPdf(file, settings, onProgress);
      break;
    case 'txt':
      pdfBlob = await convertTxtToPdf(file, settings, onProgress);
      break;
    case 'rtf':
      pdfBlob = await convertRtfToPdf(file, settings, onProgress);
      break;
    case 'odt':
      pdfBlob = await convertOdtToPdf(file, settings, onProgress);
      break;

    // Spreadsheets
    case 'xlsx':
    case 'xls':
    case 'csv':
    case 'ods':
      pdfBlob = await convertSpreadsheetToPdf(file, settings, onProgress);
      break;

    // Presentations
    case 'pptx':
    case 'ppt':
    case 'odp':
      pdfBlob = await convertPresentationToPdf(file, settings, onProgress);
      break;

    // Images
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
    case 'bmp':
    case 'tiff':
    case 'tif':
    case 'gif':
    case 'svg':
      pdfBlob = await convertImageToPdf(file, settings, onProgress);
      break;

    // Web & Code
    case 'md':
    case 'markdown':
      pdfBlob = await convertMarkdownToPdf(file, settings, onProgress);
      break;
    case 'html':
    case 'htm':
      pdfBlob = await convertHtmlToPdf(file, settings, onProgress);
      break;
    case 'json':
      pdfBlob = await convertJsonToPdf(file, settings, onProgress);
      break;
    case 'xml':
      pdfBlob = await convertXmlToPdf(file, settings, onProgress);
      break;

    default:
      throw new Error(`Unsupported file extension: .${ext}. Please select a supported document.`);
  }

  const endTime = performance.now();
  const conversionTimeMs = Math.round(endTime - startTime);
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const pageCount = await estimatePdfPageCount(pdfBlob);

  return {
    pdfBlob,
    pdfUrl,
    convertedSize: pdfBlob.size,
    conversionTimeMs,
    pageCount,
  };
}

/**
 * Triggers safe browser download of a single PDF Blob
 */
export function downloadPdf(blob: Blob, targetFilename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = targetFilename.endsWith('.pdf') ? targetFilename : `${targetFilename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}

/**
 * Bundles multiple converted PDF files into a single ZIP archive and triggers download
 */
export async function downloadAllAsZip(
  files: FileItem[],
  onProgress?: (progress: number) => void
): Promise<void> {
  const converted = files.filter((f) => f.status === 'success' && f.pdfBlob);
  if (converted.length === 0) {
    throw new Error('No converted PDF files available for download.');
  }

  const zip = new JSZip();
  const usedNames = new Set<string>();

  for (let i = 0; i < converted.length; i++) {
    const item = converted[i];
    let pdfName = getPdfFilename(item.name);

    // Prevent duplicate filenames in zip
    let counter = 1;
    while (usedNames.has(pdfName)) {
      const base = pdfName.replace(/\.pdf$/i, '');
      pdfName = `${base}_${counter}.pdf`;
      counter++;
    }
    usedNames.add(pdfName);

    if (item.pdfBlob) {
      zip.file(pdfName, item.pdfBlob);
    }
    onProgress?.(Math.round(((i + 1) / converted.length) * 50));
  }

  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      onProgress?.(50 + Math.round(metadata.percent / 2));
    }
  );

  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `converted_documents_${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}

/**
 * Estimates number of pages in the generated PDF blob
 */
async function estimatePdfPageCount(blob: Blob): Promise<number> {
  try {
    const buffer = await blob.slice(0, Math.min(blob.size, 1024 * 1024)).arrayBuffer();
    const text = new TextDecoder('latin1').decode(buffer);
    // Search for /Type /Page (excluding /Pages)
    const matches = text.match(/\/Type\s*\/Page\b/g);
    if (matches && matches.length > 0) {
      return matches.length;
    }
    // Alternatively search for /Count
    const countMatch = text.match(/\/Count\s+(\d+)/);
    if (countMatch && countMatch[1]) {
      return parseInt(countMatch[1], 10);
    }
  } catch {
    // Non-critical fallback
  }
  return 1;
}
