import React from 'react';
import { Sliders, Layout, Compass, Maximize2, Image as ImageIcon } from 'lucide-react';
import { ConversionSettings, ImageQuality, PageMargin, PageOrientation, PageSize } from '../types';

interface ConversionSettingsBarProps {
  settings: ConversionSettings;
  onChange: (settings: ConversionSettings) => void;
  disabled?: boolean;
}

export const ConversionSettingsBar: React.FC<ConversionSettingsBarProps> = ({
  settings,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Sliders className="h-3.5 w-3.5 text-indigo-600" />
          <span>PDF Output Settings</span>
        </div>
        <span className="text-[11px] text-slate-400">
          Settings apply to upcoming conversions
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3.5">
        {/* Page Size */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-1.5">
            <Layout className="h-3.5 w-3.5 text-slate-400" />
            <span>Page Size</span>
          </label>
          <select
            value={settings.pageSize}
            disabled={disabled}
            onChange={(e) =>
              onChange({ ...settings, pageSize: e.target.value as PageSize })
            }
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-medium text-slate-800 transition focus:border-indigo-500 focus:bg-white focus:outline-none disabled:opacity-60"
          >
            <option value="a4">A4 (210 × 297 mm)</option>
            <option value="letter">Letter (8.5 × 11 in)</option>
            <option value="legal">Legal (8.5 × 14 in)</option>
          </select>
        </div>

        {/* Orientation */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-1.5">
            <Compass className="h-3.5 w-3.5 text-slate-400" />
            <span>Orientation</span>
          </label>
          <select
            value={settings.orientation}
            disabled={disabled}
            onChange={(e) =>
              onChange({
                ...settings,
                orientation: e.target.value as PageOrientation,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-medium text-slate-800 transition focus:border-indigo-500 focus:bg-white focus:outline-none disabled:opacity-60"
          >
            <option value="auto">Auto (Detect Document Flow)</option>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>

        {/* Margins */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Margins</span>
          </label>
          <select
            value={settings.margins}
            disabled={disabled}
            onChange={(e) =>
              onChange({ ...settings, margins: e.target.value as PageMargin })
            }
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-medium text-slate-800 transition focus:border-indigo-500 focus:bg-white focus:outline-none disabled:opacity-60"
          >
            <option value="normal">Normal (18 mm)</option>
            <option value="narrow">Narrow (10 mm)</option>
            <option value="wide">Wide (28 mm)</option>
          </select>
        </div>

        {/* Render & Resolution Quality */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-1.5">
            <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
            <span>Output Quality & DPI</span>
          </label>
          <select
            value={settings.imageQuality}
            disabled={disabled}
            onChange={(e) =>
              onChange({
                ...settings,
                imageQuality: e.target.value as ImageQuality,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-medium text-slate-800 transition focus:border-indigo-500 focus:bg-white focus:outline-none disabled:opacity-60"
          >
            <option value="high">High (300 DPI Print - Recommended)</option>
            <option value="maximum">Ultra HD (400 DPI Razor-Sharp)</option>
            <option value="standard">Standard (240 DPI Compact)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
