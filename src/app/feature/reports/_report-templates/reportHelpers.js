export function renderValue(value) {
    if (value === null || value === undefined) return '—';
    if (Array.isArray(value) || typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

export function formatNumber(value) {
    if (value === null || value === undefined || value === '') return '—';
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString();
}

export function extractRows(reportData) {
    if (!reportData) return [];
    const possibleArrays = [
        reportData.rows,
        reportData.items,
        reportData.data,
        reportData.list,
        reportData.results,
        reportData.entries
    ];
    return possibleArrays.find(Array.isArray) || [];
}

export function renderTable(rows) {
    if (!rows.length) {
        return (
            <p className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                No rows were returned for this report.
            </p>
        );
    }

    const firstRow = rows[0] || {};
    const columns = Object.keys(firstRow);
    const totals = {};

    columns.forEach((column) => {
        let sum = 0;
        let isNumeric = true;
        for (const row of rows) {
            const value = row?.[column];
            const numericValue = Number(value);
            if (value === null || value === undefined || value === '') continue;
            if (Number.isNaN(numericValue)) {
                isNumeric = false;
                break;
            }
            sum += numericValue;
        }
        if (isNumeric) totals[column] = sum;
    });

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-slate-100 text-left text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                        <tr>
                            {columns.map((column) => (
                                <th key={column} className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                                    {column.replace(/_/g, ' ')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                        {rows.map((row, rowIndex) => (
                            <tr
                                key={row.id ?? rowIndex}
                                className={rowIndex % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900' : ''}>
                                {columns.map((column) => (
                                    <td
                                        key={column}
                                        className="border-b border-slate-200 px-4 py-3 align-top text-xs dark:border-slate-700">
                                        <pre className="whitespace-pre-wrap">{renderValue(row[column])}</pre>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {Object.keys(totals).length ? (
                            <tr className="bg-slate-100 dark:bg-slate-900">
                                {columns.map((column) => (
                                    <td
                                        key={column}
                                        className="border-t border-slate-200 px-4 py-3 text-xs font-semibold dark:border-slate-700">
                                        {totals[column] !== undefined ? formatNumber(totals[column]) : ''}
                                    </td>
                                ))}
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function renderSummaryCards(summary) {
    if (!summary || typeof summary !== 'object' || !Object.keys(summary).length) return null;

    const entries = Object.entries(summary).filter(([key]) => key !== 'title');
    if (!entries.length) return null;

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {entries.map(([key, value]) => (
                <div
                    key={key}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        {key.replace(/_/g, ' ')}
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        {renderValue(value)}
                    </p>
                </div>
            ))}
        </div>
    );
}

export function extractFooter(reportData) {
    if (!reportData || typeof reportData !== 'object') return null;

    const footerData = reportData.footer ?? reportData.totals ?? reportData.summary_footer ?? reportData.footer_data;
    if (!footerData) return null;

    if (Array.isArray(footerData)) {
        if (footerData.length === 0) return null;
        if (footerData.length === 1 && typeof footerData[0] === 'object') return footerData[0];
        return { footer: renderValue(footerData) };
    }

    if (typeof footerData === 'object') return footerData;
    return { footer: footerData };
}

export function renderObjectDetails(reportData) {
    if (!reportData || typeof reportData !== 'object' || Array.isArray(reportData)) return null;

    const ignoredKeys = new Set([
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

    const entries = Object.entries(reportData).filter(([key]) => !ignoredKeys.has(key));
    if (!entries.length) return null;

    return (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Report details</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {entries.map(([key, value]) => (
                    <div
                        key={key}
                        className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            {key.replace(/_/g, ' ')}
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100 break-words">
                            {renderValue(value)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
