'use client';

import { extractRows, extractFooter, renderObjectDetails, renderSummaryCards, renderTable } from '../reportHelpers';

export default function DefaultReport({ reportData }) {
    const rows = extractRows(reportData);
    const summary = reportData?.summary || {};
    const footer = extractFooter(reportData);

    return (
        <div className="space-y-6">
            {summary && Object.keys(summary).length ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Report summary</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Summary values returned by the report API.</p>
                    <div className="mt-5">{renderSummaryCards(summary)}</div>
                </div>
            ) : null}

            {footer ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Footer summary</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Footer totals and totals information.</p>
                    <div className="mt-5">{renderSummaryCards(footer)}</div>
                </div>
            ) : null}

            {renderObjectDetails(reportData)}

            {rows.length ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Report data</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Table view of the data returned by the API.</p>
                    <div className="mt-5">{renderTable(rows)}</div>
                </div>
            ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Report output</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">The API returned a custom format that cannot be displayed as a table.</p>
                    <pre className="mt-4 overflow-auto rounded-3xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                        {JSON.stringify(reportData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
