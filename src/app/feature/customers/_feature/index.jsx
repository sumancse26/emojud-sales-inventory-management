'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CustomerTable from './components/CustomerTable';
import CustomerSlider from './components/CustomerSlider';

export default function CustomersFeature({ initialCustomers = [], userInfo }) {
    const router = useRouter();
    const [sliderOpen, setSliderOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search.trim()) return initialCustomers;
        const q = search.toLowerCase();
        return initialCustomers.filter(c =>
            c.customer_name?.toLowerCase().includes(q) ||
            c.phone?.toLowerCase().includes(q) ||
            c.customer_code?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q)
        );
    }, [initialCustomers, search]);

    const openCreate = () => { setEditData(null); setSliderOpen(true); };
    const openEdit = (c) => { setEditData(c); setSliderOpen(true); };
    const handleClose = () => { setSliderOpen(false); setEditData(null); };
    const handleSaved = () => router.refresh();

    return (
        <div className="space-y-6">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, phone, code, email…"
                        className="w-full bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all shadow-sm"
                    />
                </div>

                <button onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm shadow-emerald-600/25 hover:shadow-emerald-500/30 transition-all shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    New Customer
                </button>
            </div>

            {/* Table */}
            <CustomerTable customers={filtered} onEdit={openEdit} />

            {/* Slider */}
            <CustomerSlider
                isOpen={sliderOpen}
                onClose={handleClose}
                userInfo={userInfo}
                onSaved={handleSaved}
                editData={editData}
            />
        </div>
    );
}
