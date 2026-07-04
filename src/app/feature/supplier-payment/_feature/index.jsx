'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import SupplierPaymentTable from './components/SupplierPaymentTable';
import PendingSupplierTable from './components/PendingSupplierTable';
import SupplierPaymentSlider from './components/SupplierPaymentSlider';

const getSearchableText = (value) => String(value ?? '').toLowerCase();

export default function SupplierPaymentFeature({ initialPayments = [], pendingSuppliers = [], paymentMethods = [], userInfo, paymentDueList = [] }) {
    const router = useRouter();
    const [sliderOpen, setSliderOpen] = useState(false);
    const [draft, setDraft] = useState(null);
    const [query, setQuery] = useState('');

    const filteredPayments = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return initialPayments;

        return initialPayments.filter(item =>
            getSearchableText(item.payment_no).includes(q) ||
            getSearchableText(item.supplier_name).includes(q) ||
            getSearchableText(item.payment_date).includes(q) ||
            getSearchableText(item.remarks).includes(q)
        );
    }, [initialPayments, query]);

    const filteredPending = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return pendingSuppliers;

        return pendingSuppliers.filter(item =>
            getSearchableText(item.supplier_code).includes(q) ||
            getSearchableText(item.supplier_name).includes(q) ||
            getSearchableText(item.phone).includes(q) ||
            getSearchableText(item.email).includes(q) ||
            getSearchableText(item.address).includes(q)
        );
    }, [pendingSuppliers, query]);

    const pendingDueTotal = useMemo(
        () => pendingSuppliers.reduce((sum, item) => sum + Number(item.previous_due || 0), 0),
        [pendingSuppliers]
    );

    const openCreate = (supplier = null) => {
        setDraft(supplier);
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
                            Supplier payments
                        </p>
                        <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">Payments and pending dues</h2>

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
                        placeholder="Search payment no, supplier, or remarks…"
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
                    Showing {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
                <SupplierPaymentTable payments={filteredPayments} />
                <PendingSupplierTable suppliers={filteredPending} onPayNow={openCreate} />
            </div>

            <SupplierPaymentSlider
                key={`${sliderOpen ? 'open' : 'closed'}-${draft?.id ?? draft?.supplier_code ?? 'new'}`}
                isOpen={sliderOpen}
                onClose={handleClose}
                userInfo={userInfo}
                paymentMethods={paymentMethods}
                pendingSuppliers={pendingSuppliers}
                initialData={draft}
                onSaved={handleSaved}
                paymentDueList={paymentDueList}
            />
        </div>
    );
}