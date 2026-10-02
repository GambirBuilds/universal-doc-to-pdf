import React, { useEffect, useState } from 'react';
import {
  X,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { FileItem } from '../types';
import { formatBytes, getPdfFilename } from '../utils/fileValidation';

interface PDFPreviewModalProps {
  item: FileItem | null;
  onClose: () => void;
  onDownload: (item: FileItem) => void;
  onConvertAnother: () => void;
}

export const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  item,
  onClose,
  onDownload,
  onConvertAnother,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item || !item.pdfUrl) return null;

  const targetPdfName = getPdfFilename(item.name);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoomLevel(100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-2 sm:p-4 md:p-6 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all ${
          isFullscreen
            ? 'h-full w-full'
            : 'h-[92vh] w-full max-w-5xl'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-900" title={targetPdfName}>
                {targetPdfName}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>{item.convertedSize ? formatBytes(item.convertedSize) : ''}</span>
                {item.pageCount && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span className="text-emerald-600 font-medium">Ready for download</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-xs text-slate-600">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleZoomReset}
                className="px-1.5 py-0.5 font-mono text-[11px] hover:bg-slate-100"
                title="Reset Zoom"
              >
                {zoomLevel}%
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
                className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>

            {/* Download */}
            <button
              onClick={() => onDownload(item)}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 active:scale-97"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
              title="Close Preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Area */}
        <div className="relative flex-1 overflow-auto bg-slate-800/90 p-2 sm:p-4 flex items-center justify-center">
          <div
            className="h-full w-full max-w-4xl transition-all duration-150 origin-top shadow-xl"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            <iframe
              src={`${item.pdfUrl}#toolbar=1&navpanes=0`}
              title="PDF Preview"
              className="h-full w-full rounded-lg border-0 bg-white"
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Original: <strong>{item.name}</strong> ({formatBytes(item.size)})</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (item.pdfUrl) {
                  window.open(item.pdfUrl, '_blank');
                }
              }}
              className="flex items-center gap-1 text-slate-600 hover:text-indigo-600"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Open in New Tab</span>
            </button>
            <button
              onClick={onConvertAnother}
              className="flex items-center gap-1 font-semibold text-indigo-600 hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Convert Another File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
