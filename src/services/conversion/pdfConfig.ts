import { jsPDF } from 'jspdf';
import { ConversionSettings, PageMargin, PageOrientation, PageSize } from '../../types';

export interface PageDimensions {
  width: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  printableWidth: number;
  printableHeight: number;
}

/**
 * Returns dimensions in millimeters for a given page size, orientation, and margin setting
 */
export function getPageDimensions(
  size: PageSize,
  orientation: PageOrientation,
  margin: PageMargin
): PageDimensions {
  // Standard dimensions in mm [width, height] for portrait
  const baseSizes: Record<PageSize, [number, number]> = {
    a4: [210, 297],
    letter: [215.9, 279.4],
    legal: [215.9, 355.6],
  };

  const [baseW, baseH] = baseSizes[size] || baseSizes.a4;
  const isLandscape = orientation === 'landscape';

  const width = isLandscape ? baseH : baseW;
  const height = isLandscape ? baseW : baseH;

  const marginMap: Record<PageMargin, number> = {
    narrow: 10,
    normal: 18,
    wide: 28,
  };

  const m = marginMap[margin] || 18;

  return {
    width,
    height,
    marginTop: m,
    marginBottom: m,
    marginLeft: m,
    marginRight: m,
    printableWidth: width - m * 2,
    printableHeight: height - m * 2,
  };
}

/**
 * Initializes a new jsPDF instance with settings
 */
export function createJsPdfInstance(
  settings: ConversionSettings,
  forcedOrientation?: 'portrait' | 'landscape'
): { doc: jsPDF; dims: PageDimensions } {
  const orient = forcedOrientation || (settings.orientation === 'auto' ? 'portrait' : settings.orientation);
  const dims = getPageDimensions(settings.pageSize, orient, settings.margins);

  const doc = new jsPDF({
    orientation: orient,
    unit: 'mm',
    format: settings.pageSize,
    compress: true,
  });

  return { doc, dims };
}

/**
 * Adds clean, professional footers with document title and page numbers
 */
export function applyDocumentFooters(doc: jsPDF, docTitle: string, dims: PageDimensions): void {
  const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  const truncatedTitle = docTitle.length > 40 ? docTitle.substring(0, 37) + '...' : docTitle;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 145, 155);

    // Subtle hairline divider above footer
    doc.setDrawColor(230, 233, 238);
    doc.setLineWidth(0.2);
    const lineY = dims.height - dims.marginBottom + 5;
    doc.line(dims.marginLeft, lineY, dims.width - dims.marginRight, lineY);

    // Left title
    doc.text(truncatedTitle, dims.marginLeft, lineY + 5);

    // Right page number
    const pageText = `Page ${i} of ${pageCount}`;
    const pageTextWidth = doc.getTextWidth(pageText);
    doc.text(pageText, dims.width - dims.marginRight - pageTextWidth, lineY + 5);
  }
}
