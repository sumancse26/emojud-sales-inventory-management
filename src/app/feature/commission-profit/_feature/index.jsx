'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CommissionProfitTable from './components/CommissionProfitTable';
import CommissionProfitSlider from './components/CommissionProfitSlider';

const getSearchableText = (value) => String(value ?? '').toLowerCase();

export default function CommissionProfitFeature({ initialCommissions = [], userInfo }) {
    const router = useRouter();
    const [sliderOpen, setSliderOpen] = useState(false);
    const [draft, setDraft] = useState(null);
    const [query, setQuery] = useState('');

    const filteredCommissions = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return initialCommissions;

        return initialCommissions.filter(item =>
            getSearchableText(item.invoice_id).includes(q) ||
            getSearchableText(item.product_id).includes(q) ||
            getSearchableText(item.year_id).includes(q) ||
            getSearchableText(item.month_id).includes(q) ||
            getSearchableText(item.received_date).includes(q)
        );
    }, [initialCommissions, query]);

    const openCreate = () => {
        setDraft(null);
        setSliderOpen(true);
    };

    const openEdit = (record) => {

        console.log(record);
        setDraft(record);
        setSliderOpen(true);
    };

    const handleClose = () => {
        setSliderOpen(false);
        setDraft(null);
    };

    const handleSaved = () => router.refresh();

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-emerald-200/70 dark:border-emerald-500/15 bg-linear-to-br from-emerald-50 via-white to-cyan-50 dark:from-emerald-500/10 dark:via-[#0d1729] dark:to-slate-950 p-5 sm:p-6 shadow-sm shadow-emerald-100/60 dark:shadow-none">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                            Shop wise commission
                        </p>
                        <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">Commission profit tracking</h2>
                        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                            Manage invoice-level commissions, track paid status, and keep profit percentages aligned with shop sales records.
                        </p>
                    </div>

                    <button
                        onClick={openCreate}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm shadow-emerald-600/25 hover:shadow-emerald-500/30 transition-all"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        New Commission
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search invoice, product, or period..."
                        className="w-full bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Showing {filteredCommissions.length} record{filteredCommissions.length !== 1 ? 's' : ''}
                </p>
            </div>

            <CommissionProfitTable commissions={filteredCommissions} onEdit={openEdit} />

            <CommissionProfitSlider
                isOpen={sliderOpen}
                onClose={handleClose}
                userInfo={userInfo}
                initialData={draft}
                onSaved={handleSaved}
            />
        </div>
    );
}
