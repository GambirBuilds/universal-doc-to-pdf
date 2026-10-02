import React from 'react';
import { Layers, FilePlus, Sparkles } from 'lucide-react';
import { ConversionSettings, FileItem } from '../types';
import { FileUploader } from '../components/FileUploader';
import { ConversionSettingsBar } from '../components/ConversionSettingsBar';
import { FileList } from '../components/FileList';

interface ConvertPageProps {
  files: FileItem[];
  settings: ConversionSettings;
  isConvertingAll: boolean;
  isDownloadingZip: boolean;
  onFilesSelected: (files: FileList | File[]) => void;
  onSettingsChange: (settings: ConversionSettings) => void;
  onConvertSingle: (id: string) => void;
  onConvertAll: () => void;
  onDownloadSingle: (item: FileItem) => void;
  onDownloadAllZip: () => void;
  onPreview: (item: FileItem) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export const ConvertPage: React.FC<ConvertPageProps> = ({
  files,
  settings,
  isConvertingAll,
  isDownloadingZip,
  onFilesSelected,
  onSettingsChange,
  onConvertSingle,
  onConvertAll,
  onDownloadSingle,
  onDownloadAllZip,
  onPreview,
  onRemove,
  onClearAll,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Document Conversion Workspace
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Batch process multiple document formats into publication-ready PDF files with custom page layout options.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          Queue: <span className="font-semibold text-slate-700">{files.length}</span> files
        </div>
      </div>

      {/* Settings bar */}
      <ConversionSettingsBar
        settings={settings}
        onChange={onSettingsChange}
        disabled={isConvertingAll}
      />

      {/* Uploader */}
      <FileUploader
        onFilesSelected={onFilesSelected}
        disabled={isConvertingAll}
      />

      {/* File List */}
      {files.length > 0 ? (
        <FileList
          files={files}
          isConvertingAll={isConvertingAll}
          isDownloadingZip={isDownloadingZip}
          onConvertSingle={onConvertSingle}
          onConvertAll={onConvertAll}
          onDownloadSingle={onDownloadSingle}
          onDownloadAllZip={onDownloadAllZip}
          onPreview={onPreview}
          onRemove={onRemove}
          onClearAll={onClearAll}
          onAddMore={onFilesSelected}
        />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
            <FilePlus className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            Your conversion queue is empty
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Drag and drop files onto the upload zone above or browse from your device to begin.
          </p>
        </div>
      )}
    </div>
  );
};
