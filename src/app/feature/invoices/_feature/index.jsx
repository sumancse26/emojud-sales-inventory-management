'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import InvoiceTable from './components/InvoiceTable';
import InvoiceSlider from './components/InvoiceSlider';

export default function InvoiceFeature({ initialInvoices = [], customers = [], shops = [], products = [], userInfo }) {
    const router = useRouter();
    const [sliderOpen, setSliderOpen] = useState(false);
    const [sliderMode, setSliderMode] = useState('create');
    const [selectedId, setSelectedId] = useState(null);
    const [query, setQuery] = useState('');
    const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(0);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return initialInvoices;
        return initialInvoices.filter(inv =>
            inv.invoice_no?.toLowerCase().includes(q) ||
            inv.customer_name?.toLowerCase().includes(q) ||
            inv.phone?.toLowerCase().includes(q)
        );
    }, [initialInvoices, query]);

    const openCreate = () => { setIsAlreadySubmitted(0); setSliderMode('create'); setSelectedId(null); setSliderOpen(true); };
    const openView = (id) => { setSliderMode('view'); setSelectedId(id); setSliderOpen(true); };
    const openEdit = (inv) => { setIsAlreadySubmitted(inv.is_submit); setSliderMode('edit'); setSelectedId(inv.id); setSliderOpen(true); };
    const handleClose = () => { setSliderOpen(false); setSelectedId(null); };
    const handleSaved = () => router.refresh();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sales Invoices</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Customer invoices &amp; receivables
                    </p>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-emerald-600/25 hover:shadow-emerald-500/30 shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    New Invoice
                </button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search by invoice no, customer or phone…"
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-700/50 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all"
                    />
                    {query && (
                        <button onClick={() => setQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                <p className="text-sm text-slate-400 dark:text-slate-500 shrink-0">
                    {filtered.length} of {initialInvoices.length}
                </p>
            </div>

            {/* Table */}
            <InvoiceTable invoices={filtered} onView={openView} onEdit={openEdit} />

            {/* Slider */}
            <InvoiceSlider
                isOpen={sliderOpen}
                onClose={handleClose}
                mode={sliderMode}
                selectedId={selectedId}
                customers={customers}
                shops={shops}
                products={products}
                userInfo={userInfo}
                onSaved={handleSaved}
                isAlreadySubmitted={isAlreadySubmitted}
            />
        </div>
    );
}

