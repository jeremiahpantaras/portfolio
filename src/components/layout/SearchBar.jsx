import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { quickLinks, search } from '../../data/searchIndex';

// Top-bar search: a hairline field that widens on focus, with a results panel underneath (a combobox: arrow keys move,
// Enter opens, Esc closes). Press "/" anywhere to focus it. Empty, it offers the main pages as quick links.
export default function SearchBar({ className = '', autoFocus = false, onDone }) {
  const navigate = useNavigate();
  const id = useId();
  const root = useRef(null);
  const input = useRef(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = query.trim() ? search(query) : quickLinks;
  const listId = `${id}-list`;

  const close = () => {
    setOpen(false);
    setActive(0);
  };
  const go = (item) => {
    navigate(item.to);
    setQuery('');
    close();
    input.current?.blur();
    onDone?.();
  };

  useEffect(() => {
    if (autoFocus) input.current?.focus();
  }, [autoFocus]);

  // "/" focuses the search unless you are already typing somewhere.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      input.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Click outside closes the panel.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!root.current?.contains(e.target)) close();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter') {
      if (open && results[active]) {
        e.preventDefault();
        go(results[active]);
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.stopPropagation();
        close();
      } else {
        input.current?.blur();
      }
    }
  };

  return (
    <div ref={root} className={`relative ${className}`}>
      <div className="group flex h-9 items-center gap-2 rounded-md border border-line px-3 transition-[border-color,width,background-color] duration-300 focus-within:border-fg-muted focus-within:bg-white/[0.03] hover:border-line-strong pointer-coarse:h-11">
        <Search size={15} aria-hidden="true" className="shrink-0 text-fg-subtle transition-colors group-focus-within:text-fg" />
        <input
          ref={input}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && results[active] ? `${id}-${active}` : undefined}
          aria-autocomplete="list"
          aria-label="Search the site"
          placeholder="Search"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-small text-fg placeholder:text-fg-subtle focus:outline-none"
        />
        <kbd aria-hidden="true" className="hidden shrink-0 rounded-[4px] border border-line px-1.5 text-[0.6875rem] leading-4 text-fg-subtle group-focus-within:hidden md:block">
          /
        </kbd>
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-md border border-line-strong bg-ink-850/95 py-1.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md">
          {!query.trim() && <p className="eyebrow px-4 pb-1.5 pt-2 text-fg-subtle">Quick links</p>}
          {results.length ? (
            <ul id={listId} role="listbox" aria-label="Search results">
              {results.map((item, i) => (
                <li
                  key={`${item.type}-${item.title}`}
                  id={`${id}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => go(item)}
                  className={`flex cursor-pointer items-baseline justify-between gap-4 px-4 py-2 ${i === active ? 'bg-white/[0.06]' : ''}`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-small text-fg">{item.title}</span>
                    {item.hint && <span className="block truncate text-[0.75rem] text-fg-subtle">{item.hint}</span>}
                  </span>
                  <span className="eyebrow shrink-0 text-fg-subtle">{item.type}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p id={listId} role="status" className="px-4 py-3 text-small text-fg-muted">
              No results for “{query.trim()}”
            </p>
          )}
        </div>
      )}
    </div>
  );
}
