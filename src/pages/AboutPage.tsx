import React from 'react';
import {
  Info,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  FileCode,
  Shield,
  Server,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { SUPPORTED_FORMATS } from '../utils/fileValidation';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-indigo-600" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            About Universal PDF Converter
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Architecture, format specifications, Vercel deployment, and runtime compatibility.
        </p>
      </div>

      {/* Overview & WORD2PDF Preservation */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Evolution from WORD2PDF
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The application builds upon the core foundation of <strong>WORD2PDF</strong>. Rather than rewriting the project or discarding existing functionality, it elevates the system into a comprehensive <strong>Universal Document to PDF platform</strong> supporting over 20 standard business and technical formats.
        </p>
      </section>

      {/* Conversion Architecture */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Conversion Engine Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span>In-Browser Client-Side Sandbox</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Conversions are executed directly in the user’s browser using modern JavaScript engines. Confidential corporate documents never touch external server disks, eliminating data leaks and server queue latency.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Server className="h-4 w-4 text-indigo-600" />
              <span>100% Vercel Serverless Compatible</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Avoids brittle dependencies like LibreOffice, Microsoft Office binaries, Windows COM objects, or heavyweight native C++ bindings that fail in Vercel serverless environments.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Formats Matrix */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Supported Format Specifications & Engines
        </h2>
        <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Engine / Pipeline</th>
                  <th className="py-3 px-4">Preserved Elements</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-900">.DOCX</td>
                  <td className="py-2.5 px-4">Document</td>
                  <td className="py-2.5 px-4 text-slate-600">Mammoth + DOMParser + jsPDF</td>
                  <td className="py-2.5 px-4 text-slate-500">Headings, paragraphs, tables, bold/italic, lists</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-900">.DOC</td>
                  <td className="py-2.5 px-4">Document</td>
                  <td className="py-2.5 px-4 text-slate-600">Binary stream decoder + jsPDF</td>
                  <td className="py-2.5 px-4 text-slate-500">Text stream & layout structure (legacy Word 97-2004)</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-900">.TXT, .RTF</td>
                  <td className="py-2.5 px-4">Document</td>
                  <td className="py-2.5 px-4 text-slate-600">RTF grammar parser + jsPDF</td>
                  <td className="py-2.5 px-4 text-slate-500">Plaintext typography, line breaks, pagination</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-900">.ODT</td>
                  <td className="py-2.5 px-4">Document</td>
                  <td className="py-2.5 px-4 text-slate-600">JSZip + XML DOM + jsPDF</td>
                  <td className="py-2.5 px-4 text-slate-500">OpenDocument headings, text paragraphs, tables</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-900">.XLSX, .XLS, .CSV, .ODS</td>
                  <td className="py-2.5 px-4">Spreadsheet</td>
                  <td className="py-2.5 px-4 text-slate-600">SheetJS + jspdf-autotable</td>
                  <td className="py-2.5 px-4 text-slate-500">Multi-sheet tables, zebra rows, auto column widths</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-900">.PPTX, .PPT, .ODP</td>
                  <td className="py-2.5 px-4">Presentation</td>
                  <td className="py-2.5 px-4 text-slate-600">JSZip OpenXML + jsPDF</td>
                  <td className="py-2.5 px-4 text-slate-500">Landscape slide deck cards, titles, bullet lists</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-900">JPG, PNG, WEBP, BMP, TIFF, GIF</td>
                  <td className="py-2.5 px-4">Image</td>
                  <td className="py-2.5 px-4 text-slate-600">Canvas 2D + jsPDF.addImage</td>
                  <td className="py-2.5 px-4 text-slate-500">High-res pixel rendering, orientation matching, margins</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-900">.MD, .HTML, .JSON, .XML</td>
                  <td className="py-2.5 px-4">Web & Code</td>
                  <td className="py-2.5 px-4 text-slate-600">Marked + DOMParser + jsPDF</td>
                  <td className="py-2.5 px-4 text-slate-500">Structured markdown formatting, code blocks, line numbers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Node 25 Compatibility */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Node.js 25 & Environment Requirements
        </h2>
        <div className="rounded-xl border border-slate-200/90 bg-slate-50 p-5 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Strict Zero EBADENGINE Compatibility</span>
          </div>
          <p>
            The project dependency tree has been strictly validated for compatibility with <strong>Node.js v25.2.0</strong> and <strong>npm 11.6.2</strong>. Every dependency specifies engines allowing Node 25 with no deprecation warnings.
          </p>
          <div className="mt-3 font-mono text-[11px] bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto">
            <code>
              node -v # v25.2.0<br />
              npm -v  # 11.6.2<br />
              npm install # Clean install with 0 warnings<br />
              npm run build # Production build
            </code>
          </div>
        </div>
      </section>

      {/* Vercel Deployment Instructions */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Deploying to Vercel
        </h2>
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-3 text-xs text-slate-600">
          <p>
            To deploy this project to Vercel:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-700">
            <li>Push repository to GitHub, GitLab, or Bitbucket.</li>
            <li>Import the project in your Vercel Dashboard.</li>
            <li>Framework Preset will auto-detect as <strong>Vite</strong>.</li>
            <li>Build Command: <code>npm run build</code></li>
            <li>Output Directory: <code>dist</code></li>
            <li>Click <strong>Deploy</strong>. No specialized server software or LibreOffice packages required!</li>
          </ol>
        </div>
      </section>
    </div>
  );
};
