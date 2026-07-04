'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { reportTemplates } from '../_report-templates';
import { extractFooter, extractRows, renderValue } from '../_report-templates/reportHelpers';
import SelectInput from '@/components/ui/SelectInput';

function getDefaultFromDate() {
    return new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10);
}

function getDefaultToDate() {
    return new Date().toISOString().slice(0, 10);
}

function toSentenceCase(value) {
    return String(value || '')
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function formatDateLabel(value) {
    if (!value) return 'N/A';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatMetricValue(key, value) {
    if (value === null || value === undefined || value === '') return 'N/A';

    const keyText = String(key || '').toLowerCase();
    const numericValue = Number(value);
    const isNumeric = !Number.isNaN(numericValue);
    const isMoneyLike = /(amount|sales|paid|due|total|profit|cost|price|balance|vat|discount)/.test(keyText);

    if (isNumeric && isMoneyLike) {
        return `\u09f3${numericValue.toLocaleString()}`;
    }

    if (isNumeric) {
        return numericValue.toLocaleString();
    }

    return String(value);
}

function getSummaryEntries(reportData) {
    const summary = reportData?.summary && typeof reportData.summary === 'object' ? reportData.summary : null;
    const footer = extractFooter(reportData);
    const source = summary && Object.keys(summary).length ? summary : footer;
    if (!source || typeof source !== 'object') return [];
    return Object.entries(source).filter(([key]) => key !== 'title');
}

function getInfoEntries(reportData) {
    if (!reportData || typeof reportData !== 'object' || Array.isArray(reportData)) return [];
    const ignored = new Set([
        'rows',
        'items',
        'data',
        'list',
        'results',
        'entries',
        'summary',
        'footer',
        'totals',
        'summary_footer',
        'footer_data'
    ]);

    return Object.entries(reportData).filter(([key]) => !ignored.has(key));
}

function buildCsvContent(rows) {
    if (!rows.length) return '';
    const columns = Object.keys(rows[0]);
    const escapeValue = (value) => {
        const raw = value === null || value === undefined ? '' : String(value);
        if (/[",\n]/.test(raw)) {
            return `"${raw.replace(/"/g, '""')}"`;
        }
        return raw;
    };

    const header = columns.map(escapeValue).join(',');
    const lines = rows.map((row) => columns.map((column) => escapeValue(row?.[column])).join(','));
    return [header, ...lines].join('\n');
}

function getShopDetails(reportData, userInfo = {}, shopList = []) {
    const selectedShop = shopList.find((shop) => String(shop.shop_id) === String(userInfo?.shop_id));
    const shopName =
        reportData?.shop_name ||
        reportData?.shop?.shop_name ||
        reportData?.shop?.name ||
        selectedShop?.shop_name ||
        reportData?.branch_name ||
        'Shop';

    const addressParts = [
        reportData?.shop_address,
        reportData?.address,
        reportData?.address_2,
        reportData?.shop?.shop_address,
        reportData?.shop?.address,
        selectedShop?.shop_address,
        selectedShop?.address,
        selectedShop?.address_2
    ].filter(Boolean);

    return {
        companyName: userInfo?.company_name || reportData?.company_name || 'emojud',
        shopName,
        address: addressParts.join(', ') || 'Address not available'
    };
}

export default function ReportDetailClient({ reportKey, config, userInfo = {}, shopList = [], productList = [] }) {
    const [fromDate, setFromDate] = useState(config.filters.dateRange ? getDefaultFromDate() : '');
    const [toDate, setToDate] = useState(config.filters.dateRange ? getDefaultToDate() : '');
    const [productId, setProductId] = useState('');
    const hasDateFilters = config.filters?.dateRange;
    const hasProductFilter = config.filters?.product;
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(() =>
        hasDateFilters || hasProductFilter
            ? 'Fill the filter fields and click View to load this report.'
            : 'Click View to load this report.'
    );

    const ReportRenderer = reportTemplates[reportKey] || reportTemplates.default;
    const hasCustomTemplate = reportKey in reportTemplates;

    const filterSummary = useMemo(() => {
        const items = [];
        if (hasDateFilters) {
            items.push(`Period: ${formatDateLabel(fromDate)} - ${formatDateLabel(toDate)}`);
        }
        if (hasProductFilter) {
            items.push(`Product: ${productId?.trim() || 'All products'}`);
        }
        if (!items.length) {
            items.push('No additional filters');
        }
        return items;
    }, [fromDate, toDate, productId, hasDateFilters, hasProductFilter]);

    const shopMeta = useMemo(
        () => getShopDetails(reportData, userInfo, shopList),
        [reportData, shopList, userInfo]
    );

    const printDateTime = useMemo(
        () =>
            new Date().toLocaleString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
        []
    );

    const rows = useMemo(() => extractRows(reportData), [reportData]);
    const summaryEntries = useMemo(() => getSummaryEntries(reportData), [reportData]);
    const infoEntries = useMemo(() => getInfoEntries(reportData), [reportData]);

    const tableColumns = useMemo(() => {
        if (!rows.length) return [];
        return Object.keys(rows[0]);
    }, [rows]);

    const tableTotals = useMemo(() => {
        if (!rows.length || !tableColumns.length) return {};

        const totals = {};
        tableColumns.forEach((column) => {
            let sum = 0;
            let isNumericColumn = true;
            for (const row of rows) {
                const value = row?.[column];
                if (value === null || value === undefined || value === '') continue;
                const num = Number(value);
                if (Number.isNaN(num)) {
                    isNumericColumn = false;
                    break;
                }
                sum += num;
            }
            if (isNumericColumn) totals[column] = sum;
        });

        return totals;
    }, [rows, tableColumns]);

    const queryString = useMemo(() => {
        const search = new URLSearchParams();
        if (fromDate) search.set('from_date', fromDate);
        if (toDate) search.set('to_date', toDate);
        if (productId.trim()) search.set('product_id', productId.trim());
        return search.toString();
    }, [fromDate, toDate, productId]);

    const handleFetch = async () => {
        setError('');
        setIsLoading(true);
        setMessage('Loading report...');

        try {
            const endpoint = queryString ? `${config.endpoint}?${queryString}` : config.endpoint;
            const response = await fetch(endpoint, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }
            const data = await response.json();
            setReportData(data);
            setMessage('Report loaded successfully.');
        } catch (fetchError) {
            setError(fetchError instanceof Error ? fetchError.message : 'Failed to load report.');
            setReportData(null);
            setMessage('There was an error fetching the report.');
        } finally {
            setIsLoading(false);
        }
    };

    const printReport = () => {
        if (!reportData) return;
        window.print();
    };

    const exportCsv = () => {
        if (!rows.length) return;
        const content = buildCsvContent(rows);
        if (!content) return;
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${config?.key || 'report'}-${new Date().toISOString().slice(0, 10)}.csv`;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    const btnBaseClass =
        'inline-flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition duration-200';
    const btnSecondaryClass =
        `${btnBaseClass} border border-slate-300 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800`;
    const btnPrimaryClass =
        `${btnBaseClass} border border-emerald-700 bg-linear-to-r from-emerald-700 to-emerald-600 text-white shadow-sm hover:-translate-y-0.5 hover:from-emerald-600 hover:to-emerald-500 dark:border-emerald-600 dark:from-emerald-600 dark:to-emerald-500`;

    return (
        <div className="print-root">
            <div className="space-y-6 screen-only">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-linear-to-br from-white via-slate-50 to-sky-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 print-hide">
                    <div className="pointer-events-none absolute -top-16 right-6 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-700/20" />
                    <div className="pointer-events-none absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-cyan-200/50 blur-3xl dark:bg-cyan-700/20" />
                    <div className="relative flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="space-y-3">
                            <p className="inline-flex w-fit items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
                                Report workspace
                            </p>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{config.title}</h1>
                            <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{config.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/feature/reports"
                                className={btnSecondaryClass}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to reports
                            </Link>


                            <button
                                type="button"
                                onClick={handleFetch}
                                className={btnPrimaryClass}
                            >
                                {isLoading ? 'Loading...' : 'View report'}
                            </button>
                            <button
                                type="button"
                                onClick={printReport}
                                disabled={!reportData}
                                className={`${btnPrimaryClass} disabled:cursor-not-allowed disabled:opacity-50`}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V4h12v5M6 14H4v6h16v-6h-2M8 18h8" />
                                </svg>
                                Print
                            </button>
                            <button
                                type="button"
                                onClick={exportCsv}
                                disabled={!rows.length}
                                className={`${btnSecondaryClass} disabled:cursor-not-allowed disabled:opacity-50`}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v10m0 0l4-4m-4 4l-4-4M4 20h16" />
                                </svg>
                                Export
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {hasDateFilters && (
                            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">From date</label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(event) => setFromDate(event.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                />
                            </div>
                        )}

                        {hasDateFilters && (
                            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">To date</label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(event) => setToDate(event.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                />
                            </div>
                        )}

                        {hasProductFilter && (
                            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Product</label>
                                <SelectInput
                                    options={productList.map(product => ({
                                        value: product.id,
                                        label: product.product_name,
                                    }))}
                                    value={productId}
                                    onChange={(value) => setProductId(value)}
                                    placeholder="Select product…"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 print-surface">
                    {hasCustomTemplate && reportData ? (
                        <ReportRenderer reportData={reportData} />
                    ) : (
                        <>
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Report Summary</p>
                            </div>

                            {summaryEntries.length ? (
                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                    {summaryEntries.map(([key, value], index) => {
                                        const tones = [
                                            'border-emerald-200 bg-emerald-50/50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300',
                                            'border-blue-200 bg-blue-50/50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-300',
                                            'border-orange-200 bg-orange-50/50 text-orange-700 dark:border-orange-800/60 dark:bg-orange-950/40 dark:text-orange-300',
                                            'border-violet-200 bg-violet-50/50 text-violet-700 dark:border-violet-800/60 dark:bg-violet-950/40 dark:text-violet-300'
                                        ];
                                        return (
                                            <div key={key} className={`rounded-2xl border p-4 ${tones[index % tones.length]}`}>
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">{toSentenceCase(key)}</p>
                                                <p className="mt-2 text-3xl font-bold tracking-tight">{formatMetricValue(key, value)}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                                    Summary metrics are not available for this report.
                                </div>
                            )}

                            <div className="mt-6 rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Details</p>
                                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                                    <table className="min-w-full border-collapse text-sm">
                                        <thead className="bg-slate-100 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                                            <tr>
                                                {tableColumns.map((column) => (
                                                    <th key={column} className="border-b border-slate-200 px-3 py-3 dark:border-slate-700">
                                                        {toSentenceCase(column)}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-slate-950">
                                            {rows.length ? (
                                                rows.map((row, index) => (
                                                    <tr key={row?.id ?? index} className="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-950 dark:even:bg-slate-900/60">
                                                        {tableColumns.map((column) => (
                                                            <td key={`${index}-${column}`} className="border-b border-slate-200 px-3 py-3 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-200">
                                                                {renderValue(row?.[column])}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={Math.max(1, tableColumns.length)} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                                        No tabular data available for the selected filters.
                                                    </td>
                                                </tr>
                                            )}

                                            {Object.keys(tableTotals).length ? (
                                                <tr className="bg-emerald-50/50 dark:bg-emerald-950/30">
                                                    {tableColumns.map((column, index) => (
                                                        <td key={`total-${column}`} className="border-t border-slate-200 px-3 py-3 text-xs font-semibold text-emerald-700 dark:border-slate-700 dark:text-emerald-300">
                                                            {index === 0 ? 'TOTAL' : tableTotals[column] !== undefined ? formatMetricValue(column, tableTotals[column]) : '-'}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ) : null}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {!rows.length && !summaryEntries.length && reportData ? (
                                <div className="mt-6 rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
                                    <ReportRenderer reportData={reportData} />
                                </div>
                            ) : null}
                        </>
                    )}
                </div>
            </div>

            <div className="print-only">
                <div className="print-document">
                    <div className="print-head">
                        <div className="print-brand">
                            <div className="print-logo">{(shopMeta.companyName || 'E').charAt(0).toUpperCase()}</div>
                            <div>
                                <p className="print-company">{shopMeta.companyName}</p>
                                <p className="print-shop">{shopMeta.shopName}</p>
                                <p className="print-address">{shopMeta.address}</p>
                                <p className="print-contact">Phone: N/A | Email: N/A</p>
                            </div>
                        </div>

                        <div className="print-title-wrap">
                            <p className="print-title">{toSentenceCase(config.title)} Report</p>
                            <p>Report Generated On : {printDateTime}</p>
                            <p>{filterSummary.join(' | ')}</p>
                        </div>
                    </div>



                    <div className="print-section">
                        <p className="print-section-title"> Details</p>
                        <table className="print-table">
                            <thead>
                                <tr>
                                    {tableColumns.map((column) => (
                                        <th key={`print-${column}`}>{toSentenceCase(column)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length ? (
                                    rows.map((row, idx) => (
                                        <tr key={`print-row-${idx}`}>
                                            {tableColumns.map((column) => (
                                                <td key={`print-cell-${idx}-${column}`}>{renderValue(row?.[column])}</td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={Math.max(1, tableColumns.length)}>No table data available.</td>
                                    </tr>
                                )}
                                {Object.keys(tableTotals).length ? (
                                    <tr>
                                        {tableColumns.map((column, index) => (
                                            <td key={`print-total-${column}`}>{index === 0 ? 'TOTAL' : tableTotals[column] !== undefined ? formatMetricValue(column, tableTotals[column]) : '-'}</td>
                                        ))}
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>

                    <div className="print-section">
                        <p className="print-section-title">Summary</p>
                        <table className="print-table two-col">
                            <tbody>
                                {summaryEntries.length ? (
                                    summaryEntries.map(([key, value]) => (
                                        <tr key={`print-summary-${key}`}>
                                            <td>{toSentenceCase(key)}</td>
                                            <td>{formatMetricValue(key, value)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2}>No summary data available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="print-foot">
                        <span>This is a system generated report and does not require any signature.</span>
                        <span>Generated by {userInfo?.full_name || 'System'}</span>

                    </div>
                </div>
            </div>

            <style jsx global>{`
                .print-only {
                    display: none;
                }

                .print-document {
                    background: #ffffff;
                    color: #111827;
                    border: 1px solid #d1d5db;
                    padding: 24px;
                    font-family: 'Segoe UI', sans-serif;
                }

                .print-head {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                    border-bottom: 2px solid #d1d5db;
                    padding-bottom: 16px;
                }

                .print-brand {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                }

                .print-logo {
                    width: 56px;
                    height: 56px;
                    border-radius: 12px;
                    background: linear-gradient(145deg, #2563eb, #1d4ed8);
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: 700;
                }

                .print-company {
                    margin: 0;
                    font-size: 30px;
                    font-weight: 700;
                    line-height: 1.15;
                }

                .print-shop {
                    margin: 6px 0 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .print-address,
                .print-contact {
                    margin: 6px 0 0;
                    font-size: 13px;
                    color: #4b5563;
                }

                .print-title-wrap {
                    text-align: right;
                    font-size: 14px;
                    color: #1f2937;
                }

                .print-title {
                    margin: 0 0 10px;
                    font-size: 34px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.02em;
                    color: #111827;
                }

                .print-title-wrap p {
                    margin: 4px 0;
                }

                .print-section {
                    margin-top: 18px;
                }

                .print-section-title {
                    margin: 0 0 10px;
                    background: #f3f4f6;
                    border: 1px solid #e5e7eb;
                    padding: 8px 10px;
                    font-size: 14px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .print-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12px;
                }

                .print-table th,
                .print-table td {
                    border: 1px solid #d1d5db;
                    padding: 8px;
                    vertical-align: top;
                }

                .print-table thead th {
                    background: #f9fafb;
                    text-transform: uppercase;
                    font-size: 11px;
                    letter-spacing: 0.02em;
                }

                .print-table.two-col td:first-child {
                    width: 50%;
                    font-weight: 600;
                }

                .print-foot {
                    margin-top: 24px;
                    border-top: 2px solid #d1d5db;
                    padding-top: 10px;
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #374151;
                }

                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 8mm;
                    }

                    html,
                    body {
                        background: #ffffff !important;
                    }

                    body * {
                        visibility: hidden !important;
                    }

                    .print-root,
                    .print-root * {
                        visibility: visible !important;
                    }

                    .screen-only {
                        display: none !important;
                        visibility: hidden !important;
                    }

                    .print-only {
                        display: block !important;
                        visibility: visible !important;
                    }

                    .print-root {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    .print-hide {
                        display: none !important;
                        visibility: hidden !important;
                    }

                    .print-surface {
                        border: 0 !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                    }

                    .print-surface,
                    .print-surface * {
                        color: #0f172a !important;
                    }

                    .print-surface [class*='bg-slate-'],
                    .print-surface [class*='bg-white'],
                    .print-surface [class*='dark:bg-'] {
                        background: #ffffff !important;
                    }

                    .print-surface [class*='border-'] {
                        border-color: #cbd5e1 !important;
                    }

                    .print-surface table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                    }

                    .print-surface th,
                    .print-surface td {
                        font-size: 11px !important;
                        padding: 6px !important;
                    }

                    .print-surface pre {
                        white-space: normal !important;
                        overflow: visible !important;
                    }

                    .print-document {
                        border: 0 !important;
                        padding: 0 0 34px !important;
                    }

                    .print-company {
                        font-size: 26px !important;
                    }

                    .print-title {
                        font-size: 30px !important;
                    }

                    .print-foot {
                        position: fixed !important;
                        left: 8mm;
                        right: 8mm;
                        bottom: 8mm;
                        margin-top: 0 !important;
                        padding-top: 8px;
                        background: #ffffff;
                        z-index: 999;
                    }
                }
            `}</style>
        </div>
    );
}
