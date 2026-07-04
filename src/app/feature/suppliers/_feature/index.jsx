'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import SupplierTable from './components/SupplierTable';
import SupplierSlider from './components/SupplierSlider';

export default function SuppliersFeature({ initialSuppliers, shops, userInfo }) {
    const router = useRouter();
    const [sliderOpen, setSliderOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return initialSuppliers;
        return initialSuppliers.filter(s =>
            s.supplier_name?.toLowerCase().includes(q) ||
            s.phone?.toLowerCase().includes(q) ||
            s.supplier_code?.toLowerCase().includes(q) ||
            s.email?.toLowerCase().includes(q)
        );
    }, [initialSuppliers, query]);

    const openCreate = () => { setEditData(null); setSliderOpen(true); };
    const openEdit = (s) => { setEditData(s); setSliderOpen(true); };
    const handleClose = () => { setSliderOpen(false); setEditData(null); };
    const handleSaved = () => router.refresh();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Suppliers</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Manage your supplier directory and contact information
                    </p>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-emerald-600/25 hover:shadow-emerald-500/30 shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Supplier
                </button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search by name, phone or code…"
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-700/50 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all"
                    />
                    {query && (
                        <button onClick={() => setQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                {query && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
                        {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Table */}
            <SupplierTable suppliers={filtered} onEdit={openEdit} />

            {/* Slider */}
            <SupplierSlider
                isOpen={sliderOpen}
                onClose={handleClose}
                shops={shops}
                userInfo={userInfo}
                onSaved={handleSaved}
                editData={editData}
            />
        </div>
    );
}
