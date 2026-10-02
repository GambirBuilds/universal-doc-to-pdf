# Universal Document to PDF Converter

A high-performance, secure document conversion web application that converts documents, spreadsheets, presentations, images, and structured code files into publication-ready PDF documents directly from the browser.

Expanded and evolved from the original **WORD2PDF** project.

---

## Features

- **Universal Format Support**: Converts DOCX, DOC, TXT, RTF, ODT, XLSX, XLS, CSV, ODS, PPTX, PPT, ODP, JPG, PNG, WEBP, BMP, TIFF, GIF, SVG, Markdown, HTML, JSON, and XML.
- **100% Client-Side Privacy**: All conversions execute natively inside the user's browser sandbox using pure JavaScript engines. Files are never transmitted or stored on remote servers.
- **Batch Conversion & ZIP Export**: Convert multiple documents in a single click and download all generated PDFs bundled into an organized `.zip` archive.
- **Interactive PDF Preview**: In-app viewer with zoom controls, fullscreen toggle, page indicators, and instant download.
- **Custom PDF Settings**:
  - **Page Sizes**: A4, US Letter, US Legal
  - **Orientation**: Auto-detect, Portrait, Landscape
  - **Margins**: Normal (18mm), Narrow (10mm), Wide (28mm)
  - **Image Quality**: Standard, High, Maximum
- **Local Conversion History**: Safe audit log stored strictly in browser `localStorage` (metadata only, zero confidential file storage).
- **Vercel & Node 25 Ready**: Zero `EBADENGINE` warnings, no native C++ binaries, and no external LibreOffice dependencies.

---

## Supported File Formats

| Category | File Formats | Engine / Pipeline | Features Preserved |
| :--- | :--- | :--- | :--- |
| **Documents** | `.docx`, `.doc`, `.txt`, `.rtf`, `.odt` | Mammoth · JSZip · DOMParser · jsPDF | Headings, paragraphs, bold/italic, bullet lists, tables, pagination |
| **Spreadsheets** | `.xlsx`, `.xls`, `.csv`, `.ods` | SheetJS · jspdf-autotable | Multi-sheet workbooks, formatted tables, auto column widths, zebra striping |
| **Presentations** | `.pptx`, `.ppt`, `.odp` | JSZip OpenXML · jsPDF | Landscape slide deck layout, slide cards, titles, bullet lists, slide numbering |
| **Images** | `.jpg`, `.jpeg`, `.png`, `.webp`, `.bmp`, `.tiff`, `.gif`, `.svg` | HTML5 Canvas · jsPDF.addImage | Aspect ratio scaling, auto orientation, margin fitting, JPEG/PNG compression |
| **Web & Data** | `.md`, `.markdown`, `.html`, `.json`, `.xml` | Marked · DOMParser · jsPDF | Styled headings, blockquotes, syntax code blocks with line numbers, monospace type |

---

## Environment Requirements

- **Node.js**: `v25.2.0` (also compatible with Node 22+ and 24 LTS)
- **npm**: `11.6.2`
- **Zero EBADENGINE Warnings**: All dependencies and sub-dependencies are vetted for Node 25.
- **Zero npm audit Vulnerabilities**: Uses official patched SheetJS (`0.20.3`) ensuring `found 0 vulnerabilities`.

---

## Installation & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 3. Build for Production
```bash
npm run build
```

---

## Project Structure

```text
├── index.html                   # HTML entry point with metadata and fonts
├── metadata.json                # AI Studio application metadata
├── package.json                 # Node 25-compatible dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite bundler configuration
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Root application router & queue state
│   ├── index.css                # Tailwind CSS v4 base & typography styles
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces (FileItem, Settings, History)
│   ├── utils/
│   │   ├── fileValidation.ts    # File extension, size & security sanitizer
│   │   └── historyStorage.ts    # LocalStorage metadata manager
│   ├── services/
│   │   └── conversion/
│   │       ├── index.ts                 # Master conversion dispatcher & ZIP exporter
│   │       ├── pdfConfig.ts             # Page dimension, margin & footer calculator
│   │       ├── documentConverter.ts     # DOCX, DOC, TXT, RTF, ODT converter
│   │       ├── spreadsheetConverter.ts  # XLSX, XLS, CSV, ODS converter
│   │       ├── presentationConverter.ts # PPTX, PPT, ODP converter
│   │       ├── imageConverter.ts        # JPG, PNG, WEBP, BMP, TIFF converter
│   │       └── codeAndDataConverter.ts  # Markdown, HTML, JSON, XML converter
│   ├── components/
│   │   ├── Header.tsx                   # Clean top navigation bar
│   │   ├── FileUploader.tsx             # Drag-and-drop file upload zone
│   │   ├── ConversionSettingsBar.tsx    # PDF page, margin & orientation controls
│   │   ├── FileCard.tsx                 # Individual queue item card with progress
│   │   ├── FileList.tsx                 # Queue management toolbar & batch actions
│   │   ├── PDFPreviewModal.tsx          # Interactive PDF viewer modal
│   │   └── Footer.tsx                   # Application footer & status notes
│   └── pages/
│       ├── HomePage.tsx                 # Primary conversion interface & features
│       ├── ConvertPage.tsx              # Dedicated batch conversion workspace
│       ├── HistoryPage.tsx              # Local conversion history & metrics
│       ├── AboutPage.tsx                # Technical documentation & format matrix
│       └── PrivacyPage.tsx              # Security, RAM cleanup & privacy policy
```

---

## Vercel Deployment Instructions

Because all conversion logic executes client-side in the browser via JavaScript and Web APIs:
- **No LibreOffice binary** is needed on the server.
- **No Microsoft Office DLLs** are needed.
- **No native C++ compilation** is required.
- **Serverless execution limits** (10-second timeout, memory limits) do not impact document processing.

### Steps to Deploy:
1. Connect your repository to **Vercel** (`https://vercel.com`).
2. Set Framework Preset to **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.

---

## Security Model

1. **Client-Side Isolation**: Files remain inside the browser memory sandbox.
2. **Path Traversal Protection**: Filenames are sanitized, stripping dangerous characters (`/`, `\`, `..`, `%`, etc.).
3. **Volatile RAM Only**: Object URLs are revoked via `URL.revokeObjectURL` on file deletion or component unmount.
4. **No Remote Tracking**: No third-party tracking scripts or remote telemetry.
