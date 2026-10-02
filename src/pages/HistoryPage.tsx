import React from 'react';
import {
  Clock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  FileCode,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { HistoryRecord, SupportedCategory } from '../types';
import { formatBytes } from '../utils/fileValidation';
import { PageTab } from '../components/Header';

interface HistoryPageProps {
  history: HistoryRecord[];
  onClearHistory: () => void;
  onDeleteRecord: (id: string) => void;
  onNavigate: (tab: PageTab) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onClearHistory,
  onDeleteRecord,
  onNavigate,
}) => {
  const getCategoryIcon = (category: SupportedCategory) => {
    switch (category) {
      case 'document':
        return <FileText className="h-4 w-4 text-indigo-600" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-4 w-4 text-emerald-600" />;
      case 'presentation':
        return <Presentation className="h-4 w-4 text-amber-600" />;
      case 'image':
        return <ImageIcon className="h-4 w-4 text-purple-600" />;
      case 'code_data':
        return <FileCode className="h-4 w-4 text-sky-600" />;
      default:
        return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };

  const totalConverted = history.filter((h) => h.status === 'success').length;
  const totalBytes = history.reduce((sum, item) => sum + item.originalSize, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Conversion History
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Audit log of documents converted in this browser session. Only safe metadata is stored locally.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Converted</span>
          <p className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {totalConverted}
          </p>
          <span className="text-[11px] text-slate-400">PDF documents generated</span>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Processed Volume</span>
          <p className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {formatBytes(totalBytes)}
          </p>
          <span className="text-[11px] text-slate-400">Total input document size</span>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Privacy Guarantee</span>
          <p className="mt-1 text-sm font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            Metadata Only
          </p>
          <span className="text-[11px] text-slate-400">File contents never stored</span>
        </div>
      </div>

      {/* History Table */}
      {history.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Document</th>
                  <th className="py-3 px-4">Generated PDF</th>
                  <th className="py-3 px-4">Original Size</th>
                  <th className="py-3 px-4">PDF Size</th>
                  <th className="py-3 px-4">Pages</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        {getCategoryIcon(record.category)}
                        <span className="truncate font-medium text-slate-900" title={record.originalName}>
                          {record.originalName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-600">{record.pdfName}</span>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                      {formatBytes(record.originalSize)}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums font-semibold text-slate-900">
                      {formatBytes(record.pdfSize)}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                      {record.pageCount || 1}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-500">
                      {(record.conversionTimeMs / 1000).toFixed(1)}s
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteRecord(record.id)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                        title="Remove record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            No conversion history yet
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Once you convert documents, a record of the conversion will be saved in your browser.
          </p>
          <button
            onClick={() => onNavigate('convert')}
            className="mt-4 flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
          >
            <span>Start Converting</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
