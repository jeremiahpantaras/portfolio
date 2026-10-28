import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Download, X } from 'lucide-react';
import { profile } from '../data/profile';
import useFocusTrap from '../hooks/useFocusTrap';
import useScrollLock from '../hooks/useScrollLock';

// CV viewer. The PDF is the existing /Resume.pdf (unchanged); some mobile browsers only preview the first
// page of an embedded PDF, so an "Open in new tab" link is always offered next to Download.
export default function OpenCv({ isOpen, onClose }) {
  const dialogRef = useRef(null);
  useScrollLock(isOpen);
  useFocusTrap(dialogRef, isOpen, onClose);

  if (!isOpen) return null;

  const { path, downloadName } = profile.cv;
  const actionCls =
    'inline-flex min-h-9 pointer-coarse:min-h-11 items-center gap-2 border border-line-strong px-4 text-small text-fg transition-colors duration-200 hover:border-fg focus-visible:border-fg';

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-3 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-title"
        tabIndex={-1}
        className="flex h-[88vh] w-full max-w-4xl flex-col border border-line-strong bg-ink-850 outline-none"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-3 sm:p-4">
          <h2 id="cv-title" className="text-heading text-fg">
            Curriculum Vitae
          </h2>
          <div className="flex items-center gap-2">
            <a href={path} download={downloadName} className={actionCls}>
              <Download size={16} aria-hidden="true" />
              Download
            </a>
            <a href={path} target="_blank" rel="noopener noreferrer" className={`${actionCls} hidden sm:inline-flex`}>
              Open in new tab
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close CV preview"
              className="inline-flex h-9 w-9 pointer-coarse:h-11 pointer-coarse:w-11 items-center justify-center text-fg-muted transition-colors hover:text-fg"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
        <iframe title="Jeremiah Pantaras CV" src={`${path}#view=Fit`} className="w-full flex-1 border-0 bg-ink-900" />
      </div>
    </div>,
    document.body,
  );
}
