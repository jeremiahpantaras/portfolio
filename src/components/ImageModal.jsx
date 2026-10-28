import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Download, X } from 'lucide-react';
import useFocusTrap from '../hooks/useFocusTrap';
import useScrollLock from '../hooks/useScrollLock';

// Image lightbox. `image` is the optimised display file; "Download Photo" saves `downloadSrc`
// (the untouched original) when one is provided, so downloads keep their full quality.
export default function ImageModal({ image, alt = '', downloadSrc, isOpen, onClose }) {
  const dialogRef = useRef(null);
  const open = isOpen && !!image;
  useScrollLock(open);
  useFocusTrap(dialogRef, open, onClose);

  if (!open) return null;

  const source = downloadSrc ?? image;
  const filename = decodeURIComponent(source.split('/').pop() || 'download');

  const triggerDownload = (href, newTab) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    if (newTab) a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(source);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      triggerDownload(url, false);
      window.URL.revokeObjectURL(url);
    } catch {
      triggerDownload(source, true);
    }
  };

  // Portalled to <body> so no transformed ancestor (GSAP reveals) can trap the fixed overlay.
  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt || 'Image preview'}
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 outline-none sm:p-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image preview"
        className="fixed right-3 top-3 z-[110] inline-flex h-9 w-9 pointer-coarse:h-11 pointer-coarse:w-11 items-center justify-center border border-line-strong bg-ink-900 text-fg-muted transition-colors hover:text-fg sm:right-6 sm:top-6"
      >
        <X size={22} aria-hidden="true" />
      </button>

      <div className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-5">
        <img src={image} alt={alt} className="max-h-[78vh] max-w-full object-contain md:max-h-[84vh]" />
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex min-h-9 pointer-coarse:min-h-11 items-center gap-2 border border-line-strong px-4 text-small text-fg transition-colors duration-200 hover:border-fg"
        >
          <Download size={16} aria-hidden="true" />
          Download Photo
        </button>
      </div>
    </div>,
    document.body,
  );
}
