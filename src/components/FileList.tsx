import React, { useRef } from 'react';
import { Play, Download, Trash2, Plus, Loader2 } from 'lucide-react';
import { FileItem } from '../types';
import { FileCard } from './FileCard';

interface FileListProps {
  files: FileItem[];
  isConvertingAll: boolean;
  isDownloadingZip: boolean;
  onConvertSingle: (id: string) => void;
  onConvertAll: () => void;
  onDownloadSingle: (item: FileItem) => void;
  onDownloadAllZip: () => void;
  onPreview: (item: FileItem) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onAddMore: (files: FileList | File[]) => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  isConvertingAll,
  isDownloadingZip,
  onConvertSingle,
  onConvertAll,
  onDownloadSingle,
  onDownloadAllZip,
  onPreview,
  onRemove,
  onClearAll,
  onAddMore,
}) => {
  const addInputRef = useRef<HTMLInputElement>(null);

  const readyToConvertCount = files.filter(
    (f) => f.status === 'idle' || f.status === 'error'
  ).length;
  const convertedCount = files.filter((f) => f.status === 'success').length;

  return (
    <div className="w-full space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-slate-900">
            Files in Queue
          </h3>
          <span className="text-xs text-slate-500">
            {files.length} {files.length === 1 ? 'document' : 'documents'}
            {convertedCount > 0 && ` · ${convertedCount} converted`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add more files */}
          <input
            ref={addInputRef}
            type="file"
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onAddMore(e.target.files);
                e.target.value = '';
              }
            }}
            className="hidden"
            accept=".docx,.doc,.txt,.rtf,.odt,.xlsx,.xls,.csv,.ods,.pptx,.ppt,.odp,.jpg,.jpeg,.png,.webp,.bmp,.tiff,.tif,.gif,.svg,.html,.htm,.md,.markdown,.xml,.json"
          />
          <button
            onClick={() => addInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add More</span>
          </button>

          {/* Download All (ZIP) */}
          {convertedCount > 0 && (
            <button
              onClick={onDownloadAllZip}
              disabled={isDownloadingZip}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-50"
            >
              {isDownloadingZip ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>Download All (ZIP)</span>
            </button>
          )}

          {/* Convert All */}
          {readyToConvertCount > 0 && (
            <button
              onClick={onConvertAll}
              disabled={isConvertingAll}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 active:scale-98 disabled:opacity-50"
            >
              {isConvertingAll ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-white" />
              )}
              <span>Convert All ({readyToConvertCount})</span>
            </button>
          )}

          {/* Clear All */}
          <button
            onClick={onClearAll}
            disabled={isConvertingAll}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40"
            title="Clear list"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear List</span>
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-2.5">
        {files.map((fileItem) => (
          <FileCard
            key={fileItem.id}
            item={fileItem}
            onConvert={onConvertSingle}
            onPreview={onPreview}
            onDownload={onDownloadSingle}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};
