import { ConversionSettings } from '../../types';
import { createJsPdfInstance } from './pdfConfig';

/**
 * Converts image formats (JPG, JPEG, PNG, WEBP, BMP, TIFF, GIF, SVG) to PDF
 */
export async function convertImageToPdf(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(20);

  // Load image into an HTMLImageElement
  const { img, width, height } = await loadImageElement(file);

  onProgress?.(50);

  // Determine orientation: if 'auto', match the image aspect ratio
  let orientation: 'portrait' | 'landscape' =
    width > height ? 'landscape' : 'portrait';

  if (settings.orientation !== 'auto') {
    orientation = settings.orientation;
  }

  const { doc, dims } = createJsPdfInstance(settings, orientation);

  // Calculate scaled dimensions to fit within printable bounds
  const maxWidth = dims.printableWidth;
  const maxHeight = dims.printableHeight;

  const imgAspect = width / height;
  const pageAspect = maxWidth / maxHeight;

  let renderWidth = maxWidth;
  let renderHeight = maxHeight;

  if (imgAspect > pageAspect) {
    // Image is wider than page printable area
    renderWidth = maxWidth;
    renderHeight = maxWidth / imgAspect;
  } else {
    // Image is taller than page printable area
    renderHeight = maxHeight;
    renderWidth = maxHeight * imgAspect;
  }

  // Center on page
  const x = dims.marginLeft + (maxWidth - renderWidth) / 2;
  const y = dims.marginTop + (maxHeight - renderHeight) / 2;

  onProgress?.(70);

  // Draw image to a canvas with chosen quality compression
  const qualityMap = {
    standard: 0.82,
    high: 0.92,
    maximum: 1.0,
  };
  const quality = qualityMap[settings.imageQuality] || 0.92;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable.');
  }

  // White background for transparent PNG/WebP/GIF
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const dataUrl = canvas.toDataURL('image/jpeg', quality);

  onProgress?.(85);

  doc.addImage(dataUrl, 'JPEG', x, y, renderWidth, renderHeight, undefined, 'FAST');

  onProgress?.(100);
  return doc.output('blob');
}

/**
 * Loads image into Image element and resolves with natural dimensions
 */
function loadImageElement(file: File): Promise<{ img: HTMLImageElement; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        img,
        width: img.naturalWidth || 800,
        height: img.naturalHeight || 600,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to decode image file "${file.name}". The format or file may be corrupted.`));
    };

    img.src = url;
  });
}
