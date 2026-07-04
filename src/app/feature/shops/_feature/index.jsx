'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ShopCard from './components/ShopCard';
import ShopSlider from './components/ShopSlider';

export default function ShopsFeature({ initialShops = [], userInfo }) {
    const router = useRouter();
    const [sliderOpen, setSliderOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return initialShops;
        return initialShops.filter(s =>
            s.shop_name?.toLowerCase().includes(q) ||
            s.display_code?.toLowerCase().includes(q) ||
            s.short_code?.toLowerCase().includes(q) ||
            s.phone?.toLowerCase().includes(q) ||
            s.address?.toLowerCase().includes(q)
        );
    }, [initialShops, search]);

    const openCreate = () => { setEditData(null); setSliderOpen(true); };
    const openEdit = (shop) => { setEditData(shop); setSliderOpen(true); };
    const handleClose = () => setSliderOpen(false);
    const handleSaved = () => { setSliderOpen(false); router.refresh(); };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Shops</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage all branches and outlets</p>
                </div>
                <button onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-emerald-600/25 hover:shadow-emerald-500/30 self-start sm:self-auto">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Shop
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                </span>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search shops…"
                    className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#0d1729] border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all"
                />
                {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(shop => (
                        <ShopCard key={shop.id} shop={shop} onEdit={openEdit} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <span className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </span>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No shops found</p>
                    {search && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting your search</p>}
                </div>
            )}

            {/* Slider */}
            <ShopSlider
                isOpen={sliderOpen}
                onClose={handleClose}
                onSaved={handleSaved}
                userInfo={userInfo}
                editData={editData}
            />
        </div>
    );
}

