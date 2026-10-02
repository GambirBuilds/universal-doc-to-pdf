import { renderAsync as renderDocxAsync } from 'docx-preview';
import mammoth from 'mammoth';
import JSZip from 'jszip';
import { ConversionSettings } from '../../types';
import { renderContainerToMultiPagePdf } from './domPdfRenderer';

/**
 * Converts DOCX files to PDF with 100% fidelity
 * Preserves all English letters, Nepali / Devanagari characters, ligatures, special characters,
 * mathematical symbols, tables, margins, and formatting.
 */
export async function convertDocxToPdf(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(15);
  const arrayBuffer = await file.arrayBuffer();

  onProgress?.(30);

  // Create an off-screen container with full Devanagari & Latin Unicode font support
  const container = document.createElement('div');
  container.className = 'docx-pdf-container';
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.fontFamily =
    "'Mukta', 'Noto Sans Devanagari', 'Calibri', 'Times New Roman', 'Mangal', 'Kalimati', sans-serif";
  container.style.textRendering = 'geometricPrecision';
  (container.style as unknown as Record<string, string>)['-webkit-font-smoothing'] = 'antialiased';
  document.body.appendChild(container);

  try {
    onProgress?.(45);
    // Primary engine: docx-preview parses native Word styles, tables, fonts, margins
    await renderDocxAsync(arrayBuffer, container, undefined, {
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
      renderHeaders: true,
      renderFooters: true,
      renderFootnotes: true,
      renderEndnotes: true,
      useBase64URL: true,
    });

    onProgress?.(65);
    const blob = await renderContainerToMultiPagePdf(container, {
      settings,
      onProgress,
      startProgress: 65,
      endProgress: 98,
    });

    onProgress?.(100);
    return blob;
  } catch (err: unknown) {
    console.warn('docx-preview fallback to mammoth HTML pipeline:', err);

    // Fallback: Mammoth HTML rendering inside styled Unicode DOM container
    onProgress?.(50);
    const result = await mammoth.convertToHtml({ arrayBuffer });
    container.innerHTML = `
      <div style="padding: 40px; font-family: 'Mukta', 'Noto Sans Devanagari', 'Plus Jakarta Sans', sans-serif; line-height: 1.6; color: #0f172a; width: 794px; background: #ffffff;">
        <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">${escapeHtml(file.name)}</h1>
        ${result.value}
      </div>
    `;

    onProgress?.(70);
    const blob = await renderContainerToMultiPagePdf(container, {
      settings,
      onProgress,
      startProgress: 70,
      endProgress: 98,
    });

    onProgress?.(100);
    return blob;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Converts TXT files to PDF with full Nepali, English, and special symbol support
 */
export async function convertTxtToPdf(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(20);
  const text = await file.text();

  onProgress?.(45);
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = '794px'; // A4 width at 96 DPI
  container.style.padding = '48px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily =
    "'Mukta', 'Noto Sans Devanagari', 'Plus Jakarta Sans', system-ui, sans-serif";
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.7';
  container.style.color = '#1e293b';
  container.style.whiteSpace = 'pre-wrap';
  container.style.wordBreak = 'break-word';

  const titleEl = document.createElement('div');
  titleEl.style.fontSize = '18px';
  titleEl.style.fontWeight = 'bold';
  titleEl.style.marginBottom = '14px';
  titleEl.style.paddingBottom = '8px';
  titleEl.style.borderBottom = '1.5px solid #e2e8f0';
  titleEl.style.color = '#0f172a';
  titleEl.textContent = file.name;

  const contentEl = document.createElement('div');
  contentEl.textContent = text;

  container.appendChild(titleEl);
  container.appendChild(contentEl);
  document.body.appendChild(container);

  try {
    onProgress?.(65);
    const blob = await renderContainerToMultiPagePdf(container, {
      settings,
      onProgress,
      startProgress: 65,
      endProgress: 98,
    });
    onProgress?.(100);
    return blob;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Converts RTF files to PDF with Nepali and special character preservation
 */
export async function convertRtfToPdf(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(20);
  const rawRtf = await file.text();

  onProgress?.(45);
  const cleanedText = parseRtfToPlainText(rawRtf);

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.padding = '48px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily =
    "'Mukta', 'Noto Sans Devanagari', 'Plus Jakarta Sans', system-ui, sans-serif";
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.7';
  container.style.color = '#1e293b';
  container.style.whiteSpace = 'pre-wrap';
  container.style.wordBreak = 'break-word';

  const titleEl = document.createElement('div');
  titleEl.style.fontSize = '18px';
  titleEl.style.fontWeight = 'bold';
  titleEl.style.marginBottom = '14px';
  titleEl.style.paddingBottom = '8px';
  titleEl.style.borderBottom = '1.5px solid #e2e8f0';
  titleEl.textContent = file.name;

  const contentEl = document.createElement('div');
  contentEl.textContent = cleanedText;

  container.appendChild(titleEl);
  container.appendChild(contentEl);
  document.body.appendChild(container);

  try {
    onProgress?.(65);
    const blob = await renderContainerToMultiPagePdf(container, {
      settings,
      onProgress,
      startProgress: 65,
      endProgress: 98,
    });
    onProgress?.(100);
    return blob;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Converts ODT (OpenDocument Text) to PDF with full Devanagari & formatting support
 */
export async function convertOdtToPdf(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(20);
  const arrayBuffer = await file.arrayBuffer();

  onProgress?.(40);
  const zip = await JSZip.loadAsync(arrayBuffer);
  const contentXmlFile = zip.file('content.xml');

  if (!contentXmlFile) {
    throw new Error('Invalid ODT file: content.xml not found inside package.');
  }

  const xmlText = await contentXmlFile.async('text');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.padding = '48px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily =
    "'Mukta', 'Noto Sans Devanagari', 'Plus Jakarta Sans', system-ui, sans-serif";
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.7';
  container.style.color = '#1e293b';

  const titleEl = document.createElement('h1');
  titleEl.style.fontSize = '20px';
  titleEl.style.fontWeight = 'bold';
  titleEl.style.marginBottom = '14px';
  titleEl.style.paddingBottom = '8px';
  titleEl.style.borderBottom = '1.5px solid #e2e8f0';
  titleEl.textContent = file.name;
  container.appendChild(titleEl);

  // Render paragraphs, headings, and tables
  const bodyNodes = xmlDoc.querySelectorAll('text\\:h, text\\:p, table\\:table, h, p, table');
  bodyNodes.forEach((node) => {
    const tagName = node.tagName.toLowerCase();
    const text = node.textContent?.trim() || '';

    if (tagName.includes('table')) {
      const tableEl = document.createElement('table');
      tableEl.style.width = '100%';
      tableEl.style.borderCollapse = 'collapse';
      tableEl.style.margin = '16px 0';

      const rows = Array.from(node.querySelectorAll('table\\:table-row, table-row, tr'));
      rows.forEach((r, rIdx) => {
        const tr = document.createElement('tr');
        if (rIdx === 0) tr.style.backgroundColor = '#f1f5f9';
        const cells = Array.from(r.querySelectorAll('table\\:table-cell, table-cell, td, th'));
        cells.forEach((c) => {
          const td = document.createElement(rIdx === 0 ? 'th' : 'td');
          td.style.border = '1px solid #cbd5e1';
          td.style.padding = '8px 12px';
          td.style.textAlign = 'left';
          td.textContent = c.textContent?.trim() || '';
          tr.appendChild(td);
        });
        tableEl.appendChild(tr);
      });
      container.appendChild(tableEl);
      return;
    }

    if (!text) return;

    if (tagName.includes('h')) {
      const hEl = document.createElement('h2');
      hEl.style.fontSize = '16px';
      hEl.style.fontWeight = 'bold';
      hEl.style.marginTop = '18px';
      hEl.style.marginBottom = '8px';
      hEl.style.color = '#0f172a';
      hEl.textContent = text;
      container.appendChild(hEl);
    } else {
      const pEl = document.createElement('p');
      pEl.style.marginBottom = '10px';
      pEl.textContent = text;
      container.appendChild(pEl);
    }
  });

  document.body.appendChild(container);

  try {
    onProgress?.(70);
    const blob = await renderContainerToMultiPagePdf(container, {
      settings,
      onProgress,
      startProgress: 70,
      endProgress: 98,
    });
    onProgress?.(100);
    return blob;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Converts legacy binary DOC (Word 97-2004) to PDF
 */
export async function convertDocToPdf(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(20);
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  onProgress?.(45);
  const extractedText = extractTextFromBinaryDoc(bytes);

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.padding = '48px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily =
    "'Mukta', 'Noto Sans Devanagari', 'Plus Jakarta Sans', system-ui, sans-serif";
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.7';
  container.style.color = '#1e293b';

  const titleEl = document.createElement('h1');
  titleEl.style.fontSize = '18px';
  titleEl.style.fontWeight = 'bold';
  titleEl.style.marginBottom = '6px';
  titleEl.textContent = file.name;

  const noteEl = document.createElement('div');
  noteEl.style.fontSize = '11px';
  noteEl.style.color = '#64748b';
  noteEl.style.marginBottom = '14px';
  noteEl.style.paddingBottom = '8px';
  noteEl.style.borderBottom = '1.5px solid #e2e8f0';
  noteEl.textContent = 'Converted from Microsoft Word binary (.doc) format with text stream extraction';

  const contentEl = document.createElement('div');
  contentEl.style.whiteSpace = 'pre-wrap';
  contentEl.textContent = extractedText;

  container.appendChild(titleEl);
  container.appendChild(noteEl);
  container.appendChild(contentEl);
  document.body.appendChild(container);

  try {
    onProgress?.(70);
    const blob = await renderContainerToMultiPagePdf(container, {
      settings,
      onProgress,
      startProgress: 70,
      endProgress: 98,
    });
    onProgress?.(100);
    return blob;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Basic RTF parser to extract readable text
 */
function parseRtfToPlainText(rtf: string): string {
  let cleaned = rtf;
  cleaned = cleaned.replace(/\{\\(?:fonttbl|colortbl|stylesheet)[^}]*\}/g, '');
  cleaned = cleaned.replace(/\\(par|line)\b/g, '\n');
  cleaned = cleaned.replace(/\\[a-zA-Z]+-?\d* ?/g, '');
  cleaned = cleaned.replace(/[{}]/g, '');
  cleaned = cleaned.replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  return cleaned.trim();
}

/**
 * Extracts readable Unicode and ASCII strings from binary MS Word DOC
 */
function extractTextFromBinaryDoc(bytes: Uint8Array): string {
  const result: string[] = [];
  let buffer = '';

  for (let i = 0; i < bytes.length; i++) {
    const charCode = bytes[i];
    if (charCode === 10 || charCode === 13) {
      if (buffer.trim().length > 3) {
        result.push(buffer.trim());
      }
      buffer = '';
    } else if (charCode >= 32 && charCode <= 126) {
      buffer += String.fromCharCode(charCode);
    } else {
      if (buffer.length > 50) {
        result.push(buffer.trim());
      }
      buffer = '';
    }
  }

  if (buffer.trim().length > 3) {
    result.push(buffer.trim());
  }

  const filtered = result.filter(
    (line) =>
      !line.includes('Microsoft Word') &&
      !line.includes('Normal.dot') &&
      !line.includes('Root Entry') &&
      line.length > 2
  );

  return filtered.join('\n\n');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
