import React from 'react';
import { Shield, Lock, EyeOff, Trash2, CheckCircle2, HardDrive } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-600" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Privacy & Security Guarantee
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          How your documents and data are processed with complete client-side confidentiality.
        </p>
      </div>

      {/* Primary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Lock className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Zero Server Uploads
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All document conversion code executes natively inside your browser window. Your files are never sent across the internet to our or any third-party servers.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <HardDrive className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Temporary Memory Only
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Document bytes reside in volatile browser RAM only for the duration of the conversion. Memory is immediately freed when you close or refresh the tab.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <EyeOff className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            No Tracking or Cookies
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We do not use advertising tracking cookies, user profiling, or invasive telemetry. Conversion history is stored strictly in your local device’s localStorage.
          </p>
        </div>
      </div>

      {/* Detailed FAQ */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Frequently Asked Privacy Questions
        </h2>

        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Can Universal PDF Converter view my documents?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed pl-5">
              No. Because the conversion engine runs on your CPU within the browser’s sandbox, neither the developers nor any server operators have access to your documents, filenames, or generated PDFs.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Where is the conversion history stored?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed pl-5">
              The History page displays records kept solely in your browser’s HTML5 <code>localStorage</code>. Only safe metadata (filename, original size, output size, conversion date) is saved. The actual document content is never stored. You can clear this history anytime using the “Clear History” button.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Is it safe to convert confidential or legal documents?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed pl-5">
              Yes. In fact, client-side browser conversion is inherently safer than traditional online conversion websites because traditional sites require uploading your files to remote cloud storage where they could be logged, intercepted, or leaked.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
