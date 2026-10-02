import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import { ConversionSettings } from '../../types';
import { applyDocumentFooters, createJsPdfInstance } from './pdfConfig';

/**
 * Converts XLSX, XLS, CSV, and ODS spreadsheets to PDF reports
 */
export async function convertSpreadsheetToPdf(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(15);
  const arrayBuffer = await file.arrayBuffer();

  onProgress?.(35);
  // Safe sheet reading
  const workbook = XLSX.read(arrayBuffer, {
    type: 'array',
    cellDates: true,
    dense: true,
  });

  const sheetNames = workbook.SheetNames || [];
  if (sheetNames.length === 0) {
    throw new Error('Spreadsheet contains no sheets or readable data.');
  }

  onProgress?.(55);

  // Check if any sheet is wide (has more than 6 columns) to recommend landscape
  let maxCols = 0;
  for (const name of sheetNames) {
    const sheet = workbook.Sheets[name];
    if (sheet && sheet['!ref']) {
      const range = XLSX.utils.decode_range(sheet['!ref']);
      const cols = range.e.c - range.s.c + 1;
      if (cols > maxCols) maxCols = cols;
    }
  }

  // Auto-orientation preference: if wide (>6 columns), use landscape
  const forcedOrientation =
    settings.orientation === 'auto' ? (maxCols > 6 ? 'landscape' : 'portrait') : undefined;

  const { doc, dims } = createJsPdfInstance(settings, forcedOrientation);

  let currentY = dims.marginTop;
  let isFirstSheet = true;

  for (let idx = 0; idx < sheetNames.length; idx++) {
    const sheetName = sheetNames[idx];
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    // Convert sheet to 2D array
    const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      defval: '',
      blankrows: false,
    });

    if (rawRows.length === 0) continue;

    if (!isFirstSheet) {
      doc.addPage();
      currentY = dims.marginTop;
    }
    isFirstSheet = false;

    // Sheet Title Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(`${file.name} - ${sheetName}`, dims.marginLeft, currentY);
    currentY += 6;

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(dims.marginLeft, currentY, dims.width - dims.marginRight, currentY);
    currentY += 6;

    // Prepare table headers and body
    const headers = (rawRows[0] || []).map((h) => String(h ?? '').trim());
    const bodyRows = rawRows.slice(1).map((row) =>
      row.map((cell) => {
        if (cell === null || cell === undefined) return '';
        if (typeof cell === 'number') {
          return cell.toLocaleString();
        }
        return String(cell).trim();
      })
    );

    autoTable(doc, {
      startY: currentY,
      head: [headers],
      body: bodyRows,
      margin: { left: dims.marginLeft, right: dims.marginRight },
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: maxCols > 8 ? 7.5 : 8.5,
        cellPadding: 2.2,
        lineColor: [226, 232, 240],
        lineWidth: 0.2,
        textColor: [30, 41, 59],
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: maxCols > 8 ? 8 : 9,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        // Auto right-align numeric columns
      },
    });

    currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    onProgress?.(55 + Math.floor(((idx + 1) / sheetNames.length) * 35));
  }

  onProgress?.(95);
  applyDocumentFooters(doc, file.name, dims);
  onProgress?.(100);

  return doc.output('blob');
}
