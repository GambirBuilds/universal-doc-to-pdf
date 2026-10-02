import React from 'react';
import { FileText, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { PageTab } from './Header';

interface FooterProps {
  onNavigate: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <FileText className="h-4 w-4" />
              </div>
              <span className="font-bold tracking-tight text-slate-900">
                Universal PDF Converter
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              High-performance, secure document conversion platform. Convert Word documents, spreadsheets, presentations, images, and text formats into publication-ready PDF files directly within your browser.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-600 font-medium">
              <Shield className="h-3.5 w-3.5" />
              <span>Zero-server storage · 100% Private browser sandboxing</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-indigo-600 transition"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('convert')}
                  className="hover:text-indigo-600 transition"
                >
                  Document Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('history')}
                  className="hover:text-indigo-600 transition"
                >
                  Conversion History
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-indigo-600 transition"
                >
                  Supported Formats & Specs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-indigo-600 transition"
                >
                  Security & Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Deployment & Environment */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Specifications
            </h4>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Node.js v25.2.0 Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Vercel Serverless Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Zero EBADENGINE Warnings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>20+ Document Formats</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hairline divider & copyright */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Universal Document to PDF Converter. Built for local development and Vercel cloud deployment.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-600">Privacy Notice</button>
            <button onClick={() => onNavigate('about')} className="hover:text-slate-600">Documentation</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
