import JSZip from 'jszip';
import { ConversionSettings } from '../../types';
import { createJsPdfInstance } from './pdfConfig';

interface ParsedSlide {
  slideNumber: number;
  title: string;
  items: string[];
}

/**
 * Converts PPTX, PPT, and ODP presentation files into high quality PDF slide decks
 */
export async function convertPresentationToPdf(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(15);
  const ext = file.name.split('.').pop()?.toLowerCase();

  // Presentations default to landscape unless overridden
  const forcedOrientation = settings.orientation === 'portrait' ? 'portrait' : 'landscape';
  const { doc, dims } = createJsPdfInstance(settings, forcedOrientation);

  let slides: ParsedSlide[] = [];

  if (ext === 'pptx') {
    slides = await parsePptxSlides(file, (p) => onProgress?.(15 + p * 0.5));
  } else if (ext === 'odp') {
    slides = await parseOdpSlides(file, (p) => onProgress?.(15 + p * 0.5));
  } else {
    // Legacy PPT
    slides = await parseLegacyPpt(file);
  }

  if (slides.length === 0) {
    slides = [
      {
        slideNumber: 1,
        title: file.name.replace(/\.[^/.]+$/, ''),
        items: ['Presentation document loaded.', 'No graphical slides could be extracted.'],
      },
    ];
  }

  onProgress?.(70);

  const totalSlides = slides.length;
  for (let i = 0; i < totalSlides; i++) {
    const slide = slides[i];
    if (i > 0) {
      doc.addPage();
    }

    renderSlidePage(doc, slide, totalSlides, dims, file.name);

    if (onProgress) {
      onProgress(70 + Math.floor(((i + 1) / totalSlides) * 25));
    }
  }

  onProgress?.(100);
  return doc.output('blob');
}

/**
 * Renders a single slide page in PDF with executive presentation styling
 */
function renderSlidePage(
  doc: InstanceType<typeof import('jspdf').jsPDF>,
  slide: ParsedSlide,
  totalSlides: number,
  dims: { width: number; height: number; marginLeft: number; marginRight: number; marginTop: number; marginBottom: number },
  filename: string
): void {
  // Slide outer card background
  const cardX = dims.marginLeft - 4;
  const cardY = dims.marginTop - 4;
  const cardW = dims.width - dims.marginLeft - dims.marginRight + 8;
  const cardH = dims.height - dims.marginTop - dims.marginBottom + 8;

  // Background box with soft border
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(cardX, cardY, cardW, cardH, 3, 3, 'FD');

  // Top accent bar
  doc.setFillColor(79, 70, 229); // Indigo accent
  doc.rect(cardX, cardY, cardW, 2.5, 'F');

  // Slide Number Header / Meta
  let contentY = dims.marginTop + 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`SLIDE ${slide.slideNumber} OF ${totalSlides}`, dims.marginLeft + 2, contentY);

  const truncatedFile = filename.length > 35 ? filename.substring(0, 32) + '...' : filename;
  const fileTextWidth = doc.getTextWidth(truncatedFile);
  doc.text(truncatedFile, dims.width - dims.marginRight - fileTextWidth - 2, contentY);
  contentY += 6;

  // Hairline separator
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(0.3);
  doc.line(dims.marginLeft + 2, contentY, dims.width - dims.marginRight - 2, contentY);
  contentY += 10;

  // Slide Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  const slideTitle = slide.title || `Slide ${slide.slideNumber}`;
  const titleLines = doc.splitTextToSize(slideTitle, dims.width - dims.marginLeft - dims.marginRight - 10);
  for (const tLine of titleLines) {
    doc.text(tLine, dims.marginLeft + 4, contentY);
    contentY += 8;
  }
  contentY += 5;

  // Slide Body Items / Bullet points
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);

  const printableW = dims.width - dims.marginLeft - dims.marginRight - 14;
  const lineHeight = 6.2;

  for (const item of slide.items) {
    if (!item.trim()) continue;

    // Bullet icon / indicator
    doc.setFillColor(79, 70, 229);
    doc.circle(dims.marginLeft + 6, contentY - 1.5, 1, 'F');

    const wrapped = doc.splitTextToSize(item.trim(), printableW);
    let isFirstLine = true;
    for (const line of wrapped) {
      if (contentY > dims.height - dims.marginBottom - 6) break;
      doc.text(line, dims.marginLeft + (isFirstLine ? 10 : 10), contentY);
      contentY += lineHeight;
      isFirstLine = false;
    }
    contentY += 3.5;
  }
}

/**
 * Extracts slides and text contents from a PPTX file using JSZip + DOMParser
 */
async function parsePptxSlides(
  file: File,
  onProgress: (ratio: number) => void
): Promise<ParsedSlide[]> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  // Find all slide XML files
  const slidePaths = Object.keys(zip.files).filter((path) =>
    /^ppt\/slides\/slide\d+\.xml$/i.test(path)
  );

  // Sort slides numerically: slide1.xml, slide2.xml...
  slidePaths.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
  });

  const parsedSlides: ParsedSlide[] = [];
  const parser = new DOMParser();

  for (let i = 0; i < slidePaths.length; i++) {
    const path = slidePaths[i];
    const xmlContent = await zip.files[path].async('text');
    const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

    // Extract text paragraphs
    const paragraphs = Array.from(xmlDoc.querySelectorAll('a\\:p, p'));
    const textLines: string[] = [];

    paragraphs.forEach((p) => {
      const texts = Array.from(p.querySelectorAll('a\\:t, t'))
        .map((t) => t.textContent?.trim() || '')
        .filter(Boolean);
      if (texts.length > 0) {
        textLines.push(texts.join(' '));
      }
    });

    let title = '';
    const items: string[] = [];

    if (textLines.length > 0) {
      title = textLines[0];
      items.push(...textLines.slice(1));
    }

    parsedSlides.push({
      slideNumber: i + 1,
      title: title || `Slide ${i + 1}`,
      items: items.length > 0 ? items : ['[Slide content]'],
    });

    onProgress((i + 1) / slidePaths.length);
  }

  return parsedSlides;
}

/**
 * Extracts slides from ODP (OpenDocument Presentation)
 */
async function parseOdpSlides(
  file: File,
  onProgress: (ratio: number) => void
): Promise<ParsedSlide[]> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const contentXml = zip.file('content.xml');
  if (!contentXml) return [];

  const text = await contentXml.async('text');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, 'application/xml');

  const pageElements = Array.from(xmlDoc.querySelectorAll('draw\\:page, page'));
  const slides: ParsedSlide[] = [];

  pageElements.forEach((page, idx) => {
    const textNodes = Array.from(page.querySelectorAll('text\\:p, p, text\\:h, h'))
      .map((n) => n.textContent?.trim() || '')
      .filter(Boolean);

    const title = textNodes[0] || `Slide ${idx + 1}`;
    const items = textNodes.slice(1);

    slides.push({
      slideNumber: idx + 1,
      title,
      items: items.length > 0 ? items : ['[Slide content]'],
    });

    onProgress((idx + 1) / pageElements.length);
  });

  return slides;
}

/**
 * Extracts readable presentation text from legacy PPT binary
 */
async function parseLegacyPpt(file: File): Promise<ParsedSlide[]> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const textChunks: string[] = [];
  let bufferStr = '';

  for (let i = 0; i < bytes.length; i++) {
    const code = bytes[i];
    if (code >= 32 && code <= 126) {
      bufferStr += String.fromCharCode(code);
    } else {
      if (bufferStr.length > 20) {
        textChunks.push(bufferStr.trim());
      }
      bufferStr = '';
    }
  }

  const slides: ParsedSlide[] = [];
  const chunkSize = 4;
  for (let i = 0; i < textChunks.length; i += chunkSize) {
    const chunk = textChunks.slice(i, i + chunkSize);
    slides.push({
      slideNumber: Math.floor(i / chunkSize) + 1,
      title: chunk[0] || `Slide ${Math.floor(i / chunkSize) + 1}`,
      items: chunk.slice(1),
    });
  }

  return slides;
}
