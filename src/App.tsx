/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ConversionSettings, FileItem, HistoryRecord } from './types';
import { getFileExtension, getPdfFilename, validateFile } from './utils/fileValidation';
import {
  convertDocumentToPdf,
  downloadAllAsZip,
  downloadPdf,
} from './services/conversion';
import {
  addHistoryRecord,
  clearAllHistory,
  deleteHistoryRecord,
  getHistoryRecords,
} from './utils/historyStorage';
import { Header, PageTab } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ConvertPage } from './pages/ConvertPage';
import { HistoryPage } from './pages/HistoryPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { PDFPreviewModal } from './components/PDFPreviewModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>('home');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [settings, setSettings] = useState<ConversionSettings>({
    pageSize: 'a4',
    orientation: 'auto',
    margins: 'normal',
    imageQuality: 'high',
  });
  const [isConvertingAll, setIsConvertingAll] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [previewItem, setPreviewItem] = useState<FileItem | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistoryRecords());
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.pdfUrl) {
          URL.revokeObjectURL(f.pdfUrl);
        }
      });
    };
  }, [files]);

  /**
   * Handle files added from dropzone or file input
   */
  const handleFilesSelected = (selectedFiles: FileList | File[]) => {
    const newItems: FileItem[] = [];
    const fileArray = Array.from(selectedFiles);

    fileArray.forEach((file) => {
      const validation = validateFile(file);
      const ext = getFileExtension(file.name);

      if (!validation.valid) {
        // Add with error state so user gets clear visual error feedback
        newItems.push({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
          extension: ext || 'unknown',
          mimeType: file.type || 'application/octet-stream',
          category: 'document',
          status: 'error',
          progress: 0,
          errorMessage: validation.error || 'Invalid file format or size.',
        });
      } else {
        newItems.push({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
          extension: ext,
          mimeType: file.type || 'application/octet-stream',
          category: validation.spec?.category || 'document',
          status: 'idle',
          progress: 0,
        });
      }
    });

    setFiles((prev) => [...prev, ...newItems]);
  };

  /**
   * Convert a single file item
   */
  const handleConvertSingle = async (id: string) => {
    const target = files.find((f) => f.id === id);
    if (!target) return;

    // Set to converting
    setFiles((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'converting', progress: 5, errorMessage: undefined }
          : item
      )
    );

    try {
      const result = await convertDocumentToPdf(target, settings, (progress) => {
        setFiles((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, progress } : item
          )
        );
      });

      // Update file state to success
      setFiles((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'success',
                progress: 100,
                pdfBlob: result.pdfBlob,
                pdfUrl: result.pdfUrl,
                convertedSize: result.convertedSize,
                conversionTimeMs: result.conversionTimeMs,
                pageCount: result.pageCount,
              }
            : item
        )
      );

      // Save to local history
      const historyItem: HistoryRecord = {
        id: target.id,
        originalName: target.name,
        pdfName: getPdfFilename(target.name),
        extension: target.extension,
        category: target.category,
        originalSize: target.size,
        pdfSize: result.convertedSize,
        timestamp: Date.now(),
        conversionTimeMs: result.conversionTimeMs,
        pageCount: result.pageCount,
        status: 'success',
      };
      addHistoryRecord(historyItem);
      setHistory(getHistoryRecords());
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Conversion failed. Please try another file.';
      setFiles((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'error',
                progress: 0,
                errorMessage: message,
              }
            : item
        )
      );
    }
  };

  /**
   * Convert all ready or failed items
   */
  const handleConvertAll = async () => {
    const queue = files.filter(
      (f) => f.status === 'idle' || f.status === 'error'
    );
    if (queue.length === 0) return;

    setIsConvertingAll(true);

    for (const item of queue) {
      await handleConvertSingle(item.id);
    }

    setIsConvertingAll(false);
  };

  /**
   * Download single converted PDF
   */
  const handleDownloadSingle = (item: FileItem) => {
    if (!item.pdfBlob) return;
    const targetName = getPdfFilename(item.name);
    downloadPdf(item.pdfBlob, targetName);
  };

  /**
   * Download all converted PDFs bundled into a single ZIP
   */
  const handleDownloadAllZip = async () => {
    const converted = files.filter((f) => f.status === 'success' && f.pdfBlob);
    if (converted.length === 0) return;

    setIsDownloadingZip(true);
    try {
      await downloadAllAsZip(files);
    } catch (err: unknown) {
      console.error('Failed to create ZIP:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  /**
   * Preview a converted PDF in the modal
   */
  const handlePreview = (item: FileItem) => {
    setPreviewItem(item);
  };

  /**
   * Remove single file from queue
   */
  const handleRemove = (id: string) => {
    setFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item?.pdfUrl) {
        URL.revokeObjectURL(item.pdfUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
    if (previewItem?.id === id) {
      setPreviewItem(null);
    }
  };

  /**
   * Clear all files from queue
   */
  const handleClearAll = () => {
    files.forEach((f) => {
      if (f.pdfUrl) {
        URL.revokeObjectURL(f.pdfUrl);
      }
    });
    setFiles([]);
    setPreviewItem(null);
  };

  /**
   * Clear history
   */
  const handleClearHistory = () => {
    clearAllHistory();
    setHistory([]);
  };

  /**
   * Delete single history record
   */
  const handleDeleteRecord = (id: string) => {
    deleteHistoryRecord(id);
    setHistory(getHistoryRecords());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        queueCount={files.length}
        hasConverted={files.some((f) => f.status === 'success')}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'home' && (
          <HomePage
            files={files}
            settings={settings}
            isConvertingAll={isConvertingAll}
            isDownloadingZip={isDownloadingZip}
            onFilesSelected={handleFilesSelected}
            onSettingsChange={setSettings}
            onConvertSingle={handleConvertSingle}
            onConvertAll={handleConvertAll}
            onDownloadSingle={handleDownloadSingle}
            onDownloadAllZip={handleDownloadAllZip}
            onPreview={handlePreview}
            onRemove={handleRemove}
            onClearAll={handleClearAll}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'convert' && (
          <ConvertPage
            files={files}
            settings={settings}
            isConvertingAll={isConvertingAll}
            isDownloadingZip={isDownloadingZip}
            onFilesSelected={handleFilesSelected}
            onSettingsChange={setSettings}
            onConvertSingle={handleConvertSingle}
            onConvertAll={handleConvertAll}
            onDownloadSingle={handleDownloadSingle}
            onDownloadAllZip={handleDownloadAllZip}
            onPreview={handlePreview}
            onRemove={handleRemove}
            onClearAll={handleClearAll}
          />
        )}

        {currentTab === 'history' && (
          <HistoryPage
            history={history}
            onClearHistory={handleClearHistory}
            onDeleteRecord={handleDeleteRecord}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'about' && <AboutPage />}

        {currentTab === 'privacy' && <PrivacyPage />}
      </main>

      {/* PDF Preview Modal */}
      {previewItem && (
        <PDFPreviewModal
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onDownload={handleDownloadSingle}
          onConvertAnother={() => {
            setPreviewItem(null);
            setCurrentTab('convert');
          }}
        />
      )}

      {/* Footer */}
      <Footer onNavigate={setCurrentTab} />
    </div>
  );
}
