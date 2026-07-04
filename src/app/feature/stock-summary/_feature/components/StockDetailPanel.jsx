'use client';

import { useEffect, useState } from 'react';
import { getStockSummaryDetail } from '@/services/stockSummary';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3 text-sm';

export default function StockDetailPanel({ isOpen, onClose, product }) {
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !product?.id) return;
        setDetails([]);
        setError(null);
        setLoading(true);

        getStockSummaryDetail(product.id)
            .then(res => {
                const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
                setDetails(data);
            })
            .catch(() => setError('Failed to load stock details. Please try again.'))
            .finally(() => setLoading(false));
    }, [isOpen, product?.id]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-2xl bg-white dark:bg-[#0d1729] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-violet-100 dark:bg-violet-500/10">
                            <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                        </span>
                        <div className="min-w-0">
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                                Stock Details
                            </h2>
                            {product && (
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                    <span className="font-mono text-violet-600 dark:text-violet-400">{product.product_code}</span>
                                    {' · '}{product.product_name}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0 ml-2"
                        aria-label="Close"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Product summary strip */}
                {product && (
                    <div className="px-6 py-3 bg-slate-50/80 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800/40 shrink-0 flex flex-wrap gap-x-6 gap-y-1">
                        {[
                            { label: 'Category', value: product.category_name },
                            { label: 'Brand', value: product.brand_name },
                            { label: 'Unit', value: product.unit_name },
                            {
                                label: 'Available Stock',
                                value: (
                                    <span className={`font-bold tabular-nums ${product.avail_stock <= 0 ? 'text-rose-600 dark:text-rose-400' : product.avail_stock <= 5 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                        {product.avail_stock}
                                        {product.avail_stock <= 0 && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/15">Out</span>}
                                        {product.avail_stock > 0 && product.avail_stock <= 5 && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/15">Low</span>}
                                    </span>
                                ),
                            },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-center gap-1.5">
                                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}:</span>
                                <span className="text-xs text-slate-700 dark:text-slate-300">{value ?? '—'}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {loading && (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400 dark:text-slate-600">
                            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                            <p className="text-sm">Loading lot details…</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="flex flex-col items-center justify-center h-full gap-2 px-6">
                            <svg className="w-10 h-10 text-rose-300 dark:text-rose-700 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
                            </svg>
                            <p className="text-sm text-rose-600 dark:text-rose-400 font-medium text-center">{error}</p>
                        </div>
                    )}

                    {!loading && !error && details.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400 dark:text-slate-600">
                            <svg className="w-12 h-12 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                            </svg>
                            <p className="text-sm font-medium">No lot details found</p>
                        </div>
                    )}

                    {!loading && !error && details.length > 0 && (
                        <div className="p-4">
                            <div className="rounded-xl border border-slate-200/60 dark:border-slate-700/40 overflow-hidden">
                                <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-700/40 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Lot Details
                                    </span>
                                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                        {details.length} {details.length === 1 ? 'lot' : 'lots'}
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/60 dark:border-slate-800/40">
                                            <tr>
                                                <th className={TH}>#</th>
                                                <th className={TH}>Lot No</th>
                                                <th className={TH}>Purchase No</th>
                                                <th className={TH}>Supplier</th>
                                                <th className={`${TH} text-right`}>Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {details.map((row, i) => (
                                                <tr
                                                    key={row.id}
                                                    className={`border-b border-slate-100 dark:border-slate-800/30 last:border-0 ${i % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}
                                                >
                                                    <td className={`${TD} w-10`}>
                                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                                            {i + 1}
                                                        </span>
                                                    </td>
                                                    <td className={TD}>
                                                        <span className="font-mono text-[11px] font-semibold text-violet-600 dark:text-violet-400 break-all">
                                                            {row.lot_no}
                                                        </span>
                                                    </td>
                                                    <td className={TD}>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">
                                                            {row.pr_no}
                                                        </span>
                                                    </td>
                                                    <td className={`${TD} text-slate-600 dark:text-slate-300`}>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                                            {row.supplier_name}
                                                        </div>
                                                    </td>
                                                    <td className={`${TD} text-right`}>
                                                        <span className="font-bold tabular-nums text-slate-800 dark:text-slate-100">
                                                            {row.qty}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-slate-50/80 dark:bg-slate-800/30 border-t border-slate-200/60 dark:border-slate-700/40">
                                            <tr>
                                                <td colSpan={4} className="px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                                                    Total Qty
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <span className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                                                        {details.reduce((s, r) => s + Number(r.qty || 0), 0)}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200/60 dark:border-slate-800/50 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
