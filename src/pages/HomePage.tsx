import React from 'react';
import {
  FileText,
  Shield,
  Zap,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  FileCode,
  Sparkles,
  Lock,
  Download,
} from 'lucide-react';
import { ConversionSettings, FileItem } from '../types';
import { FileUploader } from '../components/FileUploader';
import { ConversionSettingsBar } from '../components/ConversionSettingsBar';
import { FileList } from '../components/FileList';
import { PageTab } from '../components/Header';

interface HomePageProps {
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
  onNavigate: (tab: PageTab) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
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
  onNavigate,
}) => {
  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 mb-4">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span>Universal Document to PDF Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
          Convert Any Document to PDF
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
          Fast, secure and easy document conversion directly from your browser.
          Supports Word, Excel, PowerPoint, Images, Markdown, and Web formats with high fidelity.
        </p>
      </section>

      {/* Main Conversion Panel */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Upload Dropzone */}
        <FileUploader
          onFilesSelected={onFilesSelected}
          disabled={isConvertingAll}
        />

        {/* Conversion Settings Bar */}
        <ConversionSettingsBar
          settings={settings}
          onChange={onSettingsChange}
          disabled={isConvertingAll}
        />

        {/* Queued / Converted Files List */}
        {files.length > 0 && (
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
        )}
      </section>

      {/* Format Categories Showcase */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Supported Document Formats
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Tailored conversion pipelines built for maximum fidelity and zero document loss.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Documents */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-indigo-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-3">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Documents</h3>
            <p className="mt-1 text-xs text-slate-500">
              DOCX, DOC, TXT, RTF, ODT with headings, tables, and styling.
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {['DOCX', 'DOC', 'TXT', 'RTF', 'ODT'].map((fmt) => (
                <span key={fmt} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          {/* Spreadsheets */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-emerald-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-3">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Spreadsheets</h3>
            <p className="mt-1 text-xs text-slate-500">
              XLSX, XLS, CSV, ODS rendered into clean tabular reports.
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {['XLSX', 'XLS', 'CSV', 'ODS'].map((fmt) => (
                <span key={fmt} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          {/* Presentations */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-amber-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 mb-3">
              <Presentation className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Presentations</h3>
            <p className="mt-1 text-xs text-slate-500">
              PPTX, PPT, ODP transformed into landscape presentation slides.
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {['PPTX', 'PPT', 'ODP'].map((fmt) => (
                <span key={fmt} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-purple-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 mb-3">
              <ImageIcon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Images</h3>
            <p className="mt-1 text-xs text-slate-500">
              JPG, PNG, WEBP, BMP, TIFF, GIF with quality & margin scaling.
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {['JPG', 'PNG', 'WEBP', 'BMP', 'TIFF'].map((fmt) => (
                <span key={fmt} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          {/* Code & Data */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-sky-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600 mb-3">
              <FileCode className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Web & Data</h3>
            <p className="mt-1 text-xs text-slate-500">
              Markdown, HTML, JSON, XML with syntax structure & line numbers.
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {['MD', 'HTML', 'JSON', 'XML'].map((fmt) => (
                <span key={fmt} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature & Security Highlights */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                100% Client-Side Privacy
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your confidential documents are processed entirely inside your local browser sandbox. No files are ever sent to remote third-party conversion servers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Zap className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Fast & Scalable
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Near-instant local compilation powered by lightweight JavaScript engines. Convert multiple files simultaneously without queue wait times.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <Download className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Batch ZIP Generation
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drop a whole folder of mixed documents, convert all in one click, and download everything as a clean, organized ZIP archive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Step Bar */}
      <section className="max-w-5xl mx-auto px-4 pt-4 text-center">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">
          The Conversion Workflow
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Upload File', desc: 'Drag & drop any document' },
            { step: '02', title: 'Validate File', desc: 'Format & size integrity check' },
            { step: '03', title: 'Convert to PDF', desc: 'Format-specific renderer' },
            { step: '04', title: 'Preview PDF', desc: 'Inspect in browser viewer' },
            { step: '05', title: 'Download PDF', desc: 'Original filename preserved' },
          ].map((item, idx) => (
            <div
              key={item.step}
              className="relative flex flex-col items-center rounded-xl bg-slate-50 p-4 border border-slate-200/80"
            >
              <span className="font-mono text-xs font-bold text-indigo-600 mb-1">
                {item.step}
              </span>
              <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
              <p className="mt-1 text-[11px] text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
