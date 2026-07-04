'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomerDueTable from './components/CustomerDueTable';
import PendingCustomerTable from './components/PendingCustomerTable';
import CustomerDueSlider from './components/CustomerDueSlider';

const getSearchableText = (value) => String(value ?? '').toLowerCase();

export default function CustomerDueCollectionFeature({ initialDues = [], pendingCustomers = [], userInfo, invoiceWiseDue }) {
    const router = useRouter();
    const [sliderOpen, setSliderOpen] = useState(false);
    const [draft, setDraft] = useState(null);
    const [query, setQuery] = useState('');

    const filteredDues = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return initialDues;

        return initialDues.filter(item =>
            getSearchableText(item.invoice_no).includes(q) ||
            getSearchableText(item.customer_name).includes(q) ||
            getSearchableText(item.due_date).includes(q) ||
            getSearchableText(item.remarks).includes(q)
        );
    }, [initialDues, query]);

    const filteredPending = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return pendingCustomers;

        return pendingCustomers.filter(item =>
            getSearchableText(item.customer_code).includes(q) ||
            getSearchableText(item.customer_name).includes(q) ||
            getSearchableText(item.phone).includes(q) ||
            getSearchableText(item.email).includes(q) ||
            getSearchableText(item.address).includes(q)
        );
    }, [pendingCustomers, query]);

    const pendingDueTotal = useMemo(
        () => pendingCustomers.reduce((sum, item) => sum + Number(item.previous_due || 0), 0),
        [pendingCustomers]
    );

    const openCreate = (customer = null) => {
        setDraft(customer);
        setSliderOpen(true);
    };

    const openEdit = (due) => {
        setDraft(due);
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
                            Customer due collection
                        </p>
                        <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">Collections and pending dues</h2>

                    </div>

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
                        placeholder="Search invoice, customer, or remarks…"
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
                    Showing {filteredDues.length} collection{filteredDues.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
                <CustomerDueTable dues={filteredDues} onEdit={openEdit} />
                <PendingCustomerTable customers={filteredPending} onCollectNow={openCreate} />
            </div>

            <CustomerDueSlider
                isOpen={sliderOpen}
                onClose={handleClose}
                userInfo={userInfo}
                pendingCustomers={pendingCustomers}
                initialData={draft}
                onSaved={handleSaved}
                invoiceWiseDue={invoiceWiseDue}
            />
        </div>
    );
}