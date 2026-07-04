'use client';

import { extractRows, renderValue, formatNumber } from './reportHelpers';

/* ── Currency formatter (BDT) ── */
export const fmtCurrency = (v) => {
    const n = Number(v);
    if (Number.isNaN(n)) return '—';
    return `৳${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/* ── SVG icon library (small, inline) ── */
export const ICONS = {
    invoice: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
    ),
    money: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
    ),
    check: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    clock: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    tag: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
    ),
    receipt: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
        </svg>
    ),
    cart: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
    ),
    users: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
    ),
    truck: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.143-.504 1.143-1.125v-5.24a2.25 2.25 0 00-.659-1.591L18.4 7.56a2.25 2.25 0 00-1.591-.659H15M2.25 14.25V6.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v8.25m-2.25 0h2.25m0 0h2.735" />
        </svg>
    ),
    box: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
    ),
    chart: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
    ),
    arrowUp: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
    ),
    arrowDown: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
        </svg>
    ),
    wallet: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 110-6h5.25A2.25 2.25 0 0121 6v6zm0 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6m-7.5 6h.008v.008H13.5V12z" />
        </svg>
    ),
    expense: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    ledger: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
    ),
    percent: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
        </svg>
    ),
};

/* ── Color tone presets ── */
export const TONES = {
    blue:    { border: 'border-blue-200 bg-blue-50/60 dark:border-blue-800/50 dark:bg-blue-950/40',       icon: 'text-blue-600 dark:text-blue-400',       value: 'text-blue-700 dark:text-blue-300' },
    emerald: { border: 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-800/50 dark:bg-emerald-950/40', icon: 'text-emerald-600 dark:text-emerald-400', value: 'text-emerald-700 dark:text-emerald-300' },
    violet:  { border: 'border-violet-200 bg-violet-50/60 dark:border-violet-800/50 dark:bg-violet-950/40',   icon: 'text-violet-600 dark:text-violet-400',   value: 'text-violet-700 dark:text-violet-300' },
    rose:    { border: 'border-rose-200 bg-rose-50/60 dark:border-rose-800/50 dark:bg-rose-950/40',       icon: 'text-rose-600 dark:text-rose-400',       value: 'text-rose-700 dark:text-rose-300' },
    amber:   { border: 'border-amber-200 bg-amber-50/60 dark:border-amber-800/50 dark:bg-amber-950/40',     icon: 'text-amber-600 dark:text-amber-400',     value: 'text-amber-700 dark:text-amber-300' },
    cyan:    { border: 'border-cyan-200 bg-cyan-50/60 dark:border-cyan-800/50 dark:bg-cyan-950/40',       icon: 'text-cyan-600 dark:text-cyan-400',       value: 'text-cyan-700 dark:text-cyan-300' },
    indigo:  { border: 'border-indigo-200 bg-indigo-50/60 dark:border-indigo-800/50 dark:bg-indigo-950/40',   icon: 'text-indigo-600 dark:text-indigo-400',   value: 'text-indigo-700 dark:text-indigo-300' },
    orange:  { border: 'border-orange-200 bg-orange-50/60 dark:border-orange-800/50 dark:bg-orange-950/40',   icon: 'text-orange-600 dark:text-orange-400',   value: 'text-orange-700 dark:text-orange-300' },
    teal:    { border: 'border-teal-200 bg-teal-50/60 dark:border-teal-800/50 dark:bg-teal-950/40',       icon: 'text-teal-600 dark:text-teal-400',       value: 'text-teal-700 dark:text-teal-300' },
    sky:     { border: 'border-sky-200 bg-sky-50/60 dark:border-sky-800/50 dark:bg-sky-950/40',         icon: 'text-sky-600 dark:text-sky-400',         value: 'text-sky-700 dark:text-sky-300' },
    slate:   { border: 'border-slate-200 bg-slate-50/60 dark:border-slate-800/50 dark:bg-slate-950/40',     icon: 'text-slate-600 dark:text-slate-400',     value: 'text-slate-700 dark:text-slate-300' },
};

/* Total-row accent classes by report accent color */
const TOTAL_ROW_TONES = {
    emerald: 'bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
    indigo:  'bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400',
    blue:    'bg-blue-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
    violet:  'bg-violet-50/60 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400',
    rose:    'bg-rose-50/60 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400',
    amber:   'bg-amber-50/60 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
    cyan:    'bg-cyan-50/60 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400',
    orange:  'bg-orange-50/60 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400',
    teal:    'bg-teal-50/60 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400',
    sky:     'bg-sky-50/60 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400',
    slate:   'bg-slate-50/60 dark:bg-slate-950/30 text-slate-700 dark:text-slate-400',
};

/**
 * Resolve a metric value from either the API summary object or by computing from rows.
 */
function resolveMetric(summary, rows, metricKey, fallbackFields) {
    if (summary && summary[metricKey] !== undefined) return summary[metricKey];

    /* Special: count */
    if (fallbackFields === '__count__') return rows.length;

    if (!Array.isArray(fallbackFields) || !fallbackFields.length) return 0;

    let sum = 0;
    for (const row of rows) {
        for (const f of fallbackFields) {
            if (row[f] !== undefined && row[f] !== null) {
                sum += Number(row[f]) || 0;
                break;
            }
        }
    }
    return sum;
}

/**
 * StandardReportTemplate
 *
 * @param {object}   props
 * @param {object}   props.reportData       - Raw API response
 * @param {Array}    props.metrics          - Metric card definitions: { key, label, icon, tone, fallbackFields?, format? }
 * @param {Array}    props.columns          - Table column definitions: { key, label, align?, isCurrency?, isDue? }
 * @param {string}   [props.accent='emerald'] - Accent color name for the totals row
 * @param {string}   [props.tableTitle='Details'] - Title shown above the table
 * @param {string}   [props.emptyMessage]   - Message when no rows found
 */
export default function StandardReportTemplate({
    reportData,
    metrics = [],
    columns = [],
    accent = 'emerald',
    tableTitle = 'Details',
    emptyMessage = 'No data found for the selected filters.',
}) {
    const rows = extractRows(reportData);
    const summary = reportData?.summary || reportData?.footer || {};

    /* Detect which configured columns actually exist in the data */
    const visibleColumns = columns.filter(
        (col) => rows.some((r) => r[col.key] !== undefined && r[col.key] !== null)
    );

    /* Fallback: show all keys from the first row if no configured columns match */
    const finalColumns = visibleColumns.length
        ? visibleColumns
        : rows.length
            ? Object.keys(rows[0]).map((k) => ({
                key: k,
                label: k.replace(/_/g, ' '),
                align: 'left',
                isCurrency: false,
                isDue: false,
            }))
            : [];

    /* Compute totals for currency columns */
    const colTotals = {};
    finalColumns.forEach((col) => {
        if (!col.isCurrency) return;
        let sum = 0;
        for (const row of rows) {
            sum += Number(row[col.key]) || 0;
        }
        colTotals[col.key] = sum;
    });

    const totalRowTone = TOTAL_ROW_TONES[accent] || TOTAL_ROW_TONES.emerald;

    return (
        <div className="space-y-6">
            {/* ── Metric cards ── */}
            {metrics.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {metrics.map((card) => {
                        const tone = typeof card.tone === 'string' ? TONES[card.tone] : card.tone;
                        const value = resolveMetric(summary, rows, card.key, card.fallbackFields);
                        const formatted = card.format === 'currency'
                            ? fmtCurrency(value)
                            : card.format === 'number'
                                ? formatNumber(value)
                                : typeof card.format === 'function'
                                    ? card.format(value)
                                    : fmtCurrency(value);

                        return (
                            <div
                                key={card.key}
                                className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-shadow hover:shadow-md ${tone?.border || ''}`}
                            >
                                <div className={`mt-0.5 shrink-0 ${tone?.icon || ''}`}>{card.icon}</div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                        {card.label}
                                    </p>
                                    <p className={`mt-1 text-xl font-bold tabular-nums tracking-tight ${tone?.value || ''}`}>
                                        {formatted}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Data table ── */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center justify-between bg-slate-50 px-5 py-3 dark:bg-slate-800/60">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        {tableTitle}
                    </p>
                    <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {rows.length} {rows.length === 1 ? 'record' : 'records'}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/60">
                                <th className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                    #
                                </th>
                                {finalColumns.map((col) => (
                                    <th
                                        key={col.key}
                                        className={`border-b border-slate-200 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:border-slate-700 dark:text-slate-400 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length ? (
                                rows.map((row, i) => (
                                    <tr
                                        key={row?.id ?? i}
                                        className="border-b border-slate-100 last:border-0 odd:bg-white even:bg-slate-50/50 dark:border-slate-800 dark:odd:bg-slate-950 dark:even:bg-slate-900/40"
                                    >
                                        <td className="px-4 py-3 text-xs tabular-nums text-slate-400 dark:text-slate-500">
                                            {i + 1}
                                        </td>
                                        {finalColumns.map((col) => (
                                            <td
                                                key={col.key}
                                                className={`px-4 py-3 text-xs text-slate-700 dark:text-slate-200 ${col.align === 'right' ? 'text-right tabular-nums' : 'text-left'} ${col.isDue && Number(row[col.key]) > 0 ? 'text-rose-600 font-semibold dark:text-rose-400' : ''}`}
                                            >
                                                {col.isCurrency ? fmtCurrency(row[col.key]) : renderValue(row[col.key])}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={finalColumns.length + 1}
                                        className="px-4 py-12 text-center text-sm text-slate-400 dark:text-slate-500"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            )}

                            {/* Totals row */}
                            {rows.length > 0 && Object.keys(colTotals).length > 0 && (
                                <tr className={`border-t-2 border-slate-200 dark:border-slate-700 ${totalRowTone}`}>
                                    <td className="px-4 py-3 text-xs font-bold uppercase tracking-wider">
                                        Total
                                    </td>
                                    {finalColumns.map((col) => (
                                        <td
                                            key={`total-${col.key}`}
                                            className={`px-4 py-3 text-xs font-bold tabular-nums ${col.align === 'right' ? 'text-right' : 'text-left'} ${col.isDue ? 'text-rose-600 dark:text-rose-400' : ''}`}
                                        >
                                            {colTotals[col.key] !== undefined ? fmtCurrency(colTotals[col.key]) : ''}
                                        </td>
                                    ))}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
