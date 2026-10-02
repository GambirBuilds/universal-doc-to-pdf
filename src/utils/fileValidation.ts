import { FormatSpec, SupportedCategory } from '../types';

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const SUPPORTED_FORMATS: Record<string, FormatSpec> = {
  // Documents
  docx: {
    extension: 'docx',
    name: 'Microsoft Word Document',
    category: 'document',
    description: 'WordprocessingML document with formatted text, tables, and images',
    mimePatterns: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  doc: {
    extension: 'doc',
    name: 'Microsoft Word (97-2004)',
    category: 'document',
    description: 'Legacy Word binary document (text & layout extracted)',
    mimePatterns: ['application/msword'],
  },
  txt: {
    extension: 'txt',
    name: 'Plain Text Document',
    category: 'document',
    description: 'Unformatted UTF-8 text with automatic pagination and margins',
    mimePatterns: ['text/plain'],
  },
  rtf: {
    extension: 'rtf',
    name: 'Rich Text Format',
    category: 'document',
    description: 'Styled document with font sizes, bold, italic, and paragraphs',
    mimePatterns: ['application/rtf', 'text/rtf'],
  },
  odt: {
    extension: 'odt',
    name: 'OpenDocument Text',
    category: 'document',
    description: 'LibreOffice / OpenOffice formatted document',
    mimePatterns: ['application/vnd.oasis.opendocument.text'],
  },

  // Spreadsheets
  xlsx: {
    extension: 'xlsx',
    name: 'Microsoft Excel Spreadsheet',
    category: 'spreadsheet',
    description: 'Multi-sheet workbook formatted into PDF tabular reports',
    mimePatterns: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
  xls: {
    extension: 'xls',
    name: 'Microsoft Excel (97-2004)',
    category: 'spreadsheet',
    description: 'Legacy Excel workbook converted to PDF tables',
    mimePatterns: ['application/vnd.ms-excel'],
  },
  csv: {
    extension: 'csv',
    name: 'Comma-Separated Values',
    category: 'spreadsheet',
    description: 'Tabular data with autospaced columns and zebra striping',
    mimePatterns: ['text/csv', 'application/csv'],
  },
  ods: {
    extension: 'ods',
    name: 'OpenDocument Spreadsheet',
    category: 'spreadsheet',
    description: 'OpenOffice / LibreOffice Calc spreadsheet',
    mimePatterns: ['application/vnd.oasis.opendocument.spreadsheet'],
  },

  // Presentations
  pptx: {
    extension: 'pptx',
    name: 'Microsoft PowerPoint Presentation',
    category: 'presentation',
    description: 'Slide-by-slide presentation formatted into PDF slides',
    mimePatterns: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  },
  ppt: {
    extension: 'ppt',
    name: 'Microsoft PowerPoint (97-2004)',
    category: 'presentation',
    description: 'Legacy PowerPoint presentation converted to slide pages',
    mimePatterns: ['application/vnd.ms-powerpoint'],
  },
  odp: {
    extension: 'odp',
    name: 'OpenDocument Presentation',
    category: 'presentation',
    description: 'LibreOffice / OpenOffice Impress presentation',
    mimePatterns: ['application/vnd.oasis.opendocument.presentation'],
  },

  // Images
  jpg: {
    extension: 'jpg',
    name: 'JPEG Image',
    category: 'image',
    description: 'Lossy compressed photographic image',
    mimePatterns: ['image/jpeg'],
  },
  jpeg: {
    extension: 'jpeg',
    name: 'JPEG Image',
    category: 'image',
    description: 'Lossy compressed photographic image',
    mimePatterns: ['image/jpeg'],
  },
  png: {
    extension: 'png',
    name: 'Portable Network Graphics',
    category: 'image',
    description: 'Lossless raster image with transparency support',
    mimePatterns: ['image/png'],
  },
  webp: {
    extension: 'webp',
    name: 'WebP Image',
    category: 'image',
    description: 'Modern high-compression web image',
    mimePatterns: ['image/webp'],
  },
  bmp: {
    extension: 'bmp',
    name: 'Bitmap Image',
    category: 'image',
    description: 'Uncompressed raster bitmap graphic',
    mimePatterns: ['image/bmp', 'image/x-ms-bmp'],
  },
  tiff: {
    extension: 'tiff',
    name: 'TIFF Image',
    category: 'image',
    description: 'Tagged Image File Format graphic',
    mimePatterns: ['image/tiff'],
  },
  tif: {
    extension: 'tif',
    name: 'TIFF Image',
    category: 'image',
    description: 'Tagged Image File Format graphic',
    mimePatterns: ['image/tiff'],
  },
  gif: {
    extension: 'gif',
    name: 'Graphics Interchange Format',
    category: 'image',
    description: 'Raster image graphic',
    mimePatterns: ['image/gif'],
  },
  svg: {
    extension: 'svg',
    name: 'Scalable Vector Graphics',
    category: 'image',
    description: 'Vector-based XML graphic',
    mimePatterns: ['image/svg+xml'],
  },

  // Web & Data
  html: {
    extension: 'html',
    name: 'HTML Document',
    category: 'code_data',
    description: 'Web page document with headings, paragraphs, and tables',
    mimePatterns: ['text/html'],
  },
  htm: {
    extension: 'htm',
    name: 'HTML Document',
    category: 'code_data',
    description: 'Web page document with headings, paragraphs, and tables',
    mimePatterns: ['text/html'],
  },
  md: {
    extension: 'md',
    name: 'Markdown Document',
    category: 'code_data',
    description: 'Formatted markdown with headings, code blocks, and lists',
    mimePatterns: ['text/markdown', 'text/x-markdown'],
  },
  markdown: {
    extension: 'markdown',
    name: 'Markdown Document',
    category: 'code_data',
    description: 'Formatted markdown with headings, code blocks, and lists',
    mimePatterns: ['text/markdown', 'text/x-markdown'],
  },
  xml: {
    extension: 'xml',
    name: 'XML Document',
    category: 'code_data',
    description: 'Structured XML with syntax tree formatting and line numbers',
    mimePatterns: ['text/xml', 'application/xml'],
  },
  json: {
    extension: 'json',
    name: 'JSON Data',
    category: 'code_data',
    description: 'JavaScript Object Notation formatted code report',
    mimePatterns: ['application/json', 'text/json'],
  },
};

/**
 * Extracts and sanitizes file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length <= 1) return '';
  return parts.pop()?.toLowerCase().trim() || '';
}

/**
 * Sanitizes filename to prevent path traversal or invalid characters
 */
export function sanitizeFilename(filename: string): string {
  // Remove path traversal and dangerous characters
  const clean = filename
    .replace(/[/\\?%*:|"<>]/g, '_')
    .replace(/\.\.+/g, '.')
    .trim();
  return clean || 'document';
}

/**
 * Converts any original filename to its target PDF filename
 * Example: report.2024.docx -> report.2024.pdf
 */
export function getPdfFilename(originalFilename: string): string {
  const sanitized = sanitizeFilename(originalFilename);
  const lastDot = sanitized.lastIndexOf('.');
  if (lastDot === -1) {
    return `${sanitized}.pdf`;
  }
  return `${sanitized.substring(0, lastDot)}.pdf`;
}

/**
 * Format bytes into human readable format (KB, MB, etc)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  spec?: FormatSpec;
  extension?: string;
}

/**
 * Validates a file for conversion suitability
 */
export function validateFile(file: File): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty (0 bytes). Please upload a valid document.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File is too large (${formatBytes(file.size)}). Maximum supported size is ${formatBytes(MAX_FILE_SIZE)}.`,
    };
  }

  const ext = getFileExtension(file.name);
  if (!ext) {
    return {
      valid: false,
      error: 'File has no extension. Please select a file with a supported format extension.',
    };
  }

  const spec = SUPPORTED_FORMATS[ext];
  if (!spec) {
    return {
      valid: false,
      extension: ext,
      error: `The .${ext.toUpperCase()} file format is not currently supported. Supported formats include DOCX, XLSX, PPTX, Images, TXT, Markdown, CSV, and HTML.`,
    };
  }

  return {
    valid: true,
    spec,
    extension: ext,
  };
}
