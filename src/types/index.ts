export type SupportedCategory = 'document' | 'spreadsheet' | 'presentation' | 'image' | 'code_data';

export type FileStatus = 'idle' | 'converting' | 'success' | 'error' | 'cancelled';

export type PageSize = 'a4' | 'letter' | 'legal';
export type PageOrientation = 'portrait' | 'landscape' | 'auto';
export type PageMargin = 'normal' | 'narrow' | 'wide';
export type ImageQuality = 'standard' | 'high' | 'maximum';

export interface ConversionSettings {
  pageSize: PageSize;
  orientation: PageOrientation;
  margins: PageMargin;
  imageQuality: ImageQuality;
}

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  extension: string;
  mimeType: string;
  category: SupportedCategory;
  status: FileStatus;
  progress: number;
  pdfBlob?: Blob;
  pdfUrl?: string;
  errorMessage?: string;
  convertedSize?: number;
  conversionTimeMs?: number;
  pageCount?: number;
}

export interface HistoryRecord {
  id: string;
  originalName: string;
  pdfName: string;
  extension: string;
  category: SupportedCategory;
  originalSize: number;
  pdfSize: number;
  timestamp: number;
  conversionTimeMs: number;
  pageCount: number;
  status: 'success' | 'error';
}

export interface FormatSpec {
  extension: string;
  name: string;
  category: SupportedCategory;
  description: string;
  mimePatterns: string[];
}
