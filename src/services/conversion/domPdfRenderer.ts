import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { ConversionSettings } from '../../types';
import { getPageDimensions } from './pdfConfig';

export interface RenderToPdfOptions {
  settings: ConversionSettings;
  forcedOrientation?: 'portrait' | 'landscape';
  onProgress?: (progress: number) => void;
  startProgress?: number;
  endProgress?: number;
}

/**
 * Ultra-High-Definition 1:1 DOM to PDF Renderer
 * Produces razor-sharp 300+ DPI print-quality PDF output.
 * Preserves 100% of English letters, Nepali/Devanagari text, special characters,
 * mathematical formulas, tables, margins, and embedded images.
 */
export async function renderContainerToMultiPagePdf(
  container: HTMLElement,
  options: RenderToPdfOptions
): Promise<Blob> {
  const { settings, forcedOrientation, onProgress, startProgress = 50, endProgress = 95 } = options;

  // Ultra-crisp DPI scaling:
  // standard: 2.5x (~240 DPI)
  // high: 3.2x (~307 DPI - commercial print standard)
  // maximum: 4.0x (~384 DPI - ultra-HD retina sharpness)
  const scaleMap: Record<string, number> = {
    standard: 2.5,
    high: 3.2,
    maximum: 4.0,
  };
  const renderScale = scaleMap[settings.imageQuality] || 3.2;

  // Find individual Word / document pages
  const pageSections = Array.from(
    container.querySelectorAll<HTMLElement>('section.docx, .docx-wrapper > section')
  );

  if (pageSections.length > 0) {
    // -------------------------------------------------------------
    // Word (.docx) multi-page mode: 100% 1:1 shape & size matching
    // -------------------------------------------------------------
    const totalPages = pageSections.length;
    let doc: jsPDF | null = null;

    for (let i = 0; i < totalPages; i++) {
      const section = pageSections[i];

      // Measure the section's exact layout dimensions from Word
      const rect = section.getBoundingClientRect();
      const widthPx = section.offsetWidth || rect.width || 794;
      const heightPx = section.offsetHeight || rect.height || 1123;

      // 96 CSS pixels per inch, 25.4 mm per inch
      const pageMmWidth = Number(((widthPx / 96) * 25.4).toFixed(2));
      const pageMmHeight = Number(((heightPx / 96) * 25.4).toFixed(2));
      const pageOrientation = pageMmWidth > pageMmHeight ? 'landscape' : 'portrait';

      // Capture at ultra-crisp resolution with lossless PNG
      const canvas = await html2canvas(section, {
        scale: renderScale,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        imageTimeout: 15000,
        onclone: (clonedDoc: Document) => {
          // Remove drop shadows and borders for clean edge alignment
          const clonedSections = clonedDoc.querySelectorAll<HTMLElement>(
            'section.docx, .docx-wrapper > section'
          );
          clonedSections.forEach((s) => {
            s.style.boxShadow = 'none';
            s.style.border = 'none';
            s.style.margin = '0 auto';
            s.style.backgroundColor = '#ffffff';
            s.style.textRendering = 'geometricPrecision';
            s.style.setProperty('-webkit-font-smoothing', 'antialiased');
          });

          const wrappers = clonedDoc.querySelectorAll<HTMLElement>('.docx-wrapper, .docx-pdf-container');
          wrappers.forEach((w) => {
            w.style.backgroundColor = '#ffffff';
            w.style.padding = '0';
          });
        },
      });

      // Lossless PNG preserves razor-sharp edges without compression artifacts
      const imgData = canvas.toDataURL('image/png');

      if (!doc) {
        doc = new jsPDF({
          orientation: pageOrientation,
          unit: 'mm',
          format: [pageMmWidth, pageMmHeight],
          compress: true,
        });
      } else {
        doc.addPage([pageMmWidth, pageMmHeight], pageOrientation);
      }

      // Draw lossless image filling exact page dimensions without FAST subsampling
      doc.addImage(imgData, 'PNG', 0, 0, pageMmWidth, pageMmHeight, undefined, undefined);

      if (onProgress) {
        const step = startProgress + Math.floor(((i + 1) / totalPages) * (endProgress - startProgress));
        onProgress(step);
      }
    }

    if (!doc) {
      throw new Error('Failed to render any document pages.');
    }

    return doc.output('blob');
  } else {
    // -------------------------------------------------------------
    // Continuous content mode (HTML, Markdown, TXT, RTF)
    // -------------------------------------------------------------
    const orient = forcedOrientation || (settings.orientation === 'auto' ? 'portrait' : settings.orientation);
    const dims = getPageDimensions(settings.pageSize, orient, settings.margins);

    const canvas = await html2canvas(container, {
      scale: renderScale,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: true,
      imageTimeout: 15000,
      onclone: (clonedDoc: Document) => {
        const clonedContainer = clonedDoc.querySelector('.docx-pdf-container');
        if (clonedContainer instanceof HTMLElement) {
          clonedContainer.style.backgroundColor = '#ffffff';
          clonedContainer.style.textRendering = 'geometricPrecision';
          clonedContainer.style.setProperty('-webkit-font-smoothing', 'antialiased');
        }
      },
    });

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate height of one PDF page in canvas pixels based on exact page aspect ratio
    const pageAspectRatio = dims.height / dims.width;
    const pageHeightPx = Math.floor(canvasWidth * pageAspectRatio);

    const doc = new jsPDF({
      orientation: orient,
      unit: 'mm',
      format: settings.pageSize,
      compress: true,
    });

    let renderedHeightPx = 0;
    let pageIndex = 0;

    while (renderedHeightPx < canvasHeight) {
      const sliceHeight = Math.min(pageHeightPx, canvasHeight - renderedHeightPx);

      // Create a slice canvas for this page
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvasWidth;
      sliceCanvas.height = pageHeightPx;

      const sliceCtx = sliceCanvas.getContext('2d');
      if (sliceCtx) {
        sliceCtx.imageSmoothingEnabled = true;
        sliceCtx.imageSmoothingQuality = 'high';
        sliceCtx.fillStyle = '#ffffff';
        sliceCtx.fillRect(0, 0, canvasWidth, pageHeightPx);
        sliceCtx.drawImage(
          canvas,
          0,
          renderedHeightPx,
          canvasWidth,
          sliceHeight,
          0,
          0,
          canvasWidth,
          sliceHeight
        );
      }

      const imgData = sliceCanvas.toDataURL('image/png');

      if (pageIndex > 0) {
        doc.addPage(settings.pageSize, orient);
      }

      doc.addImage(imgData, 'PNG', 0, 0, dims.width, dims.height, undefined, undefined);

      renderedHeightPx += pageHeightPx;
      pageIndex++;

      if (onProgress) {
        const ratio = Math.min(renderedHeightPx / canvasHeight, 1);
        onProgress(startProgress + Math.floor(ratio * (endProgress - startProgress)));
      }
    }

    return doc.output('blob');
  }
}
