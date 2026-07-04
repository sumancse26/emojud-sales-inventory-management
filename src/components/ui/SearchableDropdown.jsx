'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

function normalizeOption(option) {
    if (typeof option === 'string' || typeof option === 'number') {
        return {
            label: String(option),
            value: String(option)
        };
    }

    return {
        label: option?.label ?? String(option?.value ?? ''),
        value: String(option?.value ?? ''),
        keywords: Array.isArray(option?.keywords) ? option.keywords : [],
        disabled: Boolean(option?.disabled)
    };
}

export default function Searchable({
    label = 'Quick Filter',
    options = [],
    value = '',
    onChange,
    valueKey = 'value',
    labelKey = 'label',
    descriptionKey = '',
    searchKeys = [],
    placeholder = 'Select an option',
    searchPlaceholder = 'Search option...',
    emptyText = 'No options found',
    className = '',
    contentClassName = 'px-3 pt-2'
}) {
    const rootRef = useRef(null);
    const searchRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const normalizedOptions = useMemo(() => {
        return options.map((option) => {
            if (typeof option === 'string' || typeof option === 'number') {
                return normalizeOption(option);
            }

            const resolvedLabel = option?.[labelKey] ?? option?.label ?? option?.name ?? option?.title ?? option?.[valueKey];
            const resolvedValue = option?.[valueKey] ?? option?.value ?? resolvedLabel;
            const resolvedDescription = descriptionKey ? option?.[descriptionKey] : option?.description;
            const resolvedKeywords = [
                resolvedLabel,
                resolvedValue,
                resolvedDescription,
                ...searchKeys.map((key) => option?.[key])
            ].filter(Boolean);

            return {
                label: String(resolvedLabel ?? ''),
                value: String(resolvedValue ?? ''),
                description: resolvedDescription ? String(resolvedDescription) : '',
                keywords: Array.from(new Set(resolvedKeywords.map((item) => String(item)))),
                disabled: Boolean(option?.disabled),
                raw: option
            };
        });
    }, [descriptionKey, labelKey, options, searchKeys, valueKey]);

    const selectedOption = useMemo(
        () => normalizedOptions.find((option) => option.value === String(value)) ?? null,
        [normalizedOptions, value]
    );

    const filteredOptions = useMemo(() => {
        const search = query.trim().toLowerCase();

        if (!search) {
            return normalizedOptions;
        }

        return normalizedOptions.filter((option) => {
            const searchableText = [option.label, ...option.keywords].join(' ').toLowerCase();
            return searchableText.includes(search);
        });
    }, [normalizedOptions, query]);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const handleOutsideClick = (event) => {
            if (!rootRef.current?.contains(event.target)) {
                setOpen(false);
                setQuery('');
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [open]);

    useEffect(() => {
        if (open) {
            searchRef.current?.focus();
        }
    }, [open]);

    const handleSelect = (option) => {
        if (option.disabled) {
            return;
        }

        onChange?.(option.value, option.raw ?? option);
        setOpen(false);
        setQuery('');
    };

    return (
        <div ref={rootRef} className={`${contentClassName} ${className}`.trim()}>
            <label className="block">
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    {label}
                </span>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setOpen((current) => !current)}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 pr-10 text-left shadow-sm outline-none transition-all duration-200 ${
                            open
                                ? 'border-blue-500/70 bg-white ring-2 ring-blue-500/15 dark:border-blue-500/60 dark:bg-slate-950'
                                : 'border-slate-200/80 bg-white/90 hover:border-slate-300 dark:border-slate-700/70 dark:bg-slate-900/80 dark:hover:border-slate-600'
                        }`}>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M7 12h10M10 17h4" />
                            </svg>
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className={`block truncate text-xs font-semibold ${selectedOption ? 'text-slate-700 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                                {selectedOption?.label ?? placeholder}
                            </span>
                            <span className="mt-0.5 block truncate text-[10px] text-slate-400 dark:text-slate-500">
                                {selectedOption ? 'Selection ready' : 'Search and choose one option'}
                            </span>
                        </span>
                    </button>

                    <span
                        className={`pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 transition-transform duration-200 dark:text-slate-500 ${open ? 'rotate-180' : ''}`}>
                        <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m5 7 5 5 5-5" />
                        </svg>
                    </span>

                    {open && (
                        <div className="absolute left-0 right-0 top-[calc(100%+0.45rem)] z-50 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.28)] dark:border-slate-800/70 dark:bg-slate-950">
                            <div className="border-b border-slate-200/70 bg-slate-50/80 p-2.5 dark:border-slate-800/70 dark:bg-slate-900/60">
                                <div className="relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-slate-500">
                                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
                                            <circle cx="11" cy="11" r="6" />
                                        </svg>
                                    </span>
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder={searchPlaceholder}
                                        className="w-full rounded-2xl border border-slate-200/80 bg-white px-9 py-2.5 text-xs text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/70 dark:bg-slate-900/80 dark:text-slate-200 dark:placeholder:text-slate-500"
                                    />
                                </div>
                            </div>

                            <div className="border-b border-slate-100/80 px-3 py-2 dark:border-slate-800/60">
                                <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                                    <span>Available options</span>
                                    <span>{filteredOptions.length}</span>
                                </div>
                            </div>

                            <div className="max-h-64 overflow-y-auto p-2">
                                {filteredOptions.length ? (
                                    filteredOptions.map((option) => {
                                        const isSelected = option.value === String(value);

                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                disabled={option.disabled}
                                                onClick={() => handleSelect(option)}
                                                className={`group flex w-full items-center justify-between rounded-2xl border px-3.5 py-3 text-left transition-all duration-150 ${
                                                    option.disabled
                                                        ? 'cursor-not-allowed border-transparent opacity-50'
                                                        : isSelected
                                                            ? 'border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm shadow-blue-100/70 dark:border-blue-500/20 dark:from-blue-500/10 dark:to-indigo-500/10 dark:text-blue-300 dark:shadow-none'
                                                            : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50/90 hover:shadow-sm dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900/80'
                                                }`}>
                                                <span className="flex min-w-0 items-center gap-3">
                                                    <span
                                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold ${
                                                            isSelected
                                                                ? 'bg-blue-600 text-white dark:bg-blue-500/20 dark:text-blue-300'
                                                                : 'bg-slate-100 text-slate-500 group-hover:bg-white dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-800/80'
                                                        }`}>
                                                        {option.label.charAt(0).toUpperCase()}
                                                    </span>
                                                    <span className="min-w-0">
                                                        <span className="block truncate text-xs font-semibold">{option.label}</span>
                                                        <span
                                                            className={`mt-0.5 block truncate text-[10px] ${
                                                                isSelected
                                                                    ? 'text-blue-500 dark:text-blue-400'
                                                                    : 'text-slate-400 dark:text-slate-500'
                                                            }`}>
                                                            {option.description || (isSelected ? 'Currently selected' : 'Click to apply this option')}
                                                        </span>
                                                    </span>
                                                </span>
                                                <span className="ml-3 shrink-0">
                                                    {isSelected ? (
                                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-500/20 dark:text-blue-300">
                                                            <svg
                                                                className="h-3.5 w-3.5"
                                                                viewBox="0 0 20 20"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m5 10 3 3 7-7" />
                                                            </svg>
                                                        </span>
                                                    ) : (
                                                        <svg
                                                            className="h-4 w-4 text-slate-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-500"
                                                            viewBox="0 0 20 20"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.8">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 5l5 5-5 5" />
                                                        </svg>
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="px-4 py-10 text-center">
                                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500">
                                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="11" cy="11" r="7" />
                                                <path strokeLinecap="round" d="m20 20-3.5-3.5" />
                                            </svg>
                                        </div>
                                        <p className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-300">{emptyText}</p>
                                        <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">Try a different keyword</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </label>
        </div>
    );
}
