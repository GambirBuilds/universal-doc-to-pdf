import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  RotateCcw,
  X,
  Loader2,
  Clock,
} from 'lucide-react';
import { FileItem, SupportedCategory } from '../types';
import { formatBytes } from '../utils/fileValidation';

interface FileCardProps {
  item: FileItem;
  onConvert: (id: string) => void;
  onPreview: (item: FileItem) => void;
  onDownload: (item: FileItem) => void;
  onRemove: (id: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({
  item,
  onConvert,
  onPreview,
  onDownload,
  onRemove,
}) => {
  const getCategoryIcon = (category: SupportedCategory) => {
    switch (category) {
      case 'document':
        return <FileText className="h-5 w-5 text-indigo-600" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-5 w-5 text-emerald-600" />;
      case 'presentation':
        return <Presentation className="h-5 w-5 text-amber-600" />;
      case 'image':
        return <ImageIcon className="h-5 w-5 text-purple-600" />;
      case 'code_data':
        return <FileCode className="h-5 w-5 text-sky-600" />;
      default:
        return <FileText className="h-5 w-5 text-slate-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (item.status) {
      case 'idle':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            Ready to convert
          </span>
        );
      case 'converting':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Converting ({item.progress}%)
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Converted
            {item.pageCount ? ` · ${item.pageCount} ${item.pageCount === 1 ? 'page' : 'pages'}` : ''}
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
            <AlertCircle className="h-3.5 w-3.5" />
            Conversion failed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-white p-4 transition-all ${
        item.status === 'error'
          ? 'border-rose-200 bg-rose-50/20'
          : item.status === 'success'
          ? 'border-emerald-200/90 shadow-2xs'
          : item.status === 'converting'
          ? 'border-indigo-300 shadow-sm'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Icon & File Meta */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            {getCategoryIcon(item.category)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4
                title={item.name}
                className="truncate text-sm font-semibold text-slate-900 max-w-xs sm:max-w-md"
              >
                {item.name}
              </h4>
              <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                {item.extension}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{formatBytes(item.size)}</span>
              {item.convertedSize && (
                <>
                  <span aria-hidden="true">→</span>
                  <span className="font-medium text-slate-700">
                    PDF: {formatBytes(item.convertedSize)}
                  </span>
                </>
              )}
              {item.conversionTimeMs !== undefined && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    {(item.conversionTimeMs / 1000).toFixed(1)}s
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              {getStatusBadge()}
            </div>

            {/* Error Message banner if failed */}
            {item.status === 'error' && item.errorMessage && (
              <p className="mt-2 text-xs text-rose-600 bg-rose-50 rounded-md p-2 border border-rose-100">
                {item.errorMessage}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:self-center shrink-0">
          {item.status === 'idle' && (
            <button
              onClick={() => onConvert(item.id)}
              className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 active:scale-97"
            >
              Convert
            </button>
          )}

          {item.status === 'error' && (
            <button
              onClick={() => onConvert(item.id)}
              className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw className="h-3 w-3" />
              Retry
            </button>
          )}

          {item.status === 'success' && (
            <>
              <button
                onClick={() => onPreview(item)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-indigo-600"
                title="Preview PDF"
              >
                <Eye className="h-3.5 w-3.5 text-slate-500" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => onDownload(item)}
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-97"
                title="Download PDF"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </button>
            </>
          )}

          {/* Remove button */}
          <button
            onClick={() => onRemove(item.id)}
            disabled={item.status === 'converting'}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40"
            title="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar when converting */}
      {item.status === 'converting' && (
        <div className="mt-3 w-full overflow-hidden rounded-full bg-slate-100 h-1.5">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
