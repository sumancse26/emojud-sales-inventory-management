'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Compact searchable select — drop-in replacement for <select> in form sliders.
 *
 * Props
 *   options      {value, label}[]   — list of choices
 *   value        string             — currently selected value (controlled)
 *   onChange     (value) => void    — called with the new string value
 *   placeholder  string             — shown when nothing is selected
 *   id           string             — forwarded to the trigger button (for label htmlFor)
 *   disabled     bool
 *   accent       'emerald'|'amber'  — focus ring colour (default 'emerald')
 */
export default function SelectInput({
    options = [],
    value = '',
    onChange,
    placeholder = 'Select…',
    id,
    disabled = false,
    accent = 'emerald',
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [dropdownStyle, setDropdownStyle] = useState({});
    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    const ringCls = accent === 'amber'
        ? 'ring-2 ring-amber-500/30 border-amber-400 dark:border-amber-500'
        : 'ring-2 ring-emerald-500/30 border-emerald-400 dark:border-emerald-500';

    const selectedLabel = useMemo(
        () => options.find(o => String(o.value) === String(value))?.label ?? null,
        [options, value]
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter(o => String(o.label).toLowerCase().includes(q));
    }, [options, query]);

    /* close on outside click — check both the trigger wrapper and the portalled dropdown */
    useEffect(() => {
        if (!open) return;
        const handle = (e) => {
            if (
                !rootRef.current?.contains(e.target) &&
                !dropdownRef.current?.contains(e.target)
            ) {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, [open]);

    /* position dropdown using fixed coords when opened */
    useEffect(() => {
        if (!open || !triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropHeight = 240; // max height of dropdown
        if (spaceBelow >= dropHeight || spaceBelow >= 120) {
            setDropdownStyle({ top: rect.bottom + 4, left: rect.left, width: rect.width });
        } else {
            setDropdownStyle({ bottom: window.innerHeight - rect.top + 4, left: rect.left, width: rect.width });
        }
        searchRef.current?.focus();
    }, [open]);

    /* ESC to close */
    useEffect(() => {
        if (!open) return;
        const handle = (e) => { if (e.key === 'Escape') { setOpen(false); setQuery(''); } };
        document.addEventListener('keydown', handle);
        return () => document.removeEventListener('keydown', handle);
    }, [open]);

    const handleSelect = (opt) => {
        onChange?.(String(opt.value));
        setOpen(false);
        setQuery('');
    };

    return (
        <div ref={rootRef} className="relative">
            {/* Trigger */}
            <button
                ref={triggerRef}
                id={id}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen(v => !v)}
                className={[
                    'w-full flex items-center justify-between',
                    'bg-slate-50 dark:bg-slate-800/60',
                    'border border-slate-200 dark:border-slate-700/50',
                    'rounded-xl px-4 py-2.5 text-sm',
                    'focus:outline-none transition-all',
                    open ? ringCls : 'hover:border-slate-300 dark:hover:border-slate-600',
                    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                ].join(' ')}
            >
                <span
                    title={selectedLabel ?? undefined}
                    className={`truncate min-w-0 mr-2 ${selectedLabel ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}
                >
                    {selectedLabel ?? placeholder}
                </span>
                <svg
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {/* Dropdown — portalled into document.body to escape transform/overflow ancestors */}
            {open && createPortal(
                <div
                    ref={dropdownRef}
                    style={dropdownStyle}
                    className="fixed z-9999 bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-700/60 rounded-xl shadow-xl shadow-slate-200/60 dark:shadow-slate-950/60 overflow-hidden"
                >

                    {/* Search bar */}
                    <div className="p-2 border-b border-slate-100 dark:border-slate-800/60">
                        <div className="relative">
                            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                ref={searchRef}
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search…"
                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 rounded-lg text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 transition-all"
                            />
                        </div>
                    </div>

                    {/* Option list */}
                    <div className="max-h-48 overflow-y-auto py-1">
                        {filtered.length > 0 ? (
                            filtered.map(opt => {
                                const isSelected = String(opt.value) === String(value);
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        title={opt.label}
                                        onClick={() => handleSelect(opt)}
                                        className={[
                                            'w-full text-left px-4 py-2 text-sm transition-colors',
                                            isSelected
                                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60',
                                        ].join(' ')}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })
                        ) : (
                            <p className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 italic text-center">
                                No options found
                            </p>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
