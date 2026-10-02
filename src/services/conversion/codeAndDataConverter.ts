import { marked } from 'marked';
import { ConversionSettings } from '../../types';
import { renderContainerToMultiPagePdf } from './domPdfRenderer';

/**
 * Converts Markdown (.md, .markdown) files into formatted PDF
 * Fully supports Nepali, English, and special symbols
 */
export async function convertMarkdownToPdf(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(20);
  const rawText = await file.text();

  onProgress?.(45);
  const html = await marked.parse(rawText);

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.padding = '48px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily =
    "'Mukta', 'Noto Sans Devanagari', 'Plus Jakarta Sans', system-ui, sans-serif";
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.7';
  container.style.color = '#1e293b';

  container.innerHTML = `
    <div style="font-size: 20px; font-weight: bold; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1.5px solid #e2e8f0; color: #0f172a;">
      ${escapeHtml(file.name)}
    </div>
    <div class="markdown-body">
      ${html}
    </div>
  `;

  document.body.appendChild(container);

  try {
    onProgress?.(65);
    const blob = await renderContainerToMultiPagePdf(container, {
      settings,
      onProgress,
      startProgress: 65,
      endProgress: 98,
    });
    onProgress?.(100);
    return blob;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Converts HTML files to PDF
 */
export async function convertHtmlToPdf(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(25);
  const html = await file.text();

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.padding = '48px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily =
    "'Mukta', 'Noto Sans Devanagari', 'Plus Jakarta Sans', system-ui, sans-serif";
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.7';
  container.style.color = '#1e293b';

  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    onProgress?.(65);
    const blob = await renderContainerToMultiPagePdf(container, {
      settings,
      onProgress,
      startProgress: 65,
      endProgress: 98,
    });
    onProgress?.(100);
    return blob;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Converts JSON files to a formatted code document PDF
 */
export async function convertJsonToPdf(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(25);
  const rawText = await file.text();

  let formatted = '';
  try {
    const parsed = JSON.parse(rawText);
    formatted = JSON.stringify(parsed, null, 2);
  } catch {
    formatted = rawText;
  }

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.padding = '48px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily =
    "'JetBrains Mono', 'Mukta', 'Noto Sans Devanagari', monospace";
  container.style.fontSize = '12px';
  container.style.lineHeight = '1.6';
  container.style.color = '#1e293b';
  container.style.whiteSpace = 'pre-wrap';

  container.innerHTML = `
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: bold; margin-bottom: 6px; color: #0f172a;">
      ${escapeHtml(file.name)} - JSON Data
    </div>
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; color: #64748b; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">
      Size: ${(file.size / 1024).toFixed(1)} KB
    </div>
    <pre style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; overflow-x: auto;"><code>${escapeHtml(formatted)}</code></pre>
  `;

  document.body.appendChild(container);

  try {
    onProgress?.(65);
    const blob = await renderContainerToMultiPagePdf(container, {
      settings,
      onProgress,
      startProgress: 65,
      endProgress: 98,
    });
    onProgress?.(100);
    return blob;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Converts XML files to a formatted document PDF
 */
export async function convertXmlToPdf(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(25);
  const rawText = await file.text();

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.padding = '48px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily =
    "'JetBrains Mono', 'Mukta', 'Noto Sans Devanagari', monospace";
  container.style.fontSize = '12px';
  container.style.lineHeight = '1.6';
  container.style.color = '#1e293b';
  container.style.whiteSpace = 'pre-wrap';

  container.innerHTML = `
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: bold; margin-bottom: 6px; color: #0f172a;">
      ${escapeHtml(file.name)} - XML Document
    </div>
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; color: #64748b; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">
      Size: ${(file.size / 1024).toFixed(1)} KB
    </div>
    <pre style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; overflow-x: auto;"><code>${escapeHtml(rawText)}</code></pre>
  `;

  document.body.appendChild(container);

  try {
    onProgress?.(65);
    const blob = await renderContainerToMultiPagePdf(container, {
      settings,
      onProgress,
      startProgress: 65,
      endProgress: 98,
    });
    onProgress?.(100);
    return blob;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
